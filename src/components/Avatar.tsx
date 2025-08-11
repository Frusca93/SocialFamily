export default function Avatar({ src, alt }: { src?: string | null, alt?: string }){
  return src ? (
    // per semplicità, <img>; puoi passare a next/image
    <img src={src} alt={alt || 'avatar'} className="h-10 w-10 rounded-full object-cover" />
  ) : (
    <div className="h-10 w-10 rounded-full bg-gray-200" />
  )
}
