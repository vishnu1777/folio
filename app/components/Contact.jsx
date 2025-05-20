'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { FaPhone, FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function Contact() {
    // Responsive layout hooks
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    // Animation controls
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

    // Form state
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [phoneState, setPhoneState] = useState('locked');
    const [showNotification, setShowNotification] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const nameInputRef = useRef(null);

    // Handle phone state changes
    useEffect(() => {
        if (inView) {
            controls.start('visible');
            setTimeout(() => {
                setPhoneState('unlocked');
            }, 1000);
        } else {
            controls.start('hidden');
            setPhoneState('locked');
        }
    }, [inView, controls]);

    // Handle input change
    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Show floating notification
        setShowNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);

        // Transition to "call ended" state
        setPhoneState('calling');
        setTimeout(() => {
            setFormSubmitted(true);
            setPhoneState('call-ended');
        }, 1500);

        // Reset after 5 seconds
        setTimeout(() => {
            setFormState({ name: '', email: '', message: '' });
            setFormSubmitted(false);
            setPhoneState('unlocked');
        }, 5000);

        // Here you would typically send the form data to your backend
    };

    // Reset to form view
    const resetPhone = () => {
        setPhoneState('unlocked');
        setFormSubmitted(false);
    };

    // Unlock animation
    const handleUnlock = () => {
        if (phoneState === 'locked') {
            setPhoneState('unlocking');
            setTimeout(() => {
                setPhoneState('unlocked');
                // Focus name input after unlocking
                if (nameInputRef.current) {
                    nameInputRef.current.focus();
                }
            }, 800);
        }
    };

    // Phone variants
    const phoneVariants = {
        hidden: {
            y: 100,
            opacity: 0,
            rotateX: 45
        },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100,
                delay: 0.2
            }
        }
    };

    // Screen content variants
    const screenVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.5,
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.3
            }
        }
    };

    // Notification variants
    const notificationVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 300
            }
        },
        exit: {
            y: -50,
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    // Phone screen content based on state
    const renderPhoneScreen = () => {
        switch (phoneState) {
            case 'locked':
                return (
                    <motion.div
                        className="flex flex-col items-center justify-center min-h-screen text-center p-6"
                        variants={screenVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-white text-lg mb-2">Tap to Connect</h3>
                        <p className="text-gray-300 text-xs mb-6">Swipe up to contact me</p>
                        <motion.button
                            onClick={handleUnlock}
                            className="w-12 h-12 rounded-full bg-pink-500/30 border border-pink-500/50 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPhone className="text-white" />
                        </motion.button>
                    </motion.div>
                );

            case 'unlocking':
                return (
                    <motion.div
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-16 h-16 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, ease: "linear" }}
                        />
                    </motion.div>
                );

            case 'unlocked':
                return (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="flex flex-col h-full p-5"
                        variants={screenVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <h3 className="text-white font-semibold text-lg mb-4 text-center">Get In Touch</h3>

                        <div className="relative mb-4">
                            <input
                                ref={nameInputRef}
                                type="text"
                                name="name"
                                value={formState.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full bg-gray-800/70 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                required
                            />
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formState.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full bg-gray-800/70 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                required
                            />
                        </div>

                        <div className="relative mb-4 flex-grow">
                            <textarea
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                placeholder="Your Message"
                                className="w-full h-full min-h-[100px] bg-gray-800/70 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="mt-2 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Send Message</span>
                            <FaPaperPlane className="ml-2" />
                        </motion.button>
                    </motion.form>
                );

            case 'calling':
                return (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full"
                        variants={screenVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="text-5xl mb-6">📞</div>
                        <h3 className="text-white text-xl mb-2">Calling...</h3>
                        <p className="text-gray-300 text-sm">Sending your message</p>

                        <div className="mt-8 flex space-x-3">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-pink-500 rounded-full"
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [1, 0.5, 1]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                );

            case 'call-ended':
                return (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full text-center p-6"
                        variants={screenVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="text-5xl mb-6"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            ✉️
                        </motion.div>
                        <h3 className="text-white text-xl mb-2">Message Sent!</h3>
                        <p className="text-gray-300 text-sm mb-6">I'll get back to you soon</p>

                        <motion.button
                            onClick={resetPhone}
                            className="py-2 px-6 bg-pink-500/30 border border-pink-500/50 rounded-full text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            New Message
                        </motion.button>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    // Floating notification
    const renderNotification = () => (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border border-white/20"
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white text-xs font-medium">Message sent successfully!</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <section id="contact" className="min-h-screen py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-950 to-pink-900 relative">
            {renderNotification()}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
                    >
                        Contact <span className="text-pink-400">Me</span>
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
                        Have a project in mind or want to chat? Drop me a message!
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Contact Info Section */}
                    <motion.div
                        className="w-full lg:w-1/2 max-w-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-pink-500/10 shadow-xl">
                            <h3 className="text-2xl text-white font-bold mb-6">Let's Connect</h3>

                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mr-4">
                                        <FaEnvelope className="text-pink-400 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <a href="mailto:youremail@example.com" className="text-white hover:text-pink-400 transition-colors">
                                            sahithyapadival@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mr-4">
                                        <FaPhone className="text-pink-400 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Phone</p>
                                        <a href="tel:+1234567890" className="text-white hover:text-pink-400 transition-colors">
                                            +91 8296574053
                                        </a>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="relative h-12">
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
                                        animate={{
                                            scaleX: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    />

                                    <div className="flex justify-center mt-6">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 h-1 rounded-full bg-pink-500 mx-1"
                                                animate={{
                                                    height: [1, 8, 1],
                                                    opacity: [0.3, 1, 0.3]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: i * 0.2,
                                                    repeat: Infinity
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phone Component */}
                    <motion.div
                        ref={ref}
                        className="w-full lg:w-1/2 max-w-[300px] h-[580px] relative perspective-[1000px]"
                        variants={phoneVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        {/* Phone Frame */}
                        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl transform-style-3d">
                            {/* Phone notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-gray-600 mr-3" />
                                <div className="w-2 h-2 rounded-full bg-gray-600" />
                            </div>

                            {/* Phone screen */}
                            <div className={`h-full w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-gray-900 to-black border-4 ${phoneState === 'locked' ? 'border-gray-800' : 'border-pink-900/30'} relative`}>
                                {/* Screen background effects */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {/* Animated gradient background */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-blue-900/30"
                                        animate={{
                                            backgroundPosition: ['0% 0%', '100% 100%'],
                                        }}
                                        transition={{
                                            duration: 15,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                        style={{ backgroundSize: '200% 200%' }}
                                    />

                                    {/* Floating particles */}
                                    {[...Array(15)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute rounded-full bg-white/20"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                                width: `${1 + Math.random() * 3}px`,
                                                height: `${1 + Math.random() * 3}px`,
                                            }}
                                            animate={{
                                                y: [0, -15, 0],
                                                opacity: [0, 0.7, 0],
                                                scale: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 5,
                                                repeat: Infinity,
                                                delay: Math.random() * 5,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Screen content */}
                                <AnimatePresence mode="wait">
                                    <div key={phoneState} className="relative z-10 h-full">
                                        {renderPhoneScreen()}
                                    </div>
                                </AnimatePresence>

                                {/* Bottom home bar */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-600/50 rounded-full" />
                            </div>
                        </div>

                        {/* Phone shadow */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-black/30 blur-xl rounded-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}