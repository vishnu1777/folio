'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation links
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Skills', path: '/skills' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}
        >
            {/* Container that matches Hero exactly */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 font-bold text-2xl"
                    >
                        <Link href="/">
                            <span className="text-white cursor-pointer">Portfolio</span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={link.path}>
                                        <span className="text-white hover:text-purple-300 transition-colors cursor-pointer">
                                            {link.name}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button - UPDATED */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-300 hover:text-pink-400 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="w-5 h-5 relative">
                                <span
                                    className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-400 to-purple-500 transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
                                        }`}
                                    style={{ top: '30%' }}
                                />
                                <span
                                    className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-400 to-purple-500 transform transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    style={{ top: '50%' }}
                                />
                                <span
                                    className={`block absolute h-0.5 w-full bg-gradient-to-r from-pink-400 to-purple-500 transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
                                        }`}
                                    style={{ top: '70%' }}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - UPDATED with right alignment and reduced width */}
            <motion.div
                className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                    opacity: menuOpen ? 1 : 0,
                    height: menuOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 999 }}
            >
                {/* Mobile menu container with right alignment and reduced width */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
                    <div className="w-30 px-2 flex-col items-center justify-center pt-2 pb-3 space-y-1 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-pink-800/95 backdrop-blur-md rounded-b-lg">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.path}>
                                <div
                                    className="text-white hover:bg-white/10 flex items-center justify-center px-3 py-2  rounded-md text-sm font-medium transition-colors cursor-pointer text-right"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;