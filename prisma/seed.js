const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProjects() {
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

    console.log('Projects seeded successfully!');
}

async function seedCertificates() {
    const certificates = [
        {
            id: 1,
            title: "AWS Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2023",
            image: "/certificates/aws-cert.jpg",
            link: "https://www.credly.com/your-badge-link",
            description: "Foundational understanding of AWS Cloud services, architecture, security, and compliance.",
            color: "from-blue-500 to-teal-300",
            size: "lg",
            orbitRadius: 1.4,
            orbitSpeed: 80,
            startOffset: 0,
        },
        {
            id: 2,
            title: "React Developer",
            issuer: "Meta",
            date: "2022",
            image: "/certificates/react-cert.jpg",
            link: "https://www.coursera.org/your-certificate-link",
            description: "Advanced React concepts including hooks, state management, context API and testing.",
            color: "from-blue-400 to-indigo-500",
            size: "md",
            orbitRadius: 1,
            orbitSpeed: 100,
            startOffset: 120,
        },
        {
            id: 3,
            title: "JavaScript Algorithms",
            issuer: "freeCodeCamp",
            date: "2022",
            image: "/certificates/js-cert.jpg",
            link: "https://www.freecodecamp.org/your-certificate",
            description: "Data structures, algorithms, and object-oriented programming in JavaScript.",
            color: "from-yellow-400 to-orange-500",
            size: "sm",
            orbitRadius: 0.7,
            orbitSpeed: 60,
            startOffset: 240,
        },
        {
            id: 4,
            title: "UI/UX Design",
            issuer: "Google",
            date: "2023",
            image: "/certificates/ui-ux-cert.jpg",
            link: "https://www.coursera.org/your-certificate-link",
            description: "User experience research, wireframing, prototyping, and testing interactive designs.",
            color: "from-green-400 to-emerald-500",
            size: "md",
            orbitRadius: 1.2,
            orbitSpeed: 90,
            startOffset: 30,
        },
        {
            id: 5,
            title: "Fullstack Development",
            issuer: "Udemy",
            date: "2022",
            image: "/certificates/fullstack-cert.jpg",
            link: "https://www.udemy.com/your-certificate/",
            description: "Building end-to-end web applications with modern frameworks and databases.",
            color: "from-pink-500 to-purple-600",
            size: "lg",
            orbitRadius: 0.9,
            orbitSpeed: 120,
            startOffset: 190,
        }
        // Add your other certificates here
    ];

    for (const certificate of certificates) {
        await prisma.certificate.create({
            data: certificate,
        });
    }

    console.log('Certificates seeded successfully!');
}

async function main() {
    try {
        await seedProjects();
        await seedCertificates();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();