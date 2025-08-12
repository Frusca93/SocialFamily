import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={className} aria-label="Home">
      <Image src="/logo2258.png" alt="SocialFamily logo" width={64} height={64} priority />
    </Link>
  )
}
