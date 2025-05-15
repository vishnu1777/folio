'use client';
import { useState, useEffect } from 'react';
import { PulseLoader, GridLoader, ScaleLoader } from 'react-spinners';

export default function LoadingAnimation() {
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    // First useEffect to handle hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Second useEffect to handle progress after component is mounted
    useEffect(() => {
        if (!isMounted) return; // Skip if not mounted yet

        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + Math.random() * 10;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 200);

        return () => clearInterval(interval);
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
            <div className="text-white text-center font-[family-name:var(--font-geist-mono)] tracking-widest">
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