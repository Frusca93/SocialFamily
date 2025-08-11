import { NextAuthOptions, getServerSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { loginSchema } from './validations'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null
        const ok = await compare(password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, name: user.name, email: user.email, image: user.image, username: user.username }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.username = (user as any).username;
        token.language = (user as any).language;
      } else if (token.id) {
        // Aggiorna sempre username e language dal db se già loggato
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } })
        if (dbUser) {
          token.username = dbUser.username;
          token.language = dbUser.language;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id;
        ;(session.user as any).username = token.username;
        ;(session.user as any).language = token.language;
      }
      return session;
    }
  }
}

export const getSession = () => getServerSession(authOptions)
