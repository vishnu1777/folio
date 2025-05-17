import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET handler to fetch all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST handler to create a new project
export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'description', 'tags', 'image', 'github', 'live', 'color'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new project
        const project = await prisma.project.create({
            data
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}