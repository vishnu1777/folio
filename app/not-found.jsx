// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6 text-lg">Sorry, the page you are looking for does not exist.</p>
            <Link href="/">
                <span className="text-pink-500 hover:underline">Go back home</span>
            </Link>
        </div>
    );
}
