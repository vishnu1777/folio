'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Slider } from '../../../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import DeleteDialog from './delete-dialog';

export default function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        proficiency: 50,
        category: 'technical'
    });

    // Fetch skills
    useEffect(() => {
        async function fetchSkills() {
            try {
                setIsLoading(true);
                const res = await fetch('/api/skills');
                if (!res.ok) throw new Error('Failed to fetch skills');

                const data = await res.json();
                setSkills(data);
            } catch (error) {
                console.error('Error loading skills:', error);
            } finally {
                setIsLoading(false);
            }
        }

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
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create skill');

            const newSkill = await res.json();
            setSkills(prev => [...prev, newSkill]);

            // Reset form
            setFormData({
                name: '',
                image: '',
                proficiency: 50,
                category: 'technical'
            });
        } catch (error) {
            console.error('Error creating skill:', error);
        }
    };

    // Edit skill
    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setFormData({
            name: skill.name,
            image: skill.image,
            proficiency: skill.proficiency,
            category: skill.category || 'technical'
        });
        setIsEditing(true);
    };

    // Update skill
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedSkill) return;

        try {
            const res = await fetch(`/api/skills/${selectedSkill.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update skill');

            const updatedSkill = await res.json();
            setSkills(prev =>
                prev.map(skill =>
                    skill.id === updatedSkill.id ? updatedSkill : skill
                )
            );

            // Reset form and editing state
            setFormData({
                name: '',
                image: '',
                proficiency: 50,
                category: 'technical'
            });
            setIsEditing(false);
            setSelectedSkill(null);
        } catch (error) {
            console.error('Error updating skill:', error);
        }
    };

    // Delete skill
    const handleDelete = async () => {
        if (!skillToDelete) return;

        try {
            const res = await fetch(`/api/skills/${skillToDelete.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete skill');

            setSkills(prev =>
                prev.filter(skill => skill.id !== skillToDelete.id)
            );

            setDeleteDialogOpen(false);
            setSkillToDelete(null);
        } catch (error) {
            console.error('Error deleting skill:', error);
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
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading skills...</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit Skill' : 'Add New Skill'}
                    </h2>

                    <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Skill Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                            <Label htmlFor="proficiency">Proficiency ({formData.proficiency}%)</Label>
                            <Slider
                                id="proficiency"
                                min={0}
                                max={100}
                                step={1}
                                value={[formData.proficiency]}
                                onValueChange={handleProficiencyChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
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

                        <div className="flex gap-2 pt-2">
                            <Button type="submit">
                                {isEditing ? 'Update Skill' : 'Add Skill'}
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
                {skills.map((skill) => (
                    <Card key={skill.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold">{skill.name}</h3>
                                    <p className="text-sm text-gray-500">{skill.category || 'technical'}</p>
                                </div>
                                <img
                                    src={skill.image}
                                    alt={skill.name}
                                    className="h-10 w-10 object-contain"
                                />
                            </div>

                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-1">
                                <div
                                    className="h-full bg-purple-600 rounded-full"
                                    style={{ width: `${skill.proficiency}%` }}
                                />
                            </div>
                            <p className="text-xs text-right">{skill.proficiency}%</p>

                            <div className="flex gap-2 mt-4">
                                <Button size="sm" onClick={() => handleEdit(skill)}>
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        setSkillToDelete(skill);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    Delete
                                </Button>
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