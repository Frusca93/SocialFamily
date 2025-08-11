import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()

async function main(){
  const passwordHash = await hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'demo@socialbook.dev' },
    update: {},
    create: { name: 'Demo User', username: 'demo', email: 'demo@socialbook.dev', passwordHash }
  })
}

main().finally(() => prisma.$disconnect())
