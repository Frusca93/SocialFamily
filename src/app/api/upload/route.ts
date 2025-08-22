import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function err(msg: string, status = 400) { return Response.json({ error: msg }, { status }) }

export async function POST(req: Request) {
  try {
    const ct = req.headers.get('content-type') || ''
    if (!ct.startsWith('multipart/form-data')) return err('Invalid content-type', 415)
    const fd = await req.formData()
    const file = fd.get('file') as File | null
    const type = (fd.get('type')?.toString() || 'image') as 'image' | 'video'
    if (!file || file.size <= 0) return err('Missing file', 400)
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    const folder = type === 'video' ? 'post-videos' : 'post-images'
    const uploadRes = await cloudinary.uploader.upload(base64, { folder })
    return Response.json({ url: uploadRes.secure_url })
  } catch (e: any) {
    return err('Upload error', 500)
  }
}
