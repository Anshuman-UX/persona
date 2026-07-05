import { hiteshPersona } from './hitesh';
import { piyushPersona } from './piyush';
import { PersonaConfig } from '@/types';

export const personas: Record<string, PersonaConfig> = {
  hitesh: hiteshPersona,
  piyush: piyushPersona,
};

export { hiteshPersona, piyushPersona };
