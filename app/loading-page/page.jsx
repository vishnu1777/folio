'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimation from '../components/LoadingAnimation';

export default function LoadingPage() {
    const router = useRouter();

    useEffect(() => {
        // Simulate loading and redirect to home page after 3 seconds
        const redirectTimer = setTimeout(() => {
            router.push('/');
        }, 3000);

        // Clean up timer when component unmounts
        return () => clearTimeout(redirectTimer);
    }, [router]);

    return <LoadingAnimation />;
}