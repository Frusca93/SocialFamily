import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { commentSchema } from '@/lib/validations/comment';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 });
  const { postId, content, fileBase64 } = body;

  let imageUrl = null;
  if (fileBase64) {
    const uploadRes = await cloudinary.uploader.upload(fileBase64, { folder: 'post-images' });
    imageUrl = uploadRes.secure_url;
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      content,
      authorId: (session.user as any).id,
      image: imageUrl // aggiungi il campo image al modello se serve
    }
  });
  return Response.json(comment);
}
