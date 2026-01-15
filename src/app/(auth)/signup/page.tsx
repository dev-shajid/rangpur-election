import Logo from '@/components/Logo';
import { SignUpForm } from '@/components/signup-form';
import Link from 'next/link';

export const metadata = {
    title: "Admin Sign Up | Rangpur Election Info",
};

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-background p-8 rounded shadow-md w-96">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <Logo/>
                        <h2 className="mt-6 text-3xl font-extrabold">
                            Admin Portal Login
                        </h2>
                        <p className="mt-2 text-sm">
                            Secure access for District Admins only.
                        </p>
                    </div>
                    <SignUpForm />
                </div>

                <div className="text-center mt-4">
                    <Link href="/" className="text-emerald-600 hover:text-emerald-500 text-sm font-medium">
                        &larr; Back to Public Site
                    </Link>
                </div>
            </div>
        </div>
    );
}
