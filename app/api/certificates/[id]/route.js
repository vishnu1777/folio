import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET a specific certificate by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const certificate = await prisma.certificate.findUnique({
            where: { id: Number(id) },
        });

        if (!certificate) {
            return NextResponse.json(
                { error: 'Certificate not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(certificate, { status: 200 });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return NextResponse.json(
            { error: 'Failed to fetch certificate' },
            { status: 500 }
        );
    }
}

// PUT/UPDATE a certificate
export async function PUT(request, { params }) {
    try {
        const { id } = params;
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

        const updatedCertificate = await prisma.certificate.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                issuer: data.issuer,
                date: data.date,
                description: data.description || '',
                image: data.image,
                credentialUrl: data.credentialUrl || '',
            },
        });

        return NextResponse.json(updatedCertificate, { status: 200 });
    } catch (error) {
        console.error('Error updating certificate:', error);
        return NextResponse.json(
            { error: 'Failed to update certificate' },
            { status: 500 }
        );
    }
}

// DELETE a certificate
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.certificate.delete({
            where: { id: Number(id) },
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