import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET handler to fetch all skills
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: {
                proficiency: 'desc', // Order by proficiency, highest first
            },
        });

        return NextResponse.json(skills, { status: 200 });
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch skills',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// POST handler to create a new skill
export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'image', 'proficiency'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate proficiency is a number between 0-100
        if (typeof data.proficiency !== 'number' || data.proficiency < 0 || data.proficiency > 100) {
            return NextResponse.json(
                { error: 'Proficiency must be a number between 0 and 100' },
                { status: 400 }
            );
        }

        const skill = await prisma.skill.create({
            data: {
                name: data.name,
                image: data.image,
                proficiency: data.proficiency,
                category: data.category || 'technical',
            },
        });

        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        );
    }
}