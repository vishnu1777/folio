'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimation from '../components/LoadingAnimation';

export default function LoadingPage() {
    const router = useRouter();
    const redirectTimerRef = useRef(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        // Prevent double initialization
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        // Check if this is actually the user's first visit
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

        if (hasVisitedBefore === 'true') {
            // Skip loading animation if user has visited before
            router.push('/');
            return;
        }

        // Mark that the user has visited
        localStorage.setItem('hasVisitedBefore', 'true');

        // Simulate loading and redirect to home page after 3 seconds
        redirectTimerRef.current = setTimeout(() => {
            router.push('/');
        }, 3100); // Slightly longer than the animation to ensure it completes

        // Clean up timer when component unmounts
        return () => {
            if (redirectTimerRef.current) {
                clearTimeout(redirectTimerRef.current);
            }
        };
    }, [router]);

    return <LoadingAnimation />;
}