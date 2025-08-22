import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={className} aria-label="Home">
  <Image src="/Alora.png" alt="Alora logo" width={64} height={64} priority />
    </Link>
  )
}
