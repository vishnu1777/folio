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
    Plus,
    ExternalLink,
    Github,
    Image as ImageIcon,
    Tag
} from 'lucide-react';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const { toastCreate, toastUpdate, toastDelete, toastError, toastInfo, toastWarning } = useToastCrud();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        image: '',
        github: '',
        live: '',
        color: '#8B5CF6'
    });

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/projects');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setProjects(data);
                toastInfo('Projects loaded', `${data.length} projects retrieved successfully`);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toastError('Failed to load projects', 'Please try again later or contact support.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Create new project
    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            // Input validation
            if (!formData.title.trim()) {
                toastError('Validation Error', 'Project title is required');
                return;
            }

            if (!formData.description.trim()) {
                toastError('Validation Error', 'Project description is required');
                return;
            }

            if (!formData.image.trim()) {
                toastWarning('No Image', 'Project will be created without an image');
            }

            // Convert comma-separated tags to array
            const processedData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newProject = await response.json();
            setProjects(prev => [...prev, newProject]);

            // Reset form
            setFormData({
                title: '',
                description: '',
                tags: '',
                image: '',
                github: '',
                live: '',
                color: '#8B5CF6'
            });

            toastCreate('Project created', `"${processedData.title}" has been added to your portfolio.`);
        } catch (error) {
            console.error('Error creating project:', error);
            toastError('Failed to create project', 'Please check your inputs and try again.');
        }
    };

    // Edit project
    const handleEdit = (project) => {
        setSelectedProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            tags: project.tags.join(', '),
            image: project.image || '',
            github: project.github || '',
            live: project.live || '',
            color: project.color || '#8B5CF6'
        });
        setIsEditing(true);
        toastInfo('Edit mode', `Editing "${project.title}"`);
    };

    // Update project
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Input validation
            if (!formData.title.trim()) {
                toastError('Validation Error', 'Project title is required');
                return;
            }

            if (!formData.description.trim()) {
                toastError('Validation Error', 'Project description is required');
                return;
            }

            // Convert comma-separated tags to array
            const processedData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const response = await fetch(`/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedProject = await response.json();

            // Update projects array
            setProjects(prev =>
                prev.map(project => project.id === updatedProject.id ? updatedProject : project)
            );

            // Reset edit mode
            setIsEditing(false);
            setSelectedProject(null);

            // Reset form
            setFormData({
                title: '',
                description: '',
                tags: '',
                image: '',
                github: '',
                live: '',
                color: '#8B5CF6'
            });

            toastUpdate('Project updated', `"${processedData.title}" has been updated successfully.`);
        } catch (error) {
            console.error('Error updating project:', error);
            toastError('Failed to update project', 'Please check your connection and try again.');
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setSelectedProject(null);
        setFormData({
            title: '',
            description: '',
            tags: '',
            image: '',
            github: '',
            live: '',
            color: '#8B5CF6'
        });
        toastInfo('Edit cancelled', 'No changes were made');
    };

    // Show delete confirmation
    const confirmDelete = (project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    // Delete project
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/projects/${projectToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove project from state
            setProjects(prev => prev.filter(project => project.id !== projectToDelete.id));

            // Close dialog and reset
            setDeleteDialogOpen(false);
            setProjectToDelete(null);

            toastDelete('Project deleted', `"${projectToDelete.title}" has been removed from your portfolio.`);
        } catch (error) {
            console.error('Error deleting project:', error);
            toastError('Delete failed', 'Unable to delete the project. Please try again.');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-16 h-16 border-4 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-600">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Sonner Toaster Component */}
            <Toaster position="top-right" richColors closeButton />

            <h1 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Project' : 'Create New Project'}
            </h1>

            {/* Project Form */}
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-8 space-y-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="title" className="mb-1">Title*</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Project title"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags" className="mb-1">Tags (comma-separated)</Label>
                        <div className="flex items-center relative">
                            <Tag className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="React, NextJS, TailwindCSS"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description" className="mb-1">Description*</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Project description"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="image" className="mb-1">Image URL</Label>
                    <div className="flex items-center relative">
                        <ImageIcon className="absolute left-2 h-4 w-4 text-gray-500" />
                        <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="github" className="mb-1">GitHub URL</Label>
                        <div className="flex items-center relative">
                            <Github className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username/repo"
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="live" className="mb-1">Live URL</Label>
                        <div className="flex items-center relative">
                            <ExternalLink className="absolute left-2 h-4 w-4 text-gray-500" />
                            <Input
                                id="live"
                                name="live"
                                value={formData.live}
                                onChange={handleChange}
                                placeholder="https://your-project.com"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="color" className="mb-1">Theme Color</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="color"
                            name="color"
                            type="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-16 h-10 p-1"
                        />
                        <span className="text-sm text-gray-500">Choose a theme color for your project</span>
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
                        {isEditing ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </form>

            {/* Projects List */}
            <h2 className="text-xl font-bold mb-4">Projects</h2>

            {projects.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                    <p className="text-gray-500">No projects found. Create your first project!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(project => (
                        <Card key={project.id} className="overflow-hidden">
                            {project.image && (
                                <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-project.png';
                                        }}
                                    />
                                </div>
                            )}

                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">{project.title}</h3>

                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(project)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => confirmDelete(project)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                    {project.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                                            style={{ backgroundColor: `${project.color}20` }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm flex items-center hover:underline"
                                        >
                                            <Github className="h-4 w-4 mr-1" />
                                            GitHub
                                        </a>
                                    )}

                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm flex items-center hover:underline"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
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
                title="Delete Project"
                description={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
}