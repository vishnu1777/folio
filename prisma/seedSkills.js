const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // First, clear any existing skills to avoid duplicates
    await prisma.skill.deleteMany();

    const skills = [
        { name: 'JavaScript', image: '/skills/javascript.png', proficiency: 90 },
        { name: 'React', image: '/skills/react.png', proficiency: 85 },
        { name: 'NextJS', image: '/skills/nextjs.png', proficiency: 82 },
        { name: 'HTML/CSS', image: '/skills/html-css.png', proficiency: 95 },
        { name: 'UI/UX', image: '/skills/uiux.png', proficiency: 80 },
        { name: 'Tailwind', image: '/skills/tailwind.png', proficiency: 88 },
        { name: 'TypeScript', image: '/skills/typescript.png', proficiency: 75 },
        { name: 'Node.js', image: '/skills/nodejs.png', proficiency: 70 },
    ];

    for (const skill of skills) {
        await prisma.skill.create({
            data: skill,
        });
    }

    console.log('Skills database has been seeded!');
}

main()
    .catch((e) => {
        console.error('Error seeding skills database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });