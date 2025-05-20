'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { FaPhone, FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';

// Load EmailJS script
const loadEmailJS = async () => {
    return new Promise((resolve, reject) => {
        // Check if EmailJS is already loaded
        if (window.emailjs) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            // Initialize with public key
            window.emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load EmailJS'));
        };
    });
};

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
    const [notificationMessage, setNotificationMessage] = useState('Message sent successfully!');
    const [notificationType, setNotificationType] = useState('success');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameInputRef = useRef(null);

    // Load EmailJS on component mount
    useEffect(() => {
        loadEmailJS().catch(error => console.error("Failed to load EmailJS:", error));
    }, []);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Set calling state
            setPhoneState('calling');

            // Send email using EmailJS
            await loadEmailJS(); // Ensure EmailJS is loaded

            const templateParams = {
                from_name: formState.name,
                from_email: formState.email,
                subject: `New message from ${formState.name
                    }`,
                message: formState.message,
                to_name: "Sahithya", // Your name here
            };

            await window.emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                templateParams
            );

            // Show success notification
            setNotificationType('success');
            setNotificationMessage('Message sent successfully!');
            setShowNotification(true);

            // Transition to "call ended" state
            setTimeout(() => {
                setFormSubmitted(true);
                setPhoneState('call-ended');
            }, 1500);

            // Reset after 5 seconds
            setTimeout(() => {
                setFormState({ name: '', email: '', message: '' });
                setFormSubmitted(false);
                setPhoneState('unlocked');
                setShowNotification(false);
            }, 5000);

        } catch (error) {
            console.error("Failed to send email:", error);

            // Show error notification
            setNotificationType('error');
            setNotificationMessage('Failed to send message. Please try again.');
            setShowNotification(true);

            // Reset to form state
            setTimeout(() => {
                setPhoneState('unlocked');
                setShowNotification(false);
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="mt-2 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
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
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border ${notificationType === 'success' ? 'border-green-400/20' : 'border-red-400/20'
                        }`}
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${notificationType === 'success' ? 'bg-green-400' : 'bg-red-400'
                            } animate-pulse`} />
                        <span className="text-white text-xs font-medium">{notificationMessage}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-center md:text-left"
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">Let's Connect</h3>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto md:mx-0">
                            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                        </p>

                        <div className="space-y-4">
                            <a href="mailto:sahithyad42@gmail.com" className="flex items-center justify-center md:justify-start space-x-3 text-gray-200 hover:text-pink-400 transition duration-300">
                                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <FaEnvelope className="text-pink-400" />
                                </div>
                                <span>sahithyad42@gmail.com</span>
                            </a>
                            <a href="tel:+91-6361709090" className="flex items-center justify-center md:justify-start space-x-3 text-gray-200 hover:text-pink-400 transition duration-300">
                                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <FaPhone className="text-pink-400" />
                                </div>
                                <span>+91 6361709090</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Phone UI */}
                    <div className="flex justify-center">
                        <motion.div
                            ref={ref}
                            variants={phoneVariants}
                            initial="hidden"
                            animate={controls}
                            className="w-full max-w-[280px] h-[550px] bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 relative"
                            style={{
                                boxShadow: '0 25px 50px -12px rgba(31, 0, 51, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(192, 132, 252, 0.1) inset',
                            }}
                        >
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-10"></div>

                            {/* Phone Screen */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                                <AnimatePresence mode='wait'>
                                    {renderPhoneScreen()}
                                </AnimatePresence>
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}