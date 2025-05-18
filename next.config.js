/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['pin.it'], // Add other domains as needed like 'images.unsplash.com', 'imgur.com', etc.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pin.it',
                pathname: '/**',
            },
            // You can add more patterns if needed
        ],
    },
};

module.exports = nextConfig;