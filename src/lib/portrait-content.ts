import { z } from 'astro/zod';

const portraitEntrySchema = z.object({
  id: z.string(),
  region: z.string(),
  faceShape: z.string(),
  title: z.string(),
  image: z.url(),
  alt: z.string(),
  prompt: z.string(),
});

const portraitDataSchema = z.object({
  study: z.object({
    id: z.string(),
    title: z.string(),
    model: z.string(),
    testedAt: z.string(),
    status: z.string(),
    method: z.string(),
  }),
  entries: z.array(portraitEntrySchema),
});

export type PortraitEntry = z.infer<typeof portraitEntrySchema>;
export type PortraitData = z.infer<typeof portraitDataSchema>;

const CONTENT_URL =
  'https://raw.githubusercontent.com/DenseOoFog/ainothing-content/main/data/prompts/gpt-image-2/portrait-atlas/index.json';

export async function getPortraitData(): Promise<PortraitData> {
  const response = await fetch(CONTENT_URL);
  if (!response.ok) throw new Error(`Unable to load portrait content: ${response.status}`);
  return portraitDataSchema.parse(await response.json());
}
