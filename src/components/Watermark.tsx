import Image from 'next/image'

export default function Watermark() {
  return (
    <div className="fixed top-1/2 left-1/2 max-w-125 w-full p-4 -translate-1/2 opacity-10 select-none pointer-events-none z-0">
        <Image
            src="/watermark-logo.jpeg"
            alt="Watermark"
            width={500}
            height={500}
            className='rounded-full'
        />
    </div>
  )
}
