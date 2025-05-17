const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // First delete all existing records to avoid duplicates
    await prisma.project.deleteMany();

    // Seed with the projects from your React component
    const projects = [
        {
            title: 'E-Commerce Platform',
            description: 'A fully responsive e-commerce platform built with Next.js, featuring product filtering, cart functionality, and payment processing.',
            tags: ['Next.js', 'Tailwind CSS', 'Stripe', 'MongoDB'],
            image: 'https://placehold.co/600x400/FF5882/FFFFFF?text=E-Commerce+Platform',
            github: 'https://github.com/yourusername/ecommerce',
            live: 'https://ecommerce-demo.vercel.app',
            color: 'from-pink-500 to-purple-600'
        },
        {
            title: 'Social Media Dashboard',
            description: 'A comprehensive dashboard for social media analytics with real-time updates, data visualization, and user engagement metrics.',
            tags: ['React', 'D3.js', 'Firebase', 'Material UI'],
            image: 'https://placehold.co/600x400/7E49F2/FFFFFF?text=Social+Media+Dashboard',
            github: 'https://github.com/yourusername/social-dashboard',
            live: 'https://social-dashboard.vercel.app',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            title: 'AI Image Generator',
            description: 'A web application that uses machine learning to generate unique images based on text prompts and user preferences.',
            tags: ['Python', 'TensorFlow', 'React', 'Flask'],
            image: 'https://placehold.co/600x400/4863F7/FFFFFF?text=AI+Image+Generator',
            github: 'https://github.com/yourusername/ai-image-gen',
            live: 'https://ai-image-gen.vercel.app',
            color: 'from-indigo-500 to-blue-600'
        },
        {
            title: 'Personal Finance Tracker',
            description: 'A mobile-responsive web app for tracking personal finances, with budget planning, expense categorization, and visual reports.',
            tags: ['Vue.js', 'Node.js', 'Express', 'Chart.js'],
            image: 'https://placehold.co/600x400/0EA5E9/FFFFFF?text=Finance+Tracker',
            github: 'https://github.com/yourusername/finance-tracker',
            live: 'https://finance-tracker.vercel.app',
            color: 'from-blue-500 to-cyan-600'
        },
    ];

    for (const project of projects) {
        await prisma.project.create({
            data: project,
        });
    }

    console.log('Database has been seeded!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });