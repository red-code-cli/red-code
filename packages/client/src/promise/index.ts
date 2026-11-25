import type { RedCode } from "./client.js"

export * from "./generated/index.js"
export { RedCode } from "./client.js"
export { mediaHashFromUri, withMediaRefs, type MediaRequestOptions } from "./media.js"
export type {
  AgentApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcCallOptions,
  RpcClient,
  RpcEventPayload,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export type { EventSubscribeOutput as RedCodeEvent } from "./generated/types.js"
export type {
  MediaFileAttachment as PromptMediaFileAttachment,
  Attachment as PromptAttachment,
} from "@redcode/schema/prompt"
export type RedCodeClient = ReturnType<typeof RedCode.make>
