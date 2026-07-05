import { PromptContext, LLMMessage } from '@/types';

export function buildPrompt(context: PromptContext): LLMMessage[] {
  const { personaConfig, memorySummary, recentHistory, userMessage } = context;

  // 1. System Prompt
  const systemPrompt = `You are an AI programming mentor. You must adopt the specific persona and rules defined below.`;

  // 2. Persona Rules
  const personaRules = `
[PERSONA SPECIFICATION]
Name: ${personaConfig.metadata.name}
Role: ${personaConfig.identity.role.join(', ')}
Avoid being: ${personaConfig.identity.avoid.join(', ')}

[COMMUNICATION CONSTRAINTS]
Language Style: ${personaConfig.communication.language}
Core Language Rules:
${personaConfig.communication.rules.map(r => `- ${r}`).join('\n')}

Tone:
- Calmer? ${personaConfig.communication.tone.calm ? 'Yes' : 'No'}
- CASUAL? ${personaConfig.communication.tone.casual ? 'Yes' : 'No'}
- DIRECT? ${personaConfig.communication.tone.direct ? 'Yes' : 'No'}
- ENERGETIC? ${personaConfig.communication.tone.energetic ? 'Yes' : 'No'}
- Tone to Avoid: ${personaConfig.communication.tone.avoid.join(', ')}

Sentence formatting:
${personaConfig.communication.sentenceStyle.map(s => `- ${s}`).join('\n')}

Opening style guidelines:
- Opener Rule: ${personaConfig.communication.openingStyle.rule}
${personaConfig.communication.openingStyle.greetingTemplate ? `- Greeting template: "${personaConfig.communication.openingStyle.greetingTemplate}"` : ''}

[TEACHING MINDSET]
${personaConfig.teachingStyle?.rule || ''}
${personaConfig.teachingStyle?.noSpoonFeeding?.principle ? `- Spoon-feeding rule: ${personaConfig.teachingStyle.noSpoonFeeding.principle}` : ''}
- Beginner handling: ${personaConfig.teachingStyle?.beginnerHandling?.assumption || ''}
- ANALOGY DOMAINS preferred: ${personaConfig.engineeringMindset?.analogyDomains?.join(', ') || ''}

Ensure you strictly follow the boundaries of not claiming to be a real named individual, not inventing personal memories, and focusing purely on the methodology.
`;

  const messages: LLMMessage[] = [];

  // Combine System Prompt and Persona Rules at the very start as the system instructions
  messages.push({
    role: 'system',
    content: `${systemPrompt}\n\n${personaRules}`
  });

  // 3. Memory Summary (injected if exists)
  if (memorySummary) {
    messages.push({
      role: 'system',
      content: `[LONG-TERM MEMORY SUMMARY OF USER'S PROGRESS WITH ${personaConfig.metadata.name}]
Here is a summary of what the user has learned or done so far under your mentorship:
${memorySummary}

Use this context to personalize your response, avoiding repeats of past topics and building upon what they already know.`
    });
  }

  // 4. Recent History (last 20 messages)
  recentHistory.forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  });

  // 5. Current User Message
  messages.push({
    role: 'user',
    content: userMessage
  });

  return messages;
}
