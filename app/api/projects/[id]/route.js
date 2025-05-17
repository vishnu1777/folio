import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET handler to fetch a single project
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const projectId = parseInt(id, 10);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
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
    } finally {
        await prisma.$disconnect();
    }
}

// PUT handler to update a project
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const projectId = parseInt(id, 10);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const data = await request.json();

        // Check if the project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Update the project
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data,
        });

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE handler to delete a project
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const projectId = parseInt(id, 10);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        // Check if the project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Delete the project
        await prisma.project.delete({
            where: { id: projectId },
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
    } finally {
        await prisma.$disconnect();
    }
}