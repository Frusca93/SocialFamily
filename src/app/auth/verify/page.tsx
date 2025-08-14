import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LegacyVerifyPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const tokenParam = searchParams?.token
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || ''
  if (token) {
    redirect(`/verify?token=${encodeURIComponent(token)}`)
  }
  redirect('/verify')
}
