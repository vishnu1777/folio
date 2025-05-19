'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function DashboardHeader() {
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Use useEffect to handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Render a placeholder during SSR to prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            Portfolio Dashboard
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-4"></div>
                    <div className="md:hidden flex items-center"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        Portfolio Dashboard
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <nav>
                        <ul className="flex items-center gap-4">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                                    View Site
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/api/auth/signout">Sign Out</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="mr-2"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Rest of your component remains unchanged */}
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 py-4 px-4 shadow-lg">
                    <nav>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link
                                    href="/"
                                    className="block py-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    View Site
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/api/auth/signout"
                                    className="block py-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Out
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}