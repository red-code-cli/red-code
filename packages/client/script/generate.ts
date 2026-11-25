import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@redcode/httpapi-codegen"
import {
  ClientApi,
  clientNamespace,
  effectOmitEndpoints,
  groupNames,
  promiseOmitEndpoints,
} from "@redcode/protocol/client"
import { Agent } from "@redcode/schema/agent"
import { Artifact } from "@redcode/schema/artifact"
import { Command } from "@redcode/schema/command"
import { Config } from "@redcode/schema/config"
import { Credential } from "@redcode/schema/credential"
import { Event } from "@redcode/schema/event"
import { EventLog } from "@redcode/schema/event-log"
import { FileDiff } from "@redcode/schema/file-diff"
import { FileSystem } from "@redcode/schema/filesystem"
import { Form } from "@redcode/schema/form"
import { Generate } from "@redcode/schema/generate"
import { Instruction } from "@redcode/schema/instruction"
import { InstructionEntry } from "@redcode/schema/instruction-entry"
import { Integration } from "@redcode/schema/integration"
import { Job } from "@redcode/schema/job"
import { Location } from "@redcode/schema/location"
import { Mcp } from "@redcode/schema/mcp"
import { Model } from "@redcode/schema/model"
import { Money } from "@redcode/schema/money"
import { Permission } from "@redcode/schema/permission"
import { PermissionSaved } from "@redcode/schema/permission-saved"
import { Plugin } from "@redcode/schema/plugin"
import { Project } from "@redcode/schema/project"
import { Worktree } from "@redcode/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@redcode/schema/prompt"
import { PromptInput } from "@redcode/schema/prompt-input"
import { Provider } from "@redcode/schema/provider"
import { Pty } from "@redcode/schema/pty"
import { PtyTicket } from "@redcode/schema/pty-ticket"
import { Question } from "@redcode/schema/question"
import { Reference } from "@redcode/schema/reference"
import { AbsolutePath, RelativePath } from "@redcode/schema/schema"
import { Schedule } from "@redcode/schema/schedule"
import { Session } from "@redcode/schema/session"
import { SessionMessage } from "@redcode/schema/session-message"
import { SessionInbox } from "@redcode/schema/session-inbox"
import { Shell } from "@redcode/schema/shell"
import { Skill } from "@redcode/schema/skill"
import { Snapshot } from "@redcode/schema/snapshot"
import { UsageLimits } from "@redcode/schema/usage-limits"
import { Vcs } from "@redcode/schema/vcs"
import { WebSearch } from "@redcode/schema/websearch"
import { Workspace } from "@redcode/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: promiseOmitEndpoints,
  namespace: clientNamespace,
  aliases: true,
})
const effectContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: effectOmitEndpoints,
  namespace: clientNamespace,
  aliases: true,
})
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@redcode/schema/agent", Agent),
  ...namespaceTypes("Artifact", "@redcode/schema/artifact", Artifact),
  ...namespaceTypes("Command", "@redcode/schema/command", Command),
  ...namespaceTypes("Config", "@redcode/schema/config", Config),
  ...namespaceTypes("Credential", "@redcode/schema/credential", Credential),
  ...namespaceTypes("Event", "@redcode/schema/event", Event),
  ...namespaceTypes("EventLog", "@redcode/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@redcode/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@redcode/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@redcode/schema/form", Form),
  ...namespaceTypes("Generate", "@redcode/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@redcode/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@redcode/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@redcode/schema/integration", Integration),
  ...namespaceTypes("Job", "@redcode/schema/job", Job),
  typeReference("Location.PublicRef", "@redcode/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@redcode/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@redcode/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@redcode/schema/model", Model),
  ...namespaceTypes("Money", "@redcode/schema/money", Money),
  ...namespaceTypes("Permission", "@redcode/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@redcode/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@redcode/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@redcode/schema/project", Project),
  ...namespaceTypes("Worktree", "@redcode/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@redcode/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@redcode/schema/provider", Provider),
  ...namespaceTypes("Pty", "@redcode/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@redcode/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@redcode/schema/question", Question),
  ...namespaceTypes("Reference", "@redcode/schema/reference", Reference),
  ...namespaceTypes("Schedule", "@redcode/schema/schedule", Schedule),
  ...namespaceTypes("Session", "@redcode/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@redcode/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@redcode/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@redcode/schema/shell", Shell),
  ...namespaceTypes("Skill", "@redcode/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@redcode/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@redcode/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@redcode/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@redcode/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@redcode/schema/workspace", Workspace),
  typeReference("Prompt", "@redcode/schema/prompt", Prompt),
  typeReference("PromptMention", "@redcode/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@redcode/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@redcode/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@redcode/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@redcode/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "RedCodeEvent",
              import: 'import type { RedCodeEvent } from "@redcode/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
