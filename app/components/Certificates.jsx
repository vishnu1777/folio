'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { FaExternalLinkAlt, FaTimesCircle, FaGraduationCap } from 'react-icons/fa';

export default function Certificates() {
    const [activeCertificate, setActiveCertificate] = useState(null);
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

    // Responsive hooks
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    // Reference to the certificates container
    const containerRef = useRef(null);

    // Sample certificates data
    const certificates = [
        {
            id: 1,
            title: "AWS Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2023",
            image: "/certificates/aws-cert.jpg",
            link: "https://www.credly.com/your-badge-link",
            description: "Foundational understanding of AWS Cloud services, architecture, security, and compliance.",
            color: "from-blue-500 to-teal-300",
            size: "lg",
            orbitRadius: 1.4,
            orbitSpeed: 80,
            startOffset: 0,
        },
        {
            id: 2,
            title: "React Developer",
            issuer: "Meta",
            date: "2022",
            image: "/certificates/react-cert.jpg",
            link: "https://www.coursera.org/your-certificate-link",
            description: "Advanced React concepts including hooks, state management, context API and testing.",
            color: "from-blue-400 to-indigo-500",
            size: "md",
            orbitRadius: 1,
            orbitSpeed: 100,
            startOffset: 120,
        },
        {
            id: 3,
            title: "JavaScript Algorithms",
            issuer: "freeCodeCamp",
            date: "2022",
            image: "/certificates/js-cert.jpg",
            link: "https://www.freecodecamp.org/your-certificate",
            description: "Data structures, algorithms, and object-oriented programming in JavaScript.",
            color: "from-yellow-400 to-orange-500",
            size: "sm",
            orbitRadius: 0.7,
            orbitSpeed: 60,
            startOffset: 240,
        },
        {
            id: 4,
            title: "UI/UX Design",
            issuer: "Google",
            date: "2023",
            image: "/certificates/ui-ux-cert.jpg",
            link: "https://www.coursera.org/your-certificate-link",
            description: "User experience research, wireframing, prototyping, and testing interactive designs.",
            color: "from-green-400 to-emerald-500",
            size: "md",
            orbitRadius: 1.2,
            orbitSpeed: 90,
            startOffset: 30,
        },
        {
            id: 5,
            title: "Fullstack Development",
            issuer: "Udemy",
            date: "2022",
            image: "/certificates/fullstack-cert.jpg",
            link: "https://www.udemy.com/your-certificate/",
            description: "Building end-to-end web applications with modern frameworks and databases.",
            color: "from-pink-500 to-purple-600",
            size: "lg",
            orbitRadius: 0.9,
            orbitSpeed: 120,
            startOffset: 190,
        },
    ];

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [inView, controls]);

    // Close the active certificate when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeCertificate && !event.target.closest('.certificate-modal')) {
                setActiveCertificate(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeCertificate]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.6,
            }
        }
    };

    const celestialBodyVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (custom) => ({
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                delay: custom * 0.1,
                duration: 0.8,
            }
        }),
        hover: {
            scale: 1.1,
            filter: "brightness(1.2)",
            transition: { duration: 0.3 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.3
            }
        }
    };

    // Render stars in the background
    const renderStars = () => {
        return [...Array(150)].map((_, i) => {
            const size = Math.random() * 2 + 1;
            const isAnimated = Math.random() > 0.7;
            const top = `${Math.random() * 100}%`;
            const left = `${Math.random() * 100}%`;
            const delay = Math.random() * 5;
            const duration = 1 + Math.random() * 3;

            return (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        top,
                        left,
                        boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255, 255, 255, 0.8)`
                    }}
                    animate={isAnimated ? {
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1]
                    } : {}}
                    transition={isAnimated ? {
                        duration,
                        repeat: Infinity,
                        delay,
                    } : {}}
                />
            );
        });
    };

    // Get title words with proper sizing
    const getTitleWithSizing = (title, size) => {
        const words = title.split(' ');
        const wordCount = words.length;

        // Determine text size based on word count and planet size
        let textSizeClass = 'text-xs';
        if (size === 'lg') {
            textSizeClass = wordCount <= 2 ? 'text-sm' : 'text-xs';
        } else if (size === 'md') {
            textSizeClass = wordCount <= 2 ? 'text-xs' : 'text-[10px]';
        } else {
            textSizeClass = 'text-[9px]';
        }

        return (
            <div className={`${textSizeClass} font-medium leading-tight text-center`}>
                {words.map((word, i) => (
                    <div key={i} className="line-clamp-1">{word}</div>
                ))}
            </div>
        );
    };

    // Render the certificates as celestial bodies
    return (
        <section id="certificates" className="relative min-h-screen py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 overflow-hidden">
            {/* Stars background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {renderStars()}

                {/* Nebula effects */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-96 rounded-full bg-pink-500/10 blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                {/* Section header */}
                <div className="text-center mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
                    >
                        My <span className="text-pink-400">Certificates</span>
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isMobile ? "100px" : "150px" }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4 md:mb-6 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg px-4"
                    >
                        Professional certifications and achievements that validate my expertise and commitment to continuous learning.
                    </motion.p>
                </div>

                {/* Certificates galaxy container */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="relative mx-auto"
                    style={{ height: isMobile ? "500px" : "600px" }}
                >
                    {/* Central glow */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/20 blur-2xl"></div>

                    {/* Sun (central celestial body) */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 z-10 flex items-center justify-center"
                        animate={{
                            boxShadow: ['0 0 20px 5px rgba(255, 105, 180, 0.6)', '0 0 30px 8px rgba(255, 105, 180, 0.8)', '0 0 20px 5px rgba(255, 105, 180, 0.6)'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <FaGraduationCap className="text-white text-4xl" />
                    </motion.div>

                    {/* Orbit paths (for visual effect) */}
                    {certificates.map(cert => (
                        <div
                            key={`orbit-${cert.id}`}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-500/10"
                            style={{
                                width: `${cert.orbitRadius * (isMobile ? 260 : 400)}px`,
                                height: `${cert.orbitRadius * (isMobile ? 260 : 400)}px`
                            }}
                        ></div>
                    ))}

                    {/* Certificate celestial bodies */}
                    {certificates.map((certificate, index) => {
                        // Calculate size based on the size property
                        let size;
                        switch (certificate.size) {
                            case 'lg': size = isMobile ? 70 : 90; break;
                            case 'md': size = isMobile ? 60 : 75; break;
                            default: size = isMobile ? 50 : 65; // 'sm' is default
                        }

                        // Calculate orbit properties
                        const orbitRadius = certificate.orbitRadius * (isMobile ? 130 : 200); // px
                        const orbitDuration = certificate.orbitSpeed; // seconds

                        return (
                            <motion.div
                                key={certificate.id}
                                custom={index}
                                variants={celestialBodyVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setActiveCertificate(certificate)}
                                className="absolute cursor-pointer"
                                animate={{
                                    x: [
                                        Math.cos((certificate.startOffset / 180) * Math.PI) * orbitRadius,
                                        Math.cos(((certificate.startOffset + 90) / 180) * Math.PI) * orbitRadius,
                                        Math.cos(((certificate.startOffset + 180) / 180) * Math.PI) * orbitRadius,
                                        Math.cos(((certificate.startOffset + 270) / 180) * Math.PI) * orbitRadius,
                                        Math.cos((certificate.startOffset / 180) * Math.PI) * orbitRadius,
                                    ],
                                    y: [
                                        Math.sin((certificate.startOffset / 180) * Math.PI) * orbitRadius,
                                        Math.sin(((certificate.startOffset + 90) / 180) * Math.PI) * orbitRadius,
                                        Math.sin(((certificate.startOffset + 180) / 180) * Math.PI) * orbitRadius,
                                        Math.sin(((certificate.startOffset + 270) / 180) * Math.PI) * orbitRadius,
                                        Math.sin((certificate.startOffset / 180) * Math.PI) * orbitRadius,
                                    ],
                                }}
                                transition={{
                                    duration: orbitDuration,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    marginLeft: `-${size / 2}px`,
                                    marginTop: `-${size / 2}px`,
                                }}
                            >
                                {/* Outer glow - using multiple layers for perfect circular glow */}
                                <div className="absolute inset-0 rounded-full opacity-40"
                                    style={{
                                        background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
                                        transform: 'scale(1.4)',
                                    }}
                                />

                                {/* Pulsing glow animation */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
                                    }}
                                    animate={{
                                        scale: [1.2, 1.5, 1.2],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        repeatType: "reverse"
                                    }}
                                />

                                {/* Certificate planet - main circle */}
                                <div
                                    className={`relative w-full h-full rounded-full bg-gradient-to-br ${certificate.color} flex items-center justify-center overflow-hidden p-2 z-10`}
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }}
                                >
                                    {/* Certificate title with proper sizing */}
                                    <div className="text-white font-bold">
                                        {getTitleWithSizing(certificate.title, certificate.size)}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Instructions text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center text-gray-400 mt-6 italic text-sm"
                >
                    Click on any certificate to view details
                </motion.p>
            </div>

            {/* Certificate detail modal */}
            <AnimatePresence>
                {activeCertificate && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="certificate-modal bg-gradient-to-br from-gray-800 via-purple-900 to-pink-900 border border-pink-500/20 rounded-xl overflow-hidden shadow-2xl max-w-md w-full"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Certificate header */}
                            <div className={`p-4 md:p-6 bg-gradient-to-r ${activeCertificate.color}`}>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl md:text-2xl font-bold text-white">
                                        {activeCertificate.title}
                                    </h3>
                                    <button
                                        onClick={() => setActiveCertificate(null)}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <FaTimesCircle size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Certificate content */}
                            <div className="p-4 md:p-6 space-y-4">
                                {/* Certificate image */}
                                <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-lg border-2 border-pink-500/30">
                                    {/* Placeholder for certificate image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className={`text-5xl md:text-6xl mx-auto mb-2 bg-gradient-to-r ${activeCertificate.color} text-transparent bg-clip-text`}>
                                                <FaGraduationCap />
                                            </div>
                                            <p className="text-gray-300 text-sm">Certificate Preview</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Issuer:</span>
                                        <span className="text-white font-medium">{activeCertificate.issuer}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="text-white">{activeCertificate.date}</span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-gray-300 text-sm">{activeCertificate.description}</p>
                                    </div>
                                </div>

                                {/* Certificate verification link */}
                                <div className="pt-2">
                                    <motion.a
                                        href={activeCertificate.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Verify Certificate <FaExternalLinkAlt />
                                    </motion.a>
                                </div>

                                {/* Celestial animation details */}
                                <div className="border-t border-pink-500/20 pt-3 mt-4">
                                    <p className="text-xs text-gray-500 italic">
                                        You discovered certificate #{activeCertificate.id} in the celestial portfolio universe.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}