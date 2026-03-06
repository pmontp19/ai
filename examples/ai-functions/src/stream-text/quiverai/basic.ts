import { quiverai } from '@ai-sdk/quiverai';
import { streamText } from 'ai';
import { run } from '../../lib/run';

run(async () => {
  const result = streamText({
    model: quiverai('arrow-preview'),
    prompt: 'A red circle with a blue border',
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }

  console.log();
  console.log('Usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
