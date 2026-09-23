/**
 * On-demand course queries. Pages pass the results into presentational components.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type CourseEntry = CollectionEntry<'courses'>;

export const tracks = [
  {
    id: 'leadership',
    label: 'Leadership',
    nav: 'Practice Culture & Leadership',
    description:
      'Leadership, mindset, and culture courses for doctors and every person on the team.',
  },
  {
    id: 'receptionist',
    label: 'Receptionist / Front Desk',
    nav: 'Receptionist & Hospitality',
    description:
      'Phone, hospitality, and new-patient conversion training for the front desk.',
  },
  {
    id: 'new-patient-experience',
    label: 'New Patient Experience',
    nav: 'New Patient Experience',
    description:
      'Immersive experience, communication, and hospitality training for the visit itself.',
  },
  {
    id: 'treatment-coordinator',
    label: 'Treatment Coordinator',
    nav: 'Treatment Coordinator Conversion',
    description:
      'Financial presentation, case acceptance, and exam-room courses for treatment coordinators.',
  },
  {
    id: 'clinical-team',
    label: 'Clinical Team',
    nav: 'Clinical Team',
    description:
      'Compliance, communication, and chairside courses for the clinical team.',
  },
] as const;

export type TrackId = (typeof tracks)[number]['id'];

/** Drafts render in `dev` and disappear from production builds. */
export async function getPublished(): Promise<CourseEntry[]> {
  const entries = await getCollection('courses', ({ data }) => {
    return import.meta.env.DEV || data.draft !== true;
  });

  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function trackById(id: string) {
  return tracks.find((track) => track.id === id);
}

export function cardTitle(entry: CourseEntry, track: TrackId): string {
  return entry.data.labels.find((label) => label.track === track)?.title ?? entry.data.title;
}

export function coursesInTrack(entries: CourseEntry[], track: TrackId): CourseEntry[] {
  return entries
    .filter((entry) => entry.data.tracks.includes(track))
    .sort((a, b) => {
      const aOrder = a.data.positions.find((item) => item.track === track)?.order ?? 99;
      const bOrder = b.data.positions.find((item) => item.track === track)?.order ?? 99;
      return aOrder - bOrder;
    });
}

export function relatedCourses(entries: CourseEntry[], current: CourseEntry, limit = 3): CourseEntry[] {
  const tracksForCurrent = new Set(current.data.tracks);
  return entries
    .filter((entry) => entry.id !== current.id && entry.data.tracks.some((track) => tracksForCurrent.has(track)))
    .slice(0, limit);
}

/** Product photo or lesson still saved from the SamCart sales page. */
export function courseCover(slug: string): string | null {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const file = `${slug}${ext}`;
    if (existsSync(join(process.cwd(), 'public', 'images', 'courses', file))) {
      return `/images/courses/${file}`;
    }
  }
  return null;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

const genericInclude =
  /expert guidance|guidance from|4k high-definition|unlimited access|keep this course for life|keep the course forever|lifetime access|yours to keep/i;

/** Outcome-shaped bullets, skipping instructor credits and access boilerplate. */
export function cardHighlights(includes: string[], limit = 2): string[] {
  const specific = includes.filter((item) => !genericInclude.test(item));
  return (specific.length > 0 ? specific : includes).slice(0, limit);
}

export function hasLifetimeAccess(includes: string[]): boolean {
  return includes.some((item) => /lifetime|for life|forever|keep this course|keep the course/i.test(item));
}

/** First stated length, such as "6 hours" or "53 minutes". */
export function courseDuration(includes: string[]): string | null {
  for (const item of includes) {
    const match = item.match(/(\d+(?:\.\d+)?)\+?\s*-?\s*(hours?|minutes?)/i);
    if (!match) continue;
    const amount = Number(match[1]);
    const hours = /hour/i.test(match[2]);
    const unit = hours ? (amount === 1 ? 'hour' : 'hours') : amount === 1 ? 'minute' : 'minutes';
    return `${match[1]} ${unit}`;
  }
  return null;
}

export function savingsPercent(price?: number, compareAt?: number): number | null {
  if (price == null || compareAt == null || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
