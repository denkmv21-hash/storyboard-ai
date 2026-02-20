export function SceneCard({ scene }: { scene: any }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border bg-card">
      {scene.imageUrl ? (
        <img
          src={scene.imageUrl}
          alt={scene.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
        <p className="text-sm font-medium text-white">
          Scene {scene.sceneNumber}: {scene.title}
        </p>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1">
        <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
          {scene.style}
        </span>
        <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
          {scene.cameraAngle}
        </span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: any }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      <div className="aspect-video bg-muted">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || 'No description'}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
}

import { Film } from 'lucide-react';
