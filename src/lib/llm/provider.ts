import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { LLMMessage } from '@/types';

export interface ILLMProvider {
  chat(messages: LLMMessage[]): Promise<string>;
  chatStream(messages: LLMMessage[]): AsyncIterable<string>;
}

export function getLLMProvider(): ILLMProvider {
  const provider = process.env.ACTIVE_LLM_PROVIDER || 'gemini';
  if (provider === 'openai') {
    return new OpenAIProvider();
  }
  return new GeminiProvider();
}
