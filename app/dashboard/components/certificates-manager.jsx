'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import DeleteDialog from './delete-dialog';

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        description: '',
        image: '',
        credentialUrl: '',
    });

    // Fetch certificates
    useEffect(() => {
        async function fetchCertificates() {
            try {
                setIsLoading(true);
                const res = await fetch('/api/certificates');
                if (!res.ok) throw new Error('Failed to fetch certificates');

                const data = await res.json();
                setCertificates(data);
            } catch (error) {
                console.error('Error loading certificates:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCertificates();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Create new certificate
    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create certificate');

            const newCertificate = await res.json();
            setCertificates(prev => [...prev, newCertificate]);

            // Reset form
            setFormData({
                title: '',
                issuer: '',
                date: '',
                description: '',
                image: '',
                credentialUrl: '',
            });
        } catch (error) {
            console.error('Error creating certificate:', error);
        }
    };

    // Edit certificate
    const handleEdit = (certificate) => {
        setSelectedCertificate(certificate);
        setFormData({
            title: certificate.title,
            issuer: certificate.issuer,
            date: certificate.date,
            description: certificate.description || '',
            image: certificate.image,
            credentialUrl: certificate.credentialUrl || '',
        });
        setIsEditing(true);
    };

    // Update certificate
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedCertificate) return;

        try {
            const res = await fetch(`/api/certificates/${selectedCertificate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update certificate');

            const updatedCertificate = await res.json();
            setCertificates(prev =>
                prev.map(cert =>
                    cert.id === updatedCertificate.id ? updatedCertificate : cert
                )
            );

            // Reset form and editing state
            setFormData({
                title: '',
                issuer: '',
                date: '',
                description: '',
                image: '',
                credentialUrl: '',
            });
            setIsEditing(false);
            setSelectedCertificate(null);
        } catch (error) {
            console.error('Error updating certificate:', error);
        }
    };

    // Delete certificate
    const handleDelete = async () => {
        if (!certificateToDelete) return;

        try {
            const res = await fetch(`/api/certificates/${certificateToDelete.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete certificate');

            setCertificates(prev =>
                prev.filter(cert => cert.id !== certificateToDelete.id)
            );

            setDeleteDialogOpen(false);
            setCertificateToDelete(null);
        } catch (error) {
            console.error('Error deleting certificate:', error);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setSelectedCertificate(null);
        setFormData({
            title: '',
            issuer: '',
            date: '',
            description: '',
            image: '',
            credentialUrl: '',
        });
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading certificates...</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit Certificate' : 'Add New Certificate'}
                    </h2>

                    <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Certificate Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="issuer">Issuing Organization</Label>
                            <Input
                                id="issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Issue Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Certificate Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credentialUrl">Verification URL</Label>
                            <Input
                                id="credentialUrl"
                                name="credentialUrl"
                                value={formData.credentialUrl}
                                onChange={handleChange}
                                placeholder="URL to verify the certificate"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit">
                                {isEditing ? 'Update Certificate' : 'Add Certificate'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={cert.image}
                                alt={cert.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <CardContent className="p-4">
                            <h3 className="font-bold">{cert.title}</h3>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            <p className="text-xs text-gray-500 mt-1">{cert.date}</p>

                            {cert.description && (
                                <p className="text-sm mt-2 line-clamp-2">{cert.description}</p>
                            )}

                            <div className="flex justify-between items-center mt-4">
                                {cert.credentialUrl && (
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                            Verify
                                        </a>
                                    </Button>
                                )}

                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(cert)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            setCertificateToDelete(cert);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DeleteDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={handleDelete}
            />
        </div>
    );
}