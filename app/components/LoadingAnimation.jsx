'use client';
import { useState, useEffect, useRef } from 'react';
import { PulseLoader, GridLoader } from 'react-spinners';

export default function LoadingAnimation() {
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const intervalRef = useRef(null);
    const hasStartedRef = useRef(false);

    // First useEffect to handle hydration
    useEffect(() => {
        setIsMounted(true);

        // Clean up when component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Second useEffect to handle progress after component is mounted
    // Uses refs to prevent multiple setIntervals
    useEffect(() => {
        if (!isMounted || hasStartedRef.current) return; // Skip if not mounted or already started

        hasStartedRef.current = true; // Mark that we've started the animation

        // Use a fixed increment to reach 100% in exactly 3 seconds
        // 15 steps (200ms * 15 = 3000ms) to reach 100%
        const increment = 100 / 15;

        intervalRef.current = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + increment;
                if (newProgress >= 100) {
                    // Clear interval once we reach 100%
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    return 100;
                }
                return newProgress;
            });
        }, 200);

    }, [isMounted]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 z-50">
            <div className="relative mb-12">
                {/* Main spinner */}
                <GridLoader
                    color="#ffffff"
                    size={30}
                    margin={2}
                    speedMultiplier={0.8}
                />

                {/* Accent spinners */}
                <div className="absolute -top-10 -left-14 opacity-30">
                    <PulseLoader color="#ff5fff" size={10} />
                </div>
                <div className="absolute -bottom-8 -right-12 opacity-30">
                    <PulseLoader color="#a855f7" size={10} />
                </div>
            </div>

            {/* Progress bar - only render if mounted */}
            {isMounted && (
                <div className="w-48 h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Loading text - only show percentage if mounted */}
            <div className="text-white text-center font-mono tracking-widest">
                <span
                    className="inline-block"
                    style={{
                        display: "inline-block",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem"
                    }}
                >
                    {isMounted ? `${Math.round(progress)}% LOADING` : 'LOADING'}
                </span>
            </div>

            {/* Tagline */}
            <div className="mt-2 text-white/50 text-sm">
                <span>Building something amazing...</span>
            </div>
        </div>
    );
}