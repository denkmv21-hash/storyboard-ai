import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  description: string;
  dialogue: string | null;
  characters: string[];
  location: string | null;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night' | 'interior';
  cameraAngle: 'wide' | 'medium' | 'closeup' | 'extreme-closeup' | 'over-the-shoulder' | 'point-of-view';
  style: 'cinematic' | 'anime' | 'disney' | 'pixar' | 'noir' | 'sketch';
  aspectRatio: '16:9' | '9:16' | '1:1' | '2.35:1';
  imageUrl: string | null;
  prompt: string | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  scenes: Scene[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  removeScene: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools((set) => ({
    projects: [],
    currentProject: null,
    scenes: [],
    isLoading: false,
    error: null,

    setProjects: (projects) => set({ projects }),
    
    setCurrentProject: (project) => set({ currentProject: project }),
    
    setScenes: (scenes) => set({ scenes }),
    
    addScene: (scene) =>
      set((state) => ({
        scenes: [...state.scenes, scene],
      })),
    
    updateScene: (id, updates) =>
      set((state) => ({
        scenes: state.scenes.map((scene) =>
          scene.id === id ? { ...scene, ...updates } : scene
        ),
      })),
    
    removeScene: (id) =>
      set((state) => ({
        scenes: state.scenes.filter((scene) => scene.id !== id),
      })),
    
    setLoading: (isLoading) => set({ isLoading }),
    
    setError: (error) => set({ error }),
  }))
);
