'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

export default function Projects() {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.1 });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    // Responsive hooks for adaptive animations
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects'); // Adjust the API endpoint as needed
                const data = await response.json();
                setProjects(data);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }
        }
        fetchProjects();
    }, [])


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0.15 : 0.3 // faster on mobile for better UX
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: isMobile ? 0.6 : 0.8, // slightly faster on mobile
                ease: [0.22, 1, 0.36, 1] // Custom ease curve for elegant motion
            }
        }
    };

    return (
        <section id="projects" className="min-h-screen py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-950 to-pink-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
                    >
                        My <span className="text-pink-400">Projects</span>
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
                        A curated collection of my most significant projects, showcasing my skills and passion for development.
                    </motion.p>
                </div>

                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            whileHover={{
                                y: isMobile ? -5 : -10, // smaller hover effect on mobile
                                transition: { duration: 0.3 }
                            }}
                            className="bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-pink-500/10 group h-full flex flex-col"
                        >
                            {/* Project Image with Overlay */}
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                                />

                                {/* Sparkle overlay effect - fewer sparkles on mobile */}
                                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    {[...Array(isMobile ? 5 : 10)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute rounded-full bg-white"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                                width: `${2 + Math.random() * 2}px`,
                                                height: `${2 + Math.random() * 2}px`,
                                            }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0],
                                                transition: {
                                                    duration: 1.5 + Math.random(),
                                                    repeat: Infinity,
                                                    repeatDelay: 1 + Math.random() * 3,
                                                    delay: Math.random() * 2,
                                                },
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Action buttons - optimized for touch on mobile */}
                                <div className={`absolute ${isMobile ? 'bottom-0 opacity-80' : '-bottom-12'} left-0 right-0 flex justify-between px-4 py-2 ${!isMobile && 'group-hover:bottom-0'} transition-all duration-500 ease-in-out`}>
                                    <motion.a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800/90 p-2 sm:p-3 rounded-full text-white hover:text-pink-400 hover:shadow-glow transition-all duration-300"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaGithub className="text-lg sm:text-xl" />
                                    </motion.a>
                                    <motion.a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800/90 p-2 sm:p-3 rounded-full text-white hover:text-pink-400 hover:shadow-glow transition-all duration-300"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaExternalLinkAlt className="text-lg sm:text-xl" />
                                    </motion.a>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-4 sm:p-6 flex-grow flex flex-col">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center group-hover:text-pink-400 transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="text-gray-300 text-xs sm:text-sm mb-4 flex-grow">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mt-auto">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View more projects button */}
                <motion.div
                    className="mt-8 sm:mt-10 md:mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <motion.a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View More Projects
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}