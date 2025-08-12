import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <main className="mt-6 space-y-6">{children}</main>
    </div>
  )
}
