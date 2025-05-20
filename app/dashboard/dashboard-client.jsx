'use client';
import React from "react"; // Add this import
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import DashboardHeader from './components/dashboard-header';
import SkillsManager from './components/skills-manager';
import ProjectsManager from './components/projects-manager';
import CertificatesManager from './components/certificates-manager';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('skills');

    // Check authentication
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        }
    }, [status]);

    // Show loading state
    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />

            <main className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
                    <div>
                        {session?.user?.email && (
                            <p className="text-sm text-gray-500">
                                Logged in as: <span className="font-medium">{session.user.email}</span>
                            </p>
                        )}
                    </div>
                </div>

                <Tabs
                    defaultValue="skills"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="certificates">Certificates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="skills" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <SkillsManager />
                    </TabsContent>

                    <TabsContent value="projects" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <ProjectsManager />
                    </TabsContent>

                    <TabsContent value="certificates" className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <CertificatesManager />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}