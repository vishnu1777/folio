'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import DeleteDialog from './delete-dialog';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        image: '',
        github: '',
        live: '',
        color: '#8B5CF6' // Default purple color
    });

    // Fetch projects
    useEffect(() => {
        async function fetchProjects() {
            try {
                setIsLoading(true);
                const res = await fetch('/api/projects');
                if (!res.ok) throw new Error('Failed to fetch projects');

                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setIsLoading(false);
            }
        }

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

        // Convert tags string to array if needed
        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        };

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (!res.ok) throw new Error('Failed to create project');

            const newProject = await res.json();
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
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    // Edit project
    const handleEdit = (project) => {
        setSelectedProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
            image: project.image,
            github: project.github,
            live: project.live,
            color: project.color
        });
        setIsEditing(true);
    };

    // Update project
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProject) return;

        // Convert tags string to array if needed
        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        };

        try {
            const res = await fetch(`/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (!res.ok) throw new Error('Failed to update project');

            const updatedProject = await res.json();
            setProjects(prev =>
                prev.map(project =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );

            // Reset form and editing state
            setFormData({
                title: '',
                description: '',
                tags: '',
                image: '',
                github: '',
                live: '',
                color: '#8B5CF6'
            });
            setIsEditing(false);
            setSelectedProject(null);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    // Delete project
    const handleDelete = async () => {
        if (!projectToDelete) return;

        try {
            const res = await fetch(`/api/projects/${projectToDelete.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete project');

            setProjects(prev =>
                prev.filter(project => project.id !== projectToDelete.id)
            );

            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
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
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading projects...</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit Project' : 'Add New Project'}
                    </h2>

                    <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
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
                                rows={4}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="React, NextJS, TailwindCSS"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="live">Live Demo URL</Label>
                            <Input
                                id="live"
                                name="live"
                                value={formData.live}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Color Theme</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="color"
                                    name="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-16 h-8"
                                    required
                                />
                                <span>{formData.color}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit">
                                {isEditing ? 'Update Project' : 'Add Project'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="overflow-hidden"
                        style={{ borderColor: project.color }}
                    >
                        <div
                            className="h-40 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${project.image})`,
                                backgroundColor: project.color + '20'
                            }}
                        />

                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{project.title}</h3>

                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {Array.isArray(project.tags) ? (
                                    project.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {project.tags}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2">
                                    <Button size="sm" asChild>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={project.live} target="_blank" rel="noopener noreferrer">Demo</a>
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(project)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            setProjectToDelete(project);
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