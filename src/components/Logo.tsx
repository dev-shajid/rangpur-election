import { Shield } from 'lucide-react'

export default function Logo() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5" />
        </div>
    )
}
