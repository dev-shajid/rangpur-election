import { Shield } from 'lucide-react'
import Image from 'next/image'

export default function Logo() {
    return (
        <div className="flex size-12 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
            <Image
                src="/logo.jpeg"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-md"
            />
        </div>
    )
}
