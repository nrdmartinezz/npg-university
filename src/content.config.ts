import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const courseTracks = [
  'leadership',
  'receptionist',
  'new-patient-experience',
  'treatment-coordinator',
  'clinical-team',
] as const;

const placement = z.object({
  track: z.enum(courseTracks),
  order: z.number().int(),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subtitle: z.string().optional(),
    /** Filtered out of production builds; still visible in `dev`. */
    draft: z.boolean().default(false),
    /** SamCart checkout. Enrollment and payment happen there. */
    enrollUrl: z.string().url(),
    instructor: z.string().optional(),
    /** Current price in dollars, only when the sales page states one. */
    price: z.number().optional(),
    compareAtPrice: z.number().optional(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tracks: z.array(z.enum(courseTracks)).min(1),
    positions: z.array(placement).min(1),
    /** Menu title when a shared course is labeled differently inside a track. */
    labels: z.array(z.object({ track: z.enum(courseTracks), title: z.string() })).default([]),
    includes: z.array(z.string()).default([]),
  }),
});

export const collections = { courses };
