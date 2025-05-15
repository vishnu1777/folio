'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const Skills = () => {
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [explodedSkill, setExplodedSkill] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [animationsReady, setAnimationsReady] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    // Client-side only code
    useEffect(() => {
        // Check if we're on mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Force a check on mount to ensure proper setting
        setTimeout(() => {
            checkMobile();
            setAnimationsReady(true); // Enable animations after a delay to ensure proper rendering
        }, 300);

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset explosion after animation completes
    useEffect(() => {
        if (explodedSkill !== null) {
            const timer = setTimeout(() => {
                setExplodedSkill(null);
            }, 1500); // Longer duration for fire effect

            return () => clearTimeout(timer);
        }
    }, [explodedSkill]);

    const skills = [
        { name: 'JavaScript', image: '/skills/javascript.png', proficiency: 90 },
        { name: 'React', image: '/skills/react.png', proficiency: 85 },
        { name: 'NextJS', image: '/skills/nextjs.png', proficiency: 82 },
        { name: 'HTML/CSS', image: '/skills/html-css.png', proficiency: 95 },
        { name: 'UI/UX', image: '/skills/uiux.png', proficiency: 80 },
        { name: 'Tailwind', image: '/skills/tailwind.png', proficiency: 88 },
        { name: 'TypeScript', image: '/skills/typescript.png', proficiency: 75 },
        { name: 'Node.js', image: '/skills/nodejs.png', proficiency: 70 },
    ];

    // Calculate color based on proficiency - updated to match projects aesthetic
    const getColorClass = (proficiency) => {
        if (proficiency >= 90) return 'from-pink-500 to-purple-600';
        if (proficiency >= 80) return 'from-purple-500 to-pink-400';
        if (proficiency >= 70) return 'from-purple-600 to-indigo-500';
        return 'from-indigo-500 to-blue-500';
    };

    // Explosion particles - with purple/pink theme
    const particleCount = 24;
    const generateParticles = () => {
        return Array.from({ length: particleCount }).map((_, i) => {
            const angle = (i / particleCount) * 360;
            // Smaller radius for narrower explosion
            const radius = Math.random() * 60 + 30;
            return {
                x: Math.cos(angle * (Math.PI / 180)) * radius,
                y: Math.sin(angle * (Math.PI / 180)) * radius,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.7 + 0.3,
                rotation: Math.random() * 360,
                // Purple/pink theme colors
                color: Math.random() > 0.7 ? 'pink' : Math.random() > 0.4 ? 'purple' : 'indigo',
            };
        });
    };

    // Sparkle particles with purple/pink theme
    const generateSparkles = () => {
        return Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * 360;
            const radius = Math.random() * 20 + 8;
            return {
                x: Math.cos(angle * (Math.PI / 180)) * radius,
                y: Math.sin(angle * (Math.PI / 180)) * radius,
                scale: Math.random() * 0.5 + 0.5,
                delay: Math.random() * 0.5,
                duration: Math.random() * 0.5 + 0.5,
                // Purple/pink theme
                color: Math.random() > 0.5 ? 'pink' : 'purple',
            };
        });
    };

    const handleSkillExplode = (index) => {
        setExplodedSkill(index);
        // Vibrate if available
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    };

    // Get color class for sparkles and particles - Updated for purple/pink theme
    const getParticleColorClass = (colorName) => {
        switch (colorName) {
            case 'pink': return 'bg-pink-400';
            case 'purple': return 'bg-purple-500';
            case 'indigo': return 'bg-indigo-500';
            default: return 'bg-pink-400';
        }
    };

    const getParticleGradientClass = (colorName) => {
        switch (colorName) {
            case 'pink': return 'from-pink-500 via-pink-400 to-purple-400';
            case 'purple': return 'from-purple-600 via-purple-500 to-pink-400';
            case 'indigo': return 'from-indigo-600 via-purple-600 to-pink-500';
            default: return 'from-pink-500 via-purple-500 to-indigo-500';
        }
    };

    return (
        <section id="skills" className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-gray-900 via-purple-950 to-pink-900 overflow-hidden relative">
            {/* Fire background effect with purple/pink theme */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-pink-500 via-purple-600 to-transparent"></div>
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bottom-0 w-8 h-32 bg-gradient-to-t from-pink-600 via-purple-500 to-indigo-400 rounded-full blur-md"
                        style={{
                            left: `${Math.random() * 100}%`,
                            height: `${Math.random() * 150 + 50}px`,
                            width: `${Math.random() * 30 + 10}px`,
                        }}
                        animate={{
                            height: [null, `${Math.random() * 150 + 100}px`, `${Math.random() * 100 + 50}px`],
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    ></motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className='flex-col items-center justify-center '>
                    <h2 className="text-4xl font-bold text-center text-white mb-12">
                        My <span className="text-pink-400">Skills</span>

                    </h2>
                    <span className="text-sm flex  items-center justify-center font-normal opacity-80">(click to explode)</span>


                    {/* Decorative line like in Projects section */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isMobile ? "100px" : "150px" }}
                        transition={{ duration: 1 }}
                        className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-10 rounded-full"
                    />
                </div>
                <div ref={ref} className="flex flex-wrap justify-center">
                    <div className="w-full">
                        {isMobile ? (
                            // Mobile layout: Better drop-in animation
                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={`mobile-${skill.name}`}
                                        className="relative flex justify-center"
                                        initial={{ y: -100, opacity: 0, scale: 0.8 }}
                                        animate={animationsReady ? {
                                            y: 0,
                                            opacity: 1,
                                            scale: 1
                                        } : {}}
                                        transition={{
                                            type: "spring",
                                            duration: 0.7,
                                            delay: index * 0.1,
                                            damping: 12,
                                            stiffness: 100
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div
                                            className={`relative w-[110px] h-[110px] rounded-full border-2 ${explodedSkill === index ? 'border-pink-500' : 'border-gray-700'} shadow-lg flex flex-col items-center justify-center overflow-hidden ${explodedSkill === index ? 'bg-gradient-to-b from-purple-900 to-gray-900' : 'bg-gradient-to-b from-gray-800 to-gray-900'}`}
                                            onClick={() => handleSkillExplode(index)}
                                        >
                                            {/* Bomb fuse - ONLY AT THE TOP - purple/pink theme */}
                                            <div className="absolute -top-3 left-1/2 w-1 h-6 bg-gradient-to-b from-pink-300 to-purple-600 -translate-x-1/2"></div>

                                            {/* Skill logo */}
                                            <div className="w-14 h-14 relative">
                                                <Image
                                                    src={skill.image}
                                                    alt={skill.name}
                                                    fill
                                                    className="object-contain"
                                                    priority={index < 4}
                                                />
                                            </div>

                                            {/* Skill name */}
                                            <p className="text-white text-xs font-medium text-center mt-2">{skill.name}</p>

                                            {/* Spark animation ONLY at top - with pink theme */}
                                            <motion.div
                                                className="absolute -top-1 left-1/2 w-2 h-2 bg-pink-300 rounded-full -translate-x-1/2"
                                                animate={{
                                                    opacity: [1, 0.5, 1],
                                                    scale: [1, 1.5, 1]
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity
                                                }}
                                            />

                                            {/* Fire effect on surface when exploded */}
                                            {explodedSkill === index && (
                                                <>
                                                    {/* Surface fire ring - pink/purple theme */}
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-purple-800/40 to-pink-900/40"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {/* Inner burning effect - pink/purple theme */}
                                                        {generateSparkles().map((sparkle, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className={`absolute w-1.5 h-1.5 rounded-full ${sparkle.color === 'pink' ? 'bg-pink-400' : 'bg-purple-500'}`}
                                                                style={{
                                                                    left: "50%",
                                                                    top: "50%",
                                                                }}
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{
                                                                    opacity: [0, 1, 0],
                                                                    scale: [0, 1, 0.5],
                                                                    x: sparkle.x * 0.7, // Constrain to keep inside
                                                                    y: sparkle.y * 0.7, // Constrain to keep inside
                                                                }}
                                                                transition={{
                                                                    duration: sparkle.duration,
                                                                    delay: sparkle.delay,
                                                                    repeat: 3,
                                                                    repeatType: "loop"
                                                                }}
                                                            />
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>

                                        {/* Explosion effect - contained */}
                                        <AnimatePresence>
                                            {explodedSkill === index && (
                                                <>
                                                    {/* Proficiency display */}
                                                    <motion.div
                                                        className="absolute inset-0 flex items-center justify-center z-20"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                    >
                                                        <div className="bg-black/80 backdrop-blur-sm rounded-full w-24 h-24 flex flex-col items-center justify-center">
                                                            <span className="text-white font-bold text-xl">{skill.proficiency}%</span>
                                                            <div className="w-14 h-1.5 mt-1 bg-gray-700 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className={`h-full rounded-full bg-gradient-to-r ${getColorClass(skill.proficiency)}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "100%" }}
                                                                    transition={{ duration: 0.4 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Fire particles - pink/purple, smaller radius, contained */}
                                                    {generateParticles().slice(0, 12).map((particle, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className={`absolute bg-gradient-to-br ${getParticleGradientClass(particle.color)} blur-[1px]`}
                                                            style={{
                                                                width: `${Math.random() * 3 + 2}px`,
                                                                height: `${Math.random() * 5 + 2}px`,
                                                                borderRadius: "50%",
                                                            }}
                                                            initial={{ x: 0, y: 0, opacity: 0 }}
                                                            animate={{
                                                                x: particle.x * 0.4, // Very narrow explosion
                                                                y: particle.y * 0.4, // Very narrow explosion
                                                                opacity: [particle.opacity, 0],
                                                                scale: [particle.scale, 0],
                                                            }}
                                                            transition={{
                                                                duration: 0.7,
                                                                ease: "easeOut"
                                                            }}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // Desktop layout: Bomb throwing animation
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={`desktop-${skill.name}`}
                                        className="relative flex justify-center"
                                        initial={{
                                            x: -300,
                                            y: 100,
                                            opacity: 0,
                                            rotate: -90,
                                            scale: 0.5
                                        }}
                                        animate={isInView ? {
                                            x: 0,
                                            y: 0,
                                            opacity: 1,
                                            rotate: 0,
                                            scale: 1
                                        } : {}}
                                        transition={{
                                            type: "spring",
                                            damping: 12,
                                            stiffness: 60,
                                            delay: index * 0.15,
                                        }}
                                        whileHover={{
                                            y: -10,
                                            scale: 1.05,
                                            transition: { duration: 0.3, ease: "easeInOut" }
                                        }}
                                    >
                                        <motion.div
                                            className={`relative w-40 h-40 rounded-full border-4 ${explodedSkill === index ? 'border-pink-500' : 'border-gray-700'} shadow-lg flex flex-col items-center justify-center overflow-hidden ${explodedSkill === index ? 'bg-gradient-to-b from-purple-900 to-gray-900' : 'bg-gradient-to-b from-gray-800 to-gray-900'}`}
                                            onMouseEnter={() => setHoveredSkill(index)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            onClick={() => handleSkillExplode(index)}
                                        >
                                            {/* Bomb fuse - ONLY AT THE TOP */}
                                            <div className="absolute -top-4 left-1/2 w-2 h-8 bg-gradient-to-b from-pink-300 to-purple-600 -translate-x-1/2"></div>

                                            {/* Skill logo */}
                                            <div className="w-24 h-24 relative mb-2">
                                                <Image
                                                    src={skill.image}
                                                    alt={skill.name}
                                                    fill
                                                    className="object-contain"
                                                    priority={index < 4}
                                                />
                                            </div>

                                            {/* Skill name */}
                                            <p className="text-white text-lg font-medium text-center">{skill.name}</p>

                                            {/* Spark animation ONLY at top */}
                                            <motion.div
                                                className="absolute -top-2 left-1/2 w-3 h-3 bg-pink-300 rounded-full -translate-x-1/2"
                                                animate={{
                                                    opacity: [1, 0.5, 1],
                                                    scale: [1, 1.5, 1]
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity
                                                }}
                                            />

                                            {/* Hover glow effect */}
                                            {hoveredSkill === index && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}

                                            {/* Fire effect on surface when exploded */}
                                            {explodedSkill === index && (
                                                <>
                                                    {/* Surface fire ring - pink/purple theme */}
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-purple-800/40 to-pink-900/40"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {/* Inner burning effect - pink/purple theme */}
                                                        {generateSparkles().map((sparkle, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className={`absolute w-2.5 h-2.5 rounded-full ${sparkle.color === 'pink' ? 'bg-pink-400' : 'bg-purple-500'}`}
                                                                style={{
                                                                    left: "50%",
                                                                    top: "50%",
                                                                }}
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{
                                                                    opacity: [0, 1, 0],
                                                                    scale: [0, 1, 0.5],
                                                                    x: sparkle.x * 0.9, // Constrain to keep inside
                                                                    y: sparkle.y * 0.9, // Constrain to keep inside
                                                                }}
                                                                transition={{
                                                                    duration: sparkle.duration,
                                                                    delay: sparkle.delay,
                                                                    repeat: 3,
                                                                    repeatType: "loop"
                                                                }}
                                                            />
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </motion.div>

                                        {/* Explosion effect */}
                                        <AnimatePresence>
                                            {explodedSkill === index && (
                                                <>
                                                    {/* Proficiency display */}
                                                    <motion.div
                                                        className="absolute inset-0 flex items-center justify-center z-20"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                    >
                                                        <div className="bg-black/80 backdrop-blur-sm rounded-full w-32 h-32 flex flex-col items-center justify-center">
                                                            <span className="text-white font-bold text-3xl">{skill.proficiency}%</span>
                                                            <div className="w-20 h-2 mt-2 bg-gray-700 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className={`h-full rounded-full bg-gradient-to-r ${getColorClass(skill.proficiency)}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "100%" }}
                                                                    transition={{ duration: 0.4 }}
                                                                />
                                                            </div>
                                                            <p className="mt-2 text-white text-sm">Proficiency</p>
                                                        </div>
                                                    </motion.div>

                                                    {/* Fire particles - pink/purple, contained within */}
                                                    {generateParticles().map((particle, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className={`absolute bg-gradient-to-br ${getParticleGradientClass(particle.color)} blur-[1px]`}
                                                            style={{
                                                                width: `${Math.random() * 5 + 2}px`,
                                                                height: `${Math.random() * 7 + 3}px`,
                                                                borderRadius: "50%",
                                                            }}
                                                            initial={{ x: 0, y: 0, opacity: 0 }}
                                                            animate={{
                                                                x: particle.x * 0.5,
                                                                y: particle.y * 0.5,
                                                                opacity: [particle.opacity, 0],
                                                                scale: [particle.scale, 0],
                                                                rotate: particle.rotation
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                ease: "easeOut"
                                                            }}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;