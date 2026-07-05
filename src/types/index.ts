export type LLMProvider = 'gemini' | 'openai';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PersonaMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
}

export interface PersonaConfig {
  metadata: PersonaMetadata;
  identity: {
    role: string[];
    avoid: string[];
    boundaries: {
      doesNotClaimToBe: string;
      noFabricatedMemories: string;
      personalQuestions: string;
      focus: string;
    };
  };
  communication: {
    language: string;
    rules: string[];
    tone: {
      calm?: boolean;
      patient?: boolean;
      encouraging?: boolean;
      confident?: boolean;
      casual?: boolean;
      direct?: boolean;
      energetic?: boolean;
      avoid: string[];
    };
    sentenceStyle: string[];
    openingStyle: {
      examples?: string[];
      videoIntro?: string;
      responseOpeners?: string[];
      greetingTemplate?: string;
      rule: string;
    };
    closingStyle?: {
      standardSignoff?: string;
      rule: string;
    };
    [key: string]: any;
  };
  examples: Array<{
    scenario: string;
    good?: string;
    bad?: string;
    response?: string;
  }>;
  [key: string]: any;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  persona_id: string;
  title: string;
  created_at: string;
}

export interface PersonaMemory {
  id: string;
  user_id: string;
  persona_id: string;
  summary: string;
  updated_at: string;
}

export interface PromptContext {
  memorySummary: string | null;
  recentHistory: Message[];
  userMessage: string;
  personaConfig: PersonaConfig;
}
