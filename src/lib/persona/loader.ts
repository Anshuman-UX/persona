import { personas } from '@/personas';
import { PersonaConfig } from '@/types';

export function getPersonaById(id: string): PersonaConfig {
  const persona = personas[id];
  if (!persona) {
    throw new Error(`Persona not found: ${id}`);
  }
  return persona;
}
