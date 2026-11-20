import { describe, expect, it } from 'vitest';

import { contactSchema } from '@/app/lib/validations';

const validBrief = {
  name: 'Test User',
  email: 'test@example.com',
  scope: 'Backend & Platform Infrastructure',
  inquiryType: 'consulting',
  timeline: 'month',
  stakes: 'A failed launch would block customer onboarding.',
  message: 'Please review the current delivery and recovery path.',
};

describe('contactSchema honeypot contract', () => {
  it('defaults an omitted honeypot for human submissions', () => {
    const result = contactSchema.safeParse(validBrief);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.honeypot).toBe('');
  });

  it('allows a bounded bot value so the route can acknowledge it silently', () => {
    const result = contactSchema.safeParse({ ...validBrief, honeypot: 'https://spam.invalid' });

    expect(result.success).toBe(true);
  });

  it('rejects an oversized honeypot payload', () => {
    const result = contactSchema.safeParse({ ...validBrief, honeypot: 'x'.repeat(201) });

    expect(result.success).toBe(false);
  });

  it('accepts the professional inquiry fields used by the contact form', () => {
    const result = contactSchema.safeParse(validBrief);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scope).toBe('Backend & Platform Infrastructure');
      expect(result.data.inquiryType).toBe('consulting');
      expect(result.data.timeline).toBe('month');
    }
  });

  it('rejects an unknown system domain', () => {
    const result = contactSchema.safeParse({
      ...validBrief,
      scope: 'Unbounded enterprise support',
    });

    expect(result.success).toBe(false);
  });

  it('requires the stakes and timeline fields in the API contract', () => {
    const incompleteBrief = {
      name: validBrief.name,
      email: validBrief.email,
      message: validBrief.message,
    };

    expect(contactSchema.safeParse(incompleteBrief).success).toBe(false);
  });
});
