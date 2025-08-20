import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Navbar />
  <main className="mt-1.5 sm:mt-6 pb-24 sm:pb-0 space-y-6">{children}</main>
    </div>
  )
}
