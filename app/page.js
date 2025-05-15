'use client';

import { useState, useEffect } from 'react';
import LoadingAnimation from './components/LoadingAnimation';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

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
    <main>
      <Navbar />
      <Hero />
      {/* You can add more sections here */}
    </main>
  );
}
