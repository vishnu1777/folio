'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            // Nav background effect
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Active section tracking
            const sections = ['home', 'projects', 'skills', 'certificates', 'contact'];
            const scrollPosition = window.scrollY + 100; // Offset for better UX

            for (const section of sections) {
                // Special case for "home" to target the hero section which might not have the id "home"
                const elementId = section === 'home' ? 'hero' : section;
                const element = document.getElementById(elementId);

                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll function
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setMenuOpen(false);

        // Special case for "home" to target the hero section
        const elementId = sectionId === 'home' ? 'hero' : sectionId;
        const element = document.getElementById(elementId);

        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80, // Offset for navbar height
                behavior: 'smooth'
            });
        }
    };

    // Navigation links - updated with hash routes
    const navLinks = [
        { name: 'Home', path: 'home' },
        { name: 'Projects', path: 'projects' },
        { name: 'Skills', path: 'skills' },
        { name: 'Certificates', path: 'certificates' },
        { name: 'Contact', path: 'contact' },
    ];

    // Enhanced sparkle animation variants for more variety
    const sparkleVariants = {
        initial: { opacity: 0, scale: 0 },
        animate: index => ({
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            transition: {
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                repeatDelay: 1 + Math.random() * 2,
                ease: "easeInOut",
                delay: Math.random() * 2
            }
        })
    };

    // Full-screen menu animations
    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const menuItemVariants = {
        closed: { opacity: 0, y: 20 },
        open: i => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 + i * 0.1 }
        })
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`fixed w-full z-50 transition-all duration-300 
                    ${scrolled
                        ? 'bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-pink-800/90 backdrop-blur-md shadow-lg'
                        : 'bg-gradient-to-br from-gray-900/70 via-purple-900/70 to-pink-800/70 backdrop-blur-sm'
                    }`}
            >
                {/* Sparkle container - positioned absolute to cover navbar */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Generate 20 random sparkles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${2 + Math.random() * 2}px`,
                                height: `${2 + Math.random() * 2}px`,
                                background: Math.random() > 0.5 ? 'white' : 'rgba(255, 192, 203, 0.8)',
                                boxShadow: Math.random() > 0.5
                                    ? '0 0 4px 1px rgba(255, 255, 255, 0.8), 0 0 8px 2px rgba(255, 192, 203, 0.8)'
                                    : '0 0 4px 1px rgba(255, 192, 203, 0.8), 0 0 8px 2px rgba(255, 255, 255, 0.8)'
                            }}
                            variants={sparkleVariants}
                            initial="initial"
                            animate="animate"
                            custom={i}
                        />
                    ))}
                </div>

                {/* Container that matches Hero exactly */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 ">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex-shrink-0 font-bold text-2xl"
                        >
                            <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>
                                <span className="text-white cursor-pointer font-cursive" style={{ textShadow: '0 0 5px rgba(255, 182, 193, 0.8)' }}>Portfolio</span>
                            </a>
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                {navLinks.map((link) => (
                                    <motion.div
                                        key={link.name}
                                        whileHover={{
                                            y: -3,
                                            scale: 1.1,
                                            textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 182, 193, 0.8)'
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <a
                                            href={`#${link.path === 'home' ? 'hero' : link.path}`}
                                            onClick={(e) => scrollToSection(e, link.path)}
                                            className={`text-white transition-all cursor-pointer ${activeSection === link.path
                                                ? "text-pink-300 font-medium"
                                                : "hover:text-pink-300"
                                                }`}
                                        >
                                            {link.name}
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-gray-300 hover:text-pink-300 focus:outline-none z-50"
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                            >
                                <span className="sr-only">Open main menu</span>
                                <div className="w-5 h-5 relative">
                                    <span
                                        className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-300 to-purple-400 transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'}`}
                                        style={{ top: '30%', boxShadow: '0 0 5px rgba(255, 182, 193, 0.8)' }}
                                    />
                                    <span
                                        className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-300 to-purple-400 transform transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                                        style={{ top: '50%', boxShadow: '0 0 5px rgba(255, 182, 193, 0.8)' }}
                                    />
                                    <span
                                        className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-300 to-purple-400 transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'}`}
                                        style={{ top: '70%', boxShadow: '0 0 5px rgba(255, 182, 193, 0.8)' }}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Full-screen overlay menu for mobile */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 md:hidden bg-gradient-to-br from-gray-900/98 via-purple-900/98 to-pink-800/98 backdrop-blur-md z-40 flex items-center justify-center"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={overlayVariants}
                    >
                        {/* Sparkle container for mobile menu */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: `${2 + Math.random() * 3}px`,
                                        height: `${2 + Math.random() * 3}px`,
                                        background: Math.random() > 0.5 ? 'white' : 'rgba(255, 192, 203, 0.8)',
                                        boxShadow: Math.random() > 0.5
                                            ? '0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 10px 3px rgba(255, 192, 203, 0.8)'
                                            : '0 0 5px 2px rgba(255, 192, 203, 0.8), 0 0 10px 3px rgba(255, 255, 255, 0.8)'
                                    }}
                                    variants={sparkleVariants}
                                    initial="initial"
                                    animate="animate"
                                    custom={i}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-6 p-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    variants={menuItemVariants}
                                    custom={i}
                                >
                                    <a
                                        href={`#${link.path === 'home' ? 'hero' : link.path}`}
                                        onClick={(e) => scrollToSection(e, link.path)}
                                    >
                                        <motion.div
                                            className={`text-center text-xl font-medium px-6 py-2 ${activeSection === link.path
                                                ? "text-pink-300"
                                                : "text-white"
                                                }`}
                                            whileHover={{
                                                scale: 1.1,
                                                color: "#f9a8d4", // pink-300
                                                textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 182, 193, 0.8)'
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {link.name}
                                        </motion.div>
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;