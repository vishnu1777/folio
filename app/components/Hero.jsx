'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
    const [typedText, setTypedText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Add your passions/skills here
    const phrases = [
        "Frontend Developer",
        "UI/UX Enthusiast",
        "JavaScript Expert",
        "Problem Solver",
        "NextJS Developer"
    ];

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[currentPhraseIndex];
            const shouldDelete = isDeleting;

            setTypedText(prev =>
                shouldDelete
                    ? currentPhrase.substring(0, prev.length - 1)
                    : currentPhrase.substring(0, prev.length + 1)
            );

            setTypingSpeed(isDeleting ? 80 : 150);

            if (!isDeleting && typedText === currentPhrase) {
                // Pause at end of typing
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && typedText === '') {
                setIsDeleting(false);
                setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [typedText, currentPhraseIndex, isDeleting, typingSpeed, phrases]);

    // Heartbeat animation - gentle and consistent
    const heartbeatVariants = {
        beat: {
            scale: [1, 1.05, 1, 1.05, 1], // Very subtle scaling
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }
        }
    };

    // Single pulse animation implementation
    const pulseVariants = {
        animate: {
            scale: [1, 1.8],
            opacity: [0.4, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: [0.4, 0, 0.2, 1] // Custom easing for smoother animation
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 px-4 sm:px-6 py-8 sm:py-12">
            {/* Main container with improved responsive spacing and alignment */}
            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12">
                {/* Text content - adjusted spacing for better alignment with image */}
                <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1 mt-6 lg:mt-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">
                        Hi, I&apos;m <span className="text-pink-400">Sahithya D</span>
                    </h1>

                    <div className="h-10 sm:h-12 md:h-12 flex items-center justify-center lg:justify-start mb-2">
                        <h2 className="text-lg sm:text-xl md:text-2xl text-white font-[family-name:var(--font-geist-mono)]">
                            I am a <span className="text-pink-300">{typedText}</span>
                            <span className="animate-blink">|</span>
                        </h2>
                    </div>

                    <p className="text-gray-300 text-sm sm:text-base mt-1 sm:mt-2 max-w-md">
                        Passionate about creating beautiful, user-friendly interfaces
                        and solving complex problems with elegant solutions.
                    </p>

                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center lg:justify-start">
                        <a
                            href="#contact"
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-white text-gray-900 gap-2 hover:bg-gray-200 font-medium text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                        >
                            Contact Me
                        </a>
                        <a
                            href="#projects"
                            className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 font-medium text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                        >
                            View Work
                        </a>
                    </div>
                </div>

                {/* Profile image with animations - with completely redesigned pulse animation */}
                <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2 mb-4 lg:mb-0">
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64">
                        {/* Static backdrop for additional glow effect */}
                        <div className="absolute inset-0 rounded-full bg-pink-500/20" />

                        {/* Each pulse is an independent animation with consistent timing */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-pink-500/30"
                            animate={{
                                scale: [1, 1.8],
                                opacity: [0.4, 0],
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatDelay: 0
                            }}
                        />

                        <motion.div
                            className="absolute inset-0 rounded-full bg-pink-500/30"
                            animate={{
                                scale: [1, 1.8],
                                opacity: [0.4, 0],
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatDelay: 0,
                                delay: 1
                            }}
                        />

                        <motion.div
                            className="absolute inset-0 rounded-full bg-pink-500/30"
                            animate={{
                                scale: [1, 1.8],
                                opacity: [0.4, 0],
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatDelay: 0,
                                delay: 2
                            }}
                        />

                        {/* Main heartbeat container */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-60"
                            variants={heartbeatVariants}
                            animate="beat"
                            style={{ zIndex: 2 }}
                        />

                        {/* Profile image */}
                        <motion.div
                            className="absolute inset-2 rounded-full overflow-hidden border-2 border-white"
                            variants={heartbeatVariants}
                            animate="beat"
                            style={{ zIndex: 3 }}
                        >
                            <Image
                                src="/my-image.jpg"
                                alt="Sahithya D"
                                width={256}
                                height={256}
                                className="object-cover w-full h-full"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}