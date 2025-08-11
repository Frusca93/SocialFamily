import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/i, 'Solo lettere/numeri/_'),
  email: z.string().email(),
  password: z.string().min(6)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const postSchema = z.object({
  content: z.string().min(1),
  mediaUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  mediaType: z.enum(['image', 'video']).optional()
})

export const commentSchema = z.object({
  postId: z.string().cuid(),
  content: z.string().min(1)
})
