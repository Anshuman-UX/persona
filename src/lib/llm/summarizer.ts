import { Message, LLMMessage } from '@/types';
import { getLLMProvider } from './provider';

export async function summarizeMemory(
  history: Message[],
  existingSummary: string | null,
  personaId: string
): Promise<string> {
  const provider = getLLMProvider();

  const formattedHistory = history
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');

  const systemInstruction = `You are an AI assistant tasked with maintaining a long-term memory of a student's learning progress.
Your goal is to compile or update a summary of what the student has learned, built, or struggled with when interacting with their tutor "${personaId}".

Guidelines for the summary:
- Be concise (under 250 words total).
- Keep it factual and focus on skills, coding concepts, code examples attempted, and projects built.
- Highlight specific errors or misconceptions they ran into.
- Do not output any conversational filler. Only return the compiled summary.

Structure the output strictly using these three sections:
- **CONCEPTS COVERED & PROJECTS BUILT:**
- **COMMON ERRORS & STICKING POINTS:**
- **MENTOR PATH RECOMMENDATIONS:**`;

  const userContent = `
[EXISTING LONG-TERM MEMORY SUMMARY]
${existingSummary || 'No existing summary.'}

[RECENT CONVERSATION HISTORY (Last 20 turns)]
${formattedHistory}

Please update the existing summary by incorporating the new history. Output the complete updated summary.`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemInstruction },
    { role: 'user', content: userContent }
  ];

  return await provider.chat(messages);
}
