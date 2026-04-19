import {
  createProviderToolFactoryWithOutputSchema,
  lazySchema,
  zodSchema,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

export const advisor_20260301ArgsSchema = lazySchema(() =>
  zodSchema(
    z.object({
      model: z.string(),
      maxUses: z.number().optional(),
      caching: z
        .object({
          type: z.literal('ephemeral'),
          ttl: z.union([z.literal('5m'), z.literal('1h')]).optional(),
        })
        .optional(),
    }),
  ),
);

export const advisor_20260301OutputSchema = lazySchema(() =>
  zodSchema(
    z.union([
      z.object({
        type: z.literal('advisor_result'),
        text: z.string(),
      }),
      z.object({
        type: z.literal('advisor_redacted_result'),
        encryptedContent: z.string(),
      }),
      z.object({
        type: z.literal('advisor_tool_result_error'),
        errorCode: z.string(),
      }),
    ]),
  ),
);

const advisor_20260301InputSchema = lazySchema(() => zodSchema(z.object({})));

const factory = createProviderToolFactoryWithOutputSchema<
  Record<string, never>,
  | {
      type: 'advisor_result';

      /**
       * Plain text advice produced by the advisor model.
       */
      text: string;
    }
  | {
      type: 'advisor_redacted_result';

      /**
       * Opaque encrypted advisor transcript.
       *
       * Must be round-tripped verbatim on subsequent turns.
       */
      encryptedContent: string;
    }
  | {
      type: 'advisor_tool_result_error';

      /**
       * Error code (e.g. `max_uses_exceeded`, `overloaded`).
       */
      errorCode: string;
    },
  {
    /**
     * Advisor model ID (e.g. `claude-opus-4-6`).
     */
    model: string;

    /**
     * Per-request cap on advisor calls. Unlimited when omitted.
     */
    maxUses?: number;

    /**
     * Prompt caching configuration for the advisor's transcript.
     */
    caching?: {
      type: 'ephemeral';
      ttl?: '5m' | '1h';
    };
  }
>({
  id: 'anthropic.advisor_20260301',
  inputSchema: advisor_20260301InputSchema,
  outputSchema: advisor_20260301OutputSchema,
  // supportsDeferredResults is intentionally omitted: the advisor result always
  // arrives in the same /v1/messages response as its server_tool_use block, and
  // the advisor cannot be invoked programmatically from code_execution.
});

export const advisor_20260301 = (args: Parameters<typeof factory>[0]) => {
  return factory(args);
};
