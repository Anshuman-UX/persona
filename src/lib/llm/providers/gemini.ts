import OpenAI from 'openai';
import { LLMMessage } from '@/types';

export class GeminiProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async chat(messages: LLMMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
    });
    return response.choices[0]?.message?.content || '';
  }

  async *chatStream(messages: LLMMessage[]): AsyncIterable<string> {

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      stream: true,
    });
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
}
