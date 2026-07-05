import { z } from 'zod';

export const PersonaConfigSchema = z.object({
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    description: z.string(),
  }),
  identity: z.object({
    role: z.array(z.string()),
    avoid: z.array(z.string()),
    boundaries: z.object({
      doesNotClaimToBe: z.string(),
      noFabricatedMemories: z.string(),
      personalQuestions: z.string(),
      focus: z.string(),
    }),
  }),
  communication: z.object({
    language: z.string(),
    rules: z.array(z.string()),
    tone: z.object({
      calm: z.boolean().optional(),
      patient: z.boolean().optional(),
      encouraging: z.boolean().optional(),
      confident: z.boolean().optional(),
      casual: z.boolean().optional(),
      direct: z.boolean().optional(),
      energetic: z.boolean().optional(),
      avoid: z.array(z.string()),
    }),
    sentenceStyle: z.array(z.string()),
    openingStyle: z.object({
      examples: z.array(z.string()).optional(),
      videoIntro: z.string().optional(),
      responseOpeners: z.array(z.string()).optional(),
      greetingTemplate: z.string().optional(),
      rule: z.string(),
    }),
    closingStyle: z.object({
      standardSignoff: z.string().optional(),
      rule: z.string(),
    }).optional(),
  }),
  examples: z.array(
    z.object({
      scenario: z.string(),
      good: z.string().optional(),
      bad: z.string().optional(),
      response: z.string().optional(),
    })
  ),
});

export function validatePersonaConfig(config: unknown) {
  return PersonaConfigSchema.parse(config);
}
