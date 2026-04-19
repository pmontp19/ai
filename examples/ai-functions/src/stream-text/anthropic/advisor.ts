import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { run } from '../../lib/run';

run(async () => {
  const result = streamText({
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

  for await (const chunk of result.fullStream) {
    switch (chunk.type) {
      case 'text-delta': {
        process.stdout.write(chunk.text);
        break;
      }

      case 'tool-call': {
        console.log(
          `\n\x1b[32m\x1b[1mTool call:\x1b[22m ${chunk.toolName}\x1b[0m`,
        );
        console.log(JSON.stringify(chunk.input, null, 2));
        break;
      }

      case 'tool-result': {
        console.log(
          `\x1b[32m\x1b[1mTool result:\x1b[22m ${chunk.toolName}\x1b[0m`,
        );
        console.log(JSON.stringify(chunk.output, null, 2));
        break;
      }

      case 'error':
        console.error('Error:', chunk.error);
        break;
    }
  }

  const iterations = (
    (await result.providerMetadata)?.anthropic as
      | { iterations?: unknown }
      | undefined
  )?.iterations;
  if (iterations != null) {
    console.log('\n\x1b[36m\x1b[1mIterations:\x1b[0m');
    console.dir(iterations, { depth: Infinity });
  }

  console.log('\n');
});
