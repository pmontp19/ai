---
'@ai-sdk/anthropic': patch
---

feat(provider/anthropic): support advisor tool (advisor_20260301)

Adds the Anthropic server-side advisor tool, which lets a cheaper executor
model consult a more capable advisor model mid-generation within a single
`/v1/messages` request. Exposed as `anthropic.tools.advisor_20260301`.

The beta header `advisor-tool-2026-03-01` is added automatically. Advisor
content blocks (`server_tool_use` with `name: "advisor"` and
`advisor_tool_result`) are mapped to AI SDK tool calls and tool results and
round-tripped through message history. Advisor token usage is surfaced via
`providerMetadata.anthropic.iterations` as `advisor_message` entries
containing the advisor `model` ID.
