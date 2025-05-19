'use client';

import { useState, useEffect } from 'react';
import { useToastCrud } from "@/app/hooks/use-toast-crud";
import { Toaster } from "sonner";
import DeleteDialog from './delete-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Pencil,
    Trash2,
    Image as ImageIcon,
    BarChart
} from 'lucide-react';

export default function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    const { toastCreate, toastUpdate, toastDelete, toastError, toastInfo, toastWarning } = useToastCrud();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        proficiency: 50,
        category: 'technical'
    });

    // Fetch skills
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/skills');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched skills:', data);
                setSkills(data);
                toastInfo('Skills loaded', `${data.length} skills retrieved successfully`);
            } catch (error) {
                console.error('Error fetching skills:', error);
                toastError('Failed to load skills', 'Please try again later or contact support.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSkills();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle proficiency slider change
    const handleProficiencyChange = (value) => {
        setFormData(prev => ({ ...prev, proficiency: value[0] }));
    };

    // Handle category selection
    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    // Create new skill
    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            // Input validation
            if (!formData.name.trim()) {
                toastError('Validation Error', 'Skill name is required');
                return;
            }

            if (!formData.image.trim()) {
                toastWarning('No Image', 'Skill will be created without an image');
            }

            const response = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newSkill = await response.json();
            setSkills(prev => [...prev, newSkill]);

            // Reset form
            setFormData({
                name: '',
                image: '',
                proficiency: 50,
                category: 'technical'
            });

            toastCreate('Skill created', `"${formData.name}" has been added to your skills.`);
        } catch (error) {
            console.error('Error creating skill:', error);
            toastError('Failed to create skill', 'Please check your inputs and try again.');
        }
    };

    // Edit skill
    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setFormData({
            name: skill.name,
            image: skill.image || '',
            proficiency: skill.proficiency,
            category: skill.category || 'technical'
        });
        setIsEditing(true);
        toastInfo('Edit mode', `Editing "${skill.name}"`);
    };

    // Update skill
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Input validation
            if (!formData.name.trim()) {
                toastError('Validation Error', 'Skill name is required');
                return;
            }

            const response = await fetch(`/api/skills/${selectedSkill.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedSkill = await response.json();

            // Update skills array
            setSkills(prev =>
                prev.map(skill => skill.id === updatedSkill.id ? updatedSkill : skill)
            );

            // Reset edit mode
            setIsEditing(false);
            setSelectedSkill(null);

            // Reset form
            setFormData({
                name: '',
                image: '',
                proficiency: 50,
                category: 'technical'
            });

            toastUpdate('Skill updated', `"${formData.name}" has been updated successfully.`);
        } catch (error) {
            console.error('Error updating skill:', error);
            toastError('Failed to update skill', 'Please check your connection and try again.');
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setSelectedSkill(null);
        setFormData({
            name: '',
            image: '',
            proficiency: 50,
            category: 'technical'
        });
        toastInfo('Edit cancelled', 'No changes were made');
    };

    // Show delete confirmation
    const confirmDelete = (skill) => {
        setSkillToDelete(skill);
        setDeleteDialogOpen(true);
    };

    // Delete skill
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/skills/${skillToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove skill from state
            setSkills(prev => prev.filter(skill => skill.id !== skillToDelete.id));

            // Close dialog and reset
            setDeleteDialogOpen(false);
            setSkillToDelete(null);

            toastDelete('Skill deleted', `"${skillToDelete.name}" has been removed from your skills.`);
        } catch (error) {
            console.error('Error deleting skill:', error);
            toastError('Delete failed', 'Unable to delete the skill. Please try again.');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-16 h-16 border-4 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-600">Loading skills...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Sonner Toaster Component */}
            <Toaster position="top-right" richColors closeButton />

            <h1 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Skill' : 'Create New Skill'}
            </h1>

            {/* Skill Form */}
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-8 space-y-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" className="mb-1">Name*</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Skill name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="category" className="mb-1">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="soft">Soft Skills</SelectItem>
                                <SelectItem value="tool">Tools</SelectItem>
                                <SelectItem value="language">Languages</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                            placeholder="https://example.com/icon.svg"
                            className="pl-8"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label htmlFor="proficiency">Proficiency Level</Label>
                        <span className="text-sm font-medium">{formData.proficiency}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <BarChart className="h-4 w-4 text-gray-500" />
                        <Slider
                            id="proficiency"
                            min={0}
                            max={100}
                            step={1}
                            value={[formData.proficiency]}
                            onValueChange={handleProficiencyChange}
                            className="flex-1"
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
                        {isEditing ? 'Update Skill' : 'Create Skill'}
                    </Button>
                </div>
            </form>

            {/* Skills List */}
            <h2 className="text-xl font-bold mb-4">Skills</h2>

            {skills.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                    <p className="text-gray-500">No skills found. Create your first skill!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map(skill => (
                        <Card key={skill.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{skill.name}</h3>
                                        <p className="text-sm text-gray-500">{skill.category || 'technical'}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(skill)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => confirmDelete(skill)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-3 mb-2">
                                    {skill.image && (
                                        <img
                                            src={skill.image}
                                            alt={skill.name}
                                            className="h-10 w-10 object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-skill.png';
                                            }}
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${skill.proficiency}%`,
                                                    backgroundColor: skill.category === 'technical' ? '#8B5CF6' :
                                                        skill.category === 'soft' ? '#10B981' :
                                                            skill.category === 'tool' ? '#F59E0B' : '#3B82F6'
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-right mt-1">{skill.proficiency}%</p>
                                    </div>
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
                title="Delete Skill"
                description={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}