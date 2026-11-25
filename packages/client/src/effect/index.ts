// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { RedCode } from "./client.js"

export * from "./generated/index"
export { RedCode } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@redcode/schema/agent"
export { Command } from "@redcode/schema/command"
export { Config } from "@redcode/schema/config"
export { Credential } from "@redcode/schema/credential"
export { Event } from "@redcode/schema/event"
export { EventLog } from "@redcode/schema/event-log"
export { FileSystem } from "@redcode/schema/filesystem"
export { Form } from "@redcode/schema/form"
export { Integration } from "@redcode/schema/integration"
export { Location } from "@redcode/schema/location"
export { Model } from "@redcode/schema/model"
export { Permission } from "@redcode/schema/permission"
export { PermissionSaved } from "@redcode/schema/permission-saved"
export { Project } from "@redcode/schema/project"
export { Worktree } from "@redcode/schema/worktree"
export { Vcs } from "@redcode/schema/vcs"
export { Provider } from "@redcode/schema/provider"
export { Pty } from "@redcode/schema/pty"
export { Question } from "@redcode/schema/question"
export { Reference } from "@redcode/schema/reference"
export { WebSearch } from "@redcode/schema/websearch"
export { AbsolutePath, RelativePath } from "@redcode/schema/schema"
export { Session } from "@redcode/schema/session"
export { SessionInbox } from "@redcode/schema/session-inbox"
export { SessionMessage } from "@redcode/schema/session-message"
export { Skill } from "@redcode/schema/skill"
export { Prompt } from "@redcode/schema/prompt"
export { PromptInput } from "@redcode/schema/prompt-input"
export type { RedCodeEvent } from "@redcode/protocol/groups/event"
export type RedCodeClient = Effect.Success<ReturnType<typeof RedCode.make>>
