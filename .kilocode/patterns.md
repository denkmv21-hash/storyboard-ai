# 🧩 Kilo Code Patterns — Storyboard AI

## Паттерн 1: AI Service Function
```typescript
// apps/workers/src/services/image-generator.ts
import { z } from 'zod';

const ImageGenSchema = z.object({
  prompt: z.string().min(10),
  characterEmbedding: z.string().optional(),
  style: z.enum(['cinematic', 'anime', 'disney']),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']),
});

export async function generateImage(input: z.infer<typeof ImageGenSchema>) {
  const validated = ImageGenSchema.parse(input);
  
  // Логирование промпта для отладки
  if (process.env.DEBUG_AI === 'true') {
    console.log('🤖 PROMPT:', validated.prompt);
  }
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'sdxl-1.0',
      input: {
        prompt: validated.prompt,
        ip_adapter_scale: validated.characterEmbedding ? 0.8 : 0,
        ...validated,
      },
    }),
  });
  
  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  return response.json();
}