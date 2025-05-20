/** @type {import('next').NextConfig} */
const nextConfig = {
    // Mark login page as client-side rendered to avoid prerendering issues

    images: {
        domains: ['pin.it', 'images.unsplash.com'] // Add other domains as needed
    }
};

module.exports = nextConfig;

