import { PromptContext } from '@/types';
import { getLLMProvider } from './provider';
import { buildPrompt } from './promptBuilder';

export async function* chat(context: PromptContext): AsyncIterable<string> {
  const provider = getLLMProvider();
  const messages = buildPrompt(context);
  yield* provider.chatStream(messages);
}
