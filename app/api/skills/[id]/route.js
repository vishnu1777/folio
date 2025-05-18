import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET a specific skill by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const skill = await prisma.skill.findUnique({
            where: { id: Number(id) },
        });

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(skill, { status: 200 });
    } catch (error) {
        console.error('Error fetching skill:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skill' },
            { status: 500 }
        );
    }
}

// PUT/UPDATE a skill
export async function PUT(request, { params }) {
    try {
        const { id } = params;
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

        const updatedSkill = await prisma.skill.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                image: data.image,
                proficiency: data.proficiency,
                category: data.category || 'technical',
            },
        });

        return NextResponse.json(updatedSkill, { status: 200 });
    } catch (error) {
        console.error('Error updating skill:', error);
        return NextResponse.json(
            { error: 'Failed to update skill' },
            { status: 500 }
        );
    }
}

// DELETE a skill
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.skill.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(
            { message: 'Skill deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
}