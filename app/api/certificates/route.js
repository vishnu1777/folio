import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET handler to fetch all certificates
export async function GET() {
    try {
        const certificates = await prisma.certificate.findMany({
            orderBy: {
                date: 'desc', // Most recent first
            },
        });

        return NextResponse.json(certificates, { status: 200 });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch certificates' },
            { status: 500 }
        );
    }
}

// POST handler to create a new certificate
export async function POST(request) {
    try {
        const data = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'issuer', 'date', 'image'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const certificate = await prisma.certificate.create({
            data: {
                title: data.title,
                issuer: data.issuer,
                date: data.date,
                description: data.description || '',
                image: data.image,
                credentialUrl: data.credentialUrl || '',
            },
        });

        return NextResponse.json(certificate, { status: 201 });
    } catch (error) {
        console.error('Error creating certificate:', error);
        return NextResponse.json(
            { error: 'Failed to create certificate' },
            { status: 500 }
        );
    }
}

// PUT handler to update an existing certificate
export async function PUT(request) {
    try {
        const data = await request.json();

        if (!data.id) {
            return NextResponse.json(
                { error: 'Certificate ID is required' },
                { status: 400 }
            );
        }

        const certificate = await prisma.certificate.update({
            where: { id: data.id },
            data: {
                title: data.title,
                issuer: data.issuer,
                date: data.date,
                image: data.image,
                link: data.link,
                description: data.description,
                color: data.color,
                size: data.size,
                orbitRadius: data.orbitRadius,
                orbitSpeed: data.orbitSpeed,
                startOffset: data.startOffset,
            },
        });

        return NextResponse.json(certificate, { status: 200 });
    } catch (error) {
        console.error('Error updating certificate:', error);
        return NextResponse.json(
            { error: 'Failed to update certificate' },
            { status: 500 }
        );
    }
}

// DELETE handler to remove a certificate
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Certificate ID is required' },
                { status: 400 }
            );
        }

        await prisma.certificate.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { message: 'Certificate deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting certificate:', error);
        return NextResponse.json(
            { error: 'Failed to delete certificate' },
            { status: 500 }
        );
    }
}