import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET a single skill by ID
export async function GET(request, { params }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const skill = await prisma.skill.findUnique({
            where: { id },
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
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const data = await request.json();

        // Validate proficiency if provided
        if (data.proficiency !== undefined &&
            (typeof data.proficiency !== 'number' ||
                data.proficiency < 0 ||
                data.proficiency > 100)) {
            return NextResponse.json(
                { error: 'Proficiency must be a number between 0 and 100' },
                { status: 400 }
            );
        }

        const skill = await prisma.skill.update({
            where: { id },
            data,
        });

        return NextResponse.json(skill, { status: 200 });
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
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        await prisma.skill.delete({
            where: { id },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
}