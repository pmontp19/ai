import { quiverai } from '@ai-sdk/quiverai';
import { generateImage } from 'ai';
import { run } from '../../lib/run';

run(async () => {
  const { images, providerMetadata } = await generateImage({
    model: quiverai.image('arrow-preview'),
    prompt: 'A red circle with a blue border',
    providerOptions: {
      quiverai: {
        instructions: 'minimalist flat style',
      },
    },
  });

  // SVGs are returned as Uint8Array, decode to string
  const decoder = new TextDecoder();
  for (const image of images) {
    console.log(decoder.decode(image.uint8Array));
  }

  console.log('providerMetadata', JSON.stringify(providerMetadata, null, 2));
});
