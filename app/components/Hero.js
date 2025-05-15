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

    // Heartbeat animation - SLOWED DOWN
    const heartbeatVariants = {
        beat: {
            scale: [1, 1.08, 1, 1.08, 1], // Reduced scale amount for subtler effect
            transition: {
                duration: 2.5, // Increased from 1.5 to 2.5 seconds
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut" // Smoother easing
            }
        }
    };

    // Pulse ring variants - SLOWED DOWN and FIXED
    const pulseRingVariants = {
        pulse: (custom) => ({
            scale: [1, 1.2, 1.4, 1.6, 1.8], // More gradual scaling
            opacity: [0.5, 0.4, 0.3, 0.2, 0], // Start with lower opacity
            transition: {
                duration: 3, // Increased from 2 to 3 seconds
                delay: custom * 0.4, // Increased delay between rings
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeOut" // Smoother fade out
            }
        })
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 px-4 sm:px-6 py-8 sm:py-12">
            {/* Main container with improved responsive spacing */}
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">
                {/* Text content */}
                <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
                        Hi,I&apos;m <span className="text-pink-400">Sahithya D</span>
                    </h1>

                    <div className="h-12 sm:h-16 mb-4 flex items-center justify-center lg:justify-start">
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-[family-name:var(--font-geist-mono)]">
                            I am a <span className="text-pink-300">{typedText}</span>
                            <span className="animate-blink">|</span>
                        </h2>
                    </div>

                    <p className="text-gray-300 text-base sm:text-lg mt-2 sm:mt-4 max-w-md">
                        Passionate about creating beautiful, user-friendly interfaces
                        and solving complex problems with elegant solutions.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
                        <a
                            href="#contact"
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-white text-gray-900 gap-2 hover:bg-gray-200 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6"
                        >
                            Contact Me
                        </a>
                        <a
                            href="#projects"
                            className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6"
                        >
                            View Work
                        </a>
                    </div>
                </div>

                {/* Profile image with animations */}
                <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
                    <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                        {/* Pulse rings - multiple rings that animate outward */}
                        {[0, 1, 2, 3].map((index) => (
                            <motion.div
                                key={index}
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                                variants={pulseRingVariants}
                                animate="pulse"
                                custom={index}
                                style={{ zIndex: 1 }}
                            />
                        ))}

                        {/* Main heartbeat container */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"
                            variants={heartbeatVariants}
                            animate="beat"
                            style={{ zIndex: 2 }}
                        />

                        {/* Profile image */}
                        <motion.div
                            className="absolute inset-2 rounded-full overflow-hidden border-4 border-white"
                            variants={heartbeatVariants}
                            animate="beat"
                            style={{ zIndex: 3 }}
                        >
                            <Image
                                src="/my-image.jpg"
                                alt="Your Name"
                                width={320}
                                height={320}
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