// Shared client/server contract for the professional inquiry endpoint.
import { z } from 'zod';

export const CONTACT_SCOPES = [
  'Backend & Platform Infrastructure',
  'Fintech & Compliance Systems',
  'Data & Quantitative Systems',
  'AI & Intelligent Workflows',
  'Architecture Advisory',
] as const;

export const CONTACT_INQUIRY_TYPES = [
  'job',
  'consulting',
  'collaboration',
  'advisory',
] as const;

export const CONTACT_TIMELINES = [
  'immediate',
  'month',
  'quarter',
  'exploring',
] as const;

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter at least two characters.').max(50),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    company: z.string().trim().max(120).optional(),
    scope: z.enum(CONTACT_SCOPES).optional(),
    inquiryType: z.enum(CONTACT_INQUIRY_TYPES).optional(),
    timeline: z.enum(CONTACT_TIMELINES),
    stakes: z.string().trim().max(240).optional().default(''),
    message: z.string().trim().min(10, 'Add at least ten characters to the brief.').max(500),
    // Honeypot: bots fill it, humans leave it empty. The route silently
    // acknowledges a non-empty value after validation.
    honeypot: z.string().max(200).default(''),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType !== 'job' && data.stakes.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['stakes'],
        message: 'Describe the operational or business impact.',
      });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;
