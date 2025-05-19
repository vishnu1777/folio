/** @type {import('next').NextConfig} */
const nextConfig = {
    // Mark login page as client-side rendered to avoid prerendering issues
    output: 'standalone',

    // Moved from experimental to root level per Next.js warning
    serverExternalPackages: ['next-auth'],

    images: {
        domains: ['pin.it', 'images.unsplash.com'] // Add other domains as needed
    },
    experimental: {
        // Only keep serverActions in experimental
        serverActions: {
            allowedOrigins: ['localhost:3000', 'folio-git-main-vishnu-ms-projects-ea0674f2.vercel.app'],
        },
    },
};

module.exports = nextConfig;