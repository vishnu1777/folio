'use client';

import { useState, useEffect } from 'react';
import { useToastCrud } from "@/app/hooks/use-toast-crud";
import { Toaster } from "sonner";
import DeleteDialog from './delete-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Pencil,
    Trash2,
    Award,
    Calendar,
    Building,
    ExternalLink,
    Image as ImageIcon
} from 'lucide-react';

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const { toastCreate, toastUpdate, toastDelete, toastError, toastInfo, toastWarning } = useToastCrud();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        description: '',
        image: '',
        link: '',
    });

    // Fetch certificates
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/certificates');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setCertificates(data);
                toastInfo('Certificates loaded', `${data.length} certificates retrieved successfully`);
            } catch (error) {
                console.error('Error fetching certificates:', error);
                toastError('Failed to load certificates', 'Please try again later or contact support.');
            } finally {
                setIsLoading(false);
            }
        };

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
            // Input validation
            if (!formData.title.trim()) {
                toastError('Validation Error', 'Certificate title is required');
                return;
            }

            if (!formData.issuer.trim()) {
                toastError('Validation Error', 'Issuing organization is required');
                return;
            }

            if (!formData.date.trim()) {
                toastError('Validation Error', 'Issue date is required');
                return;
            }

            if (!formData.image.trim()) {
                toastWarning('No Image', 'Certificate will be created without an image');
            }

            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newCertificate = await response.json();
            setCertificates(prev => [...prev, newCertificate]);

            // Reset form
            setFormData({
                title: '',
                issuer: '',
                date: '',
                description: '',
                image: '',
                link: '',
            });

            toastCreate('Certificate created', `"${formData.title}" has been added to your portfolio.`);
        } catch (error) {
            console.error('Error creating certificate:', error);
            toastError('Failed to create certificate', 'Please check your inputs and try again.');
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
            image: certificate.image || '',
            link: certificate.link || '',
        });
        setIsEditing(true);
        toastInfo('Edit mode', `Editing "${certificate.title}"`);
    };

    // Update certificate
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedCertificate) return;

        try {
            // Input validation
            if (!formData.title.trim()) {
                toastError('Validation Error', 'Certificate title is required');
                return;
            }

            if (!formData.issuer.trim()) {
                toastError('Validation Error', 'Issuing organization is required');
                return;
            }

            if (!formData.date.trim()) {
                toastError('Validation Error', 'Issue date is required');
                return;
            }

            const response = await fetch(`/api/certificates/${selectedCertificate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedCertificate = await response.json();

            // Update certificates array
            setCertificates(prev =>
                prev.map(cert => cert.id === updatedCertificate.id ? updatedCertificate : cert)
            );

            // Reset edit mode
            setIsEditing(false);
            setSelectedCertificate(null);

            // Reset form
            setFormData({
                title: '',
                issuer: '',
                date: '',
                description: '',
                image: '',
                link: '',
            });

            toastUpdate('Certificate updated', `"${formData.title}" has been updated successfully.`);
        } catch (error) {
            console.error('Error updating certificate:', error);
            toastError('Failed to update certificate', 'Please check your connection and try again.');
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
            link: '',
        });
        toastInfo('Edit cancelled', 'No changes were made');
    };

    // Show delete confirmation
    const confirmDelete = (certificate) => {
        setCertificateToDelete(certificate);
        setDeleteDialogOpen(true);
    };

    // Delete certificate
    const handleDelete = async () => {
        if (!certificateToDelete) return;

        try {
            const response = await fetch(`/api/certificates/${certificateToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove certificate from state
            setCertificates(prev =>
                prev.filter(cert => cert.id !== certificateToDelete.id)
            );

            // Close dialog and reset
            setDeleteDialogOpen(false);
            setCertificateToDelete(null);

            toastDelete('Certificate deleted', `"${certificateToDelete.title}" has been removed from your portfolio.`);
        } catch (error) {
            console.error('Error deleting certificate:', error);
            toastError('Delete failed', 'Unable to delete the certificate. Please try again.');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-16 h-16 border-4 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-600">Loading certificates...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Sonner Toaster Component */}
            <Toaster position="top-right" richColors closeButton />

            <h1 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Certificate' : 'Create New Certificate'}
            </h1>

            {/* Certificate Form */}
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-8 space-y-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="title" className="mb-1">Certificate Title*</Label>
                        <div className="flex items-center relative">
                            <Award className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Certificate title"
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="issuer" className="mb-1">Issuing Organization*</Label>
                        <div className="flex items-center relative">
                            <Building className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                placeholder="Organization name"
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="date" className="mb-1">Issue Date*</Label>
                        <div className="flex items-center relative">
                            <Calendar className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="link" className="mb-1">Verification URL</Label>
                        <div className="flex items-center relative">
                            <ExternalLink className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="URL to verify the certificate"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description" className="mb-1">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of the certificate and what you learned"
                        rows={3}
                    />
                </div>

                <div>
                    <Label htmlFor="image" className="mb-1">Certificate Image URL*</Label>
                    <div className="flex items-center relative">
                        <ImageIcon className="absolute left-2 h-4 w-4 text-gray-500" />
                        <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/certificate.jpg"
                            className="pl-8"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    {isEditing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button type="submit">
                        {isEditing ? 'Update Certificate' : 'Create Certificate'}
                    </Button>
                </div>
            </form>

            {/* Certificates List */}
            <h2 className="text-xl font-bold mb-4">Certificates</h2>

            {certificates.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                    <p className="text-gray-500">No certificates found. Add your first certificate!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="overflow-hidden">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-certificate.png';
                                    }}
                                />
                            </div>

                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{cert.title}</h3>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <Building className="h-3 w-3" /> {cert.issuer}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {cert.date}
                                        </p>
                                    </div>

                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(cert)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => confirmDelete(cert)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {cert.description && (
                                    <p className="text-sm mt-2 line-clamp-3 text-gray-700 dark:text-gray-300">
                                        {cert.description}
                                    </p>
                                )}

                                {cert.link && (
                                    <div className="mt-4">
                                        <Button size="sm" variant="outline" className="w-full" asChild>
                                            <a
                                                href={cert.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-1"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Verify Certificate
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={handleDelete}
                title="Delete Certificate"
                description={`Are you sure you want to delete "${certificateToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
}