import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET a specific project by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const project = await prisma.project.findUnique({
            where: { id: Number(id) },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

// PUT/UPDATE a project
export async function PUT(request, { params }) {
    try {
        const { id } = params;
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

        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data
        });

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

// DELETE a project
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.project.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}