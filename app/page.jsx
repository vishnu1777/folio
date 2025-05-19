'use client';
import React from "react"; // Add this import
import { useState, useEffect } from 'react';
import LoadingAnimation from './components/LoadingAnimation';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Certificates from './components/Certificates';
// export const dynamic = 'force-dynamic'
export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <main id='home'>
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Certificates />
      <Contact />
      {/* Footer or other components can go here */}
    </main>
  );
}
