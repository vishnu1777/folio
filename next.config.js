/** @type {import('next').NextConfig} */
const nextConfig = {
    // Mark login page as client-side rendered to avoid prerendering issues
    output: 'standalone',
    pageExtensions: [
        "page.jsx",
        "page.js",
        // FIXME: Next.js has a bug which does not resolve not-found.page.tsx correctly
        // Instead, use `not-found.ts` as a workaround
        // "ts" is required to resolve `not-found.ts`
        // https://github.com/vercel/next.js/issues/65447
        "js"
    ],
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