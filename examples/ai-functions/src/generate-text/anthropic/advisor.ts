import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    prompt:
      'I have a sorted list of 1 million integers and I need to find a specific value. What algorithm should I use and why? Ask the advisor before answering.',
    tools: {
      advisor: anthropic.tools.advisor_20260301({
        model: 'claude-opus-4-6',
        maxUses: 3,
      }),
    },
  });

  console.log('=== Text ===');
  console.log(result.text);

  console.log('\n=== Content parts ===');
  for (const part of result.content) {
    if (part.type === 'tool-call') {
      console.log(`tool-call: ${part.toolName} (${part.toolCallId})`);
    } else if (part.type === 'tool-result') {
      console.log(`tool-result: ${part.toolName} (${part.toolCallId})`);
      console.dir(part.output ?? part, { depth: Infinity });
    } else if (part.type === 'text') {
      // printed above
    } else {
      console.log(`${part.type}:`);
      console.dir(part, { depth: Infinity });
    }
  }

  console.log('\n=== Usage ===');
  console.dir(result.usage, { depth: Infinity });

  const iterations = (result.providerMetadata?.anthropic as any)?.iterations;
  if (iterations != null) {
    console.log('\n=== Iterations (advisor + executor tokens) ===');
    console.dir(iterations, { depth: Infinity });
  }
});
