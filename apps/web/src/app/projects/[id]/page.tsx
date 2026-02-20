'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Wand2, Download, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, Input, Label, Textarea, Select } from '@/components/ui';
import { SceneCard } from '@/components/cards';
import { useProjectStore, Scene } from '@/stores/project-store';
import { projectsApi, scenesApi, generationApi } from '@/lib/api';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { currentProject, setCurrentProject, scenes, setScenes, addScene, updateScene } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [showAddScene, setShowAddScene] = useState(false);
  const [newScene, setNewScene] = useState({
    title: '',
    description: '',
    style: 'cinematic',
    cameraAngle: 'medium',
  });

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      const [projectRes, scenesRes] = await Promise.all([
        projectsApi.getById(params.id as string),
        scenesApi.getByProject(params.id as string),
      ]);

      if (projectRes.data.success) {
        setCurrentProject(projectRes.data.data);
      }
      if (scenesRes.data.success) {
        setScenes(scenesRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScene = async () => {
    if (!newScene.title || !newScene.description) return;

    try {
      const response = await scenesApi.create({
        projectId: params.id as string,
        title: newScene.title,
        description: newScene.description,
      });

      if (response.data.success) {
        addScene(response.data.data);
        setNewScene({ title: '', description: '', style: 'cinematic', cameraAngle: 'medium' });
        setShowAddScene(false);
      }
    } catch (error) {
      console.error('Failed to add scene:', error);
      alert('Failed to add scene');
    }
  };

  const handleGenerateImage = async (scene: Scene) => {
    setIsGenerating({ ...isGenerating, [scene.id]: true });

    try {
      const prompt = `${scene.description}, ${scene.style}, ${scene.cameraAngle}`;
      
      const response = await generationApi.generate({
        sceneId: scene.id,
        prompt,
        style: scene.style,
        aspectRatio: scene.aspectRatio,
      });

      if (response.data.success) {
        updateScene(scene.id, { status: 'generating' });
        
        // Poll for completion
        pollGenerationStatus(response.data.data.id, scene.id);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to start generation');
    } finally {
      setIsGenerating({ ...isGenerating, [scene.id]: false });
    }
  };

  const pollGenerationStatus = async (jobId: string, sceneId: string) => {
    const poll = async () => {
      try {
        const response = await generationApi.getStatus(jobId);
        const job = response.data.data;

        if (job.status === 'completed' && job.image_url) {
          updateScene(sceneId, {
            imageUrl: job.image_url,
            status: 'completed',
          });
        } else if (job.status === 'failed') {
          updateScene(sceneId, { status: 'failed' });
          alert('Generation failed');
        } else {
          setTimeout(poll, 3000);
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
    };

    poll();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentProject) {
    return null;
  }

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link href="/dashboard" className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{currentProject.title}</h1>
          <p className="text-muted-foreground">{currentProject.description || 'No description'}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Scenes ({scenes.length})
        </h2>
        <Button onClick={() => setShowAddScene(!showAddScene)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Scene
        </Button>
      </div>

      {/* Add Scene Form */}
      {showAddScene && (
        <Card className="mb-8 p-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newScene.title}
                onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                placeholder="Scene title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newScene.description}
                onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                placeholder="Describe the scene..."
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Style</Label>
                <Select
                  value={newScene.style}
                  onChange={(e) => setNewScene({ ...newScene, style: e.target.value })}
                >
                  <option value="cinematic">Cinematic</option>
                  <option value="anime">Anime</option>
                  <option value="disney">Disney</option>
                  <option value="pixar">Pixar</option>
                  <option value="noir">Noir</option>
                  <option value="sketch">Sketch</option>
                </Select>
              </div>
              <div>
                <Label>Camera Angle</Label>
                <Select
                  value={newScene.cameraAngle}
                  onChange={(e) => setNewScene({ ...newScene, cameraAngle: e.target.value })}
                >
                  <option value="wide">Wide</option>
                  <option value="medium">Medium</option>
                  <option value="closeup">Closeup</option>
                  <option value="extreme-closeup">Extreme Closeup</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddScene}>Add Scene</Button>
              <Button variant="outline" onClick={() => setShowAddScene(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Scenes */}
      {scenes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <p className="mb-4 text-muted-foreground">No scenes yet</p>
          <Button onClick={() => setShowAddScene(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Scene
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <div key={scene.id} className="group relative">
              <SceneCard scene={scene} />
              
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleGenerateImage(scene)}
                  disabled={isGenerating[scene.id] || scene.status === 'generating'}
                >
                  <Wand2 className="h-4 w-4" />
                  {scene.status === 'generating' ? 'Generating...' : 'Generate'}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {scene.status === 'failed' && (
                <p className="mt-1 text-xs text-destructive">Generation failed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
