'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Film, Upload, Settings } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { ProjectCard } from '@/components/cards';
import { useAuthStore } from '@/stores/auth-store';
import { useProjectStore } from '@/stores/project-store';
import { projectsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/language-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { projects, setProjects, setLoading, isLoading } = useProjectStore();
  const { t } = useLanguage();
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const title = prompt(t.dashboard.enterProjectTitle);
    if (!title) return;

    try {
      const response = await projectsApi.create({ title });
      if (response.data.success) {
        router.push(`/projects/${response.data.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert(t.dashboard.failedToCreate);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Welcome */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
          <p className="text-muted-foreground">
            {t.dashboard.welcomeBack}, {user?.name || user?.email}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 px-4 py-2">
            <span className="text-sm font-medium">
              {user?.credits} {t.credits}
            </span>
          </div>
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.dashboard.newProject}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Film className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{t.dashboard.myProjects}</h3>
            <p className="text-sm text-muted-foreground">
              {projects.length} {t.credits === 'кредитов' ? 'проектов' : 'projects'}
            </p>
          </div>
        </Card>

        <Link href="/scripts" className="block">
          <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t.dashboard.uploadScript}</h3>
              <p className="text-sm text-muted-foreground">
                {t.dashboard.parseAndGenerate}
              </p>
            </div>
          </Card>
        </Link>

        <Card className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{t.dashboard.settings}</h3>
            <p className="text-sm text-muted-foreground">
              {t.dashboard.manageAccount}
            </p>
          </div>
        </Card>
      </div>

      {/* Projects Grid */}
      <section>
        <h2 className="mb-4 text-center text-xl font-semibold">{t.dashboard.recentProjects}</h2>
        
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            {t.dashboard.loading}
          </div>
        ) : projects.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">{t.dashboard.noProjectsYet}</h3>
            <p className="mb-4 text-muted-foreground">
              {t.dashboard.createFirstProject}
            </p>
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              {t.dashboard.createProject}
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
