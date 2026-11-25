export * as Provider from "./provider.js"

import { Context, Effect, Layer, Option, Schema, Stream, Struct } from "effect"
import { Provider } from "@redcode/schema/provider"
import { Model } from "@redcode/schema/model"
import { makeLocationNode } from "@redcode/util/effect/app-node"
import { HttpTimeout, type ProviderPackage } from "@redcode/ai/effect"
import { Npm } from "@redcode/util/npm"
import type { DeepMutable } from "./schema.js"
import { importModule, resolveModule } from "@redcode/util/runtime-import"
import { Bus } from "./bus.js"
import { Integration } from "./integration.js"
import { State } from "./state.js"
import { IntegrationConnection } from "./integration/connection.js"
import { Credential } from "@redcode/schema/credential"
import { Location } from "./location.js"
import { freeze } from "immer"
import { AISDKNative } from "./aisdk-native.js"

export { AISDK_PREFIX, aisdk, isAISDK, mergeHeaders, mergeOverlay, packageName } from "./aisdk-native.js"

export const ID = Provider.ID
export type ID = typeof ID.Type

export class LoadError extends Schema.TaggedError<LoadError>()("Provider.LoadError", {
  package: Schema.String,
  cause: Schema.Defect(),
}) {}

const packages = new Map<string, Promise<unknown>>()
const builtins = new Map<string, () => Promise<unknown>>([
  ["@redcode/ai/providers/alibaba", () => import("@redcode/ai/providers/alibaba")],
  ["@redcode/ai/providers/alibaba/chat", () => import("@redcode/ai/providers/alibaba/chat")],
  ["@redcode/ai/providers/alibaba/messages", () => import("@redcode/ai/providers/alibaba/messages")],
  ["@redcode/ai/providers/alibaba/responses", () => import("@redcode/ai/providers/alibaba/responses")],
  ["@redcode/ai/providers/alibaba/images", () => import("@redcode/ai/providers/alibaba/images")],
  ["@redcode/ai/providers/alibaba/embeddings", () => import("@redcode/ai/providers/alibaba/embeddings")],
  ["@redcode/ai/providers/amazon-bedrock", () => import("@redcode/ai/providers/amazon-bedrock")],
  ["@redcode/ai/providers/amazon-bedrock/mantle", () => import("@redcode/ai/providers/amazon-bedrock/mantle")],
  [
    "@redcode/ai/providers/amazon-bedrock/mantle/chat",
    () => import("@redcode/ai/providers/amazon-bedrock/mantle/chat"),
  ],
  [
    "@redcode/ai/providers/amazon-bedrock/mantle/messages",
    () => import("@redcode/ai/providers/amazon-bedrock/mantle/messages"),
  ],
  [
    "@redcode/ai/providers/amazon-bedrock/mantle/responses",
    () => import("@redcode/ai/providers/amazon-bedrock/mantle/responses"),
  ],
  ["@redcode/ai/providers/anthropic", () => import("@redcode/ai/providers/anthropic")],
  ["@redcode/ai/providers/anthropic-compatible", () => import("@redcode/ai/providers/anthropic-compatible")],
  ["@redcode/ai/providers/azure", () => import("@redcode/ai/providers/azure")],
  ["@redcode/ai/providers/azure/chat", () => import("@redcode/ai/providers/azure/chat")],
  ["@redcode/ai/providers/azure/responses", () => import("@redcode/ai/providers/azure/responses")],
  ["@redcode/ai/providers/azure/images", () => import("@redcode/ai/providers/azure/images")],
  ["@redcode/ai/providers/azure/embeddings", () => import("@redcode/ai/providers/azure/embeddings")],
  ["@redcode/ai/providers/azure/messages", () => import("@redcode/ai/providers/azure/messages")],
  ["@redcode/ai/providers/baseten", () => import("@redcode/ai/providers/baseten")],
  ["@redcode/ai/providers/baseten/decisions", () => import("@redcode/ai/providers/baseten/decisions")],
  ["@redcode/ai/providers/byteplus/videos", () => import("@redcode/ai/providers/byteplus/videos")],
  ["@redcode/ai/providers/cerebras", () => import("@redcode/ai/providers/cerebras")],
  ["@redcode/ai/providers/cloudflare-ai-gateway", () => import("@redcode/ai/providers/cloudflare-ai-gateway")],
  [
    "@redcode/ai/providers/cloudflare-ai-gateway/decisions",
    () => import("@redcode/ai/providers/cloudflare-ai-gateway/decisions"),
  ],
  ["@redcode/ai/providers/cloudflare-workers-ai", () => import("@redcode/ai/providers/cloudflare-workers-ai")],
  [
    "@redcode/ai/providers/cloudflare-workers-ai/decisions",
    () => import("@redcode/ai/providers/cloudflare-workers-ai/decisions"),
  ],
  [
    "@redcode/ai/providers/cloudflare-workers-ai/images",
    () => import("@redcode/ai/providers/cloudflare-workers-ai/images"),
  ],
  ["@redcode/ai/providers/cohere", () => import("@redcode/ai/providers/cohere")],
  ["@redcode/ai/providers/cohere/chat", () => import("@redcode/ai/providers/cohere/chat")],
  ["@redcode/ai/providers/cohere/embeddings", () => import("@redcode/ai/providers/cohere/embeddings")],
  ["@redcode/ai/providers/deepinfra", () => import("@redcode/ai/providers/deepinfra")],
  ["@redcode/ai/providers/deepinfra/embeddings", () => import("@redcode/ai/providers/deepinfra/embeddings")],
  ["@redcode/ai/providers/deepseek", () => import("@redcode/ai/providers/deepseek")],
  ["@redcode/ai/providers/digitalocean", () => import("@redcode/ai/providers/digitalocean")],
  ["@redcode/ai/providers/digitalocean/decisions", () => import("@redcode/ai/providers/digitalocean/decisions")],
  ["@redcode/ai/providers/digitalocean/embeddings", () => import("@redcode/ai/providers/digitalocean/embeddings")],
  ["@redcode/ai/providers/digitalocean/images", () => import("@redcode/ai/providers/digitalocean/images")],
  ["@redcode/ai/providers/digitalocean/responses", () => import("@redcode/ai/providers/digitalocean/responses")],
  ["@redcode/ai/providers/fireworks", () => import("@redcode/ai/providers/fireworks")],
  ["@redcode/ai/providers/fireworks/embeddings", () => import("@redcode/ai/providers/fireworks/embeddings")],
  ["@redcode/ai/providers/google", () => import("@redcode/ai/providers/google")],
  ["@redcode/ai/providers/google/decisions", () => import("@redcode/ai/providers/google/decisions")],
  ["@redcode/ai/providers/google/interactions", () => import("@redcode/ai/providers/google/interactions")],
  ["@redcode/ai/providers/google/embeddings", () => import("@redcode/ai/providers/google/embeddings")],
  ["@redcode/ai/providers/google/images", () => import("@redcode/ai/providers/google/images")],
  ["@redcode/ai/providers/google/videos", () => import("@redcode/ai/providers/google/videos")],
  ["@redcode/ai/providers/google-vertex", () => import("@redcode/ai/providers/google-vertex")],
  ["@redcode/ai/providers/google-vertex/chat", () => import("@redcode/ai/providers/google-vertex/chat")],
  ["@redcode/ai/providers/google-vertex/gemini", () => import("@redcode/ai/providers/google-vertex/gemini")],
  [
    "@redcode/ai/providers/google-vertex/interactions",
    () => import("@redcode/ai/providers/google-vertex/interactions"),
  ],
  ["@redcode/ai/providers/google-vertex/messages", () => import("@redcode/ai/providers/google-vertex/messages")],
  ["@redcode/ai/providers/google-vertex/mistral", () => import("@redcode/ai/providers/google-vertex/mistral")],
  ["@redcode/ai/providers/google-vertex/responses", () => import("@redcode/ai/providers/google-vertex/responses")],
  ["@redcode/ai/providers/google-vertex/embeddings", () => import("@redcode/ai/providers/google-vertex/embeddings")],
  ["@redcode/ai/providers/google-vertex/images", () => import("@redcode/ai/providers/google-vertex/images")],
  ["@redcode/ai/providers/google-vertex-messages", () => import("@redcode/ai/providers/google-vertex-messages")],
  ["@redcode/ai/providers/groq", () => import("@redcode/ai/providers/groq")],
  ["@redcode/ai/providers/meta", () => import("@redcode/ai/providers/meta")],
  ["@redcode/ai/providers/meta/chat", () => import("@redcode/ai/providers/meta/chat")],
  ["@redcode/ai/providers/meta/images", () => import("@redcode/ai/providers/meta/images")],
  ["@redcode/ai/providers/meta/messages", () => import("@redcode/ai/providers/meta/messages")],
  ["@redcode/ai/providers/meta/responses", () => import("@redcode/ai/providers/meta/responses")],
  ["@redcode/ai/providers/minimax", () => import("@redcode/ai/providers/minimax")],
  ["@redcode/ai/providers/minimax/chat", () => import("@redcode/ai/providers/minimax/chat")],
  ["@redcode/ai/providers/minimax/images", () => import("@redcode/ai/providers/minimax/images")],
  ["@redcode/ai/providers/minimax/messages", () => import("@redcode/ai/providers/minimax/messages")],
  ["@redcode/ai/providers/minimax/responses", () => import("@redcode/ai/providers/minimax/responses")],
  ["@redcode/ai/providers/minimax/videos", () => import("@redcode/ai/providers/minimax/videos")],
  ["@redcode/ai/providers/mistral", () => import("@redcode/ai/providers/mistral")],
  ["@redcode/ai/providers/moonshot", () => import("@redcode/ai/providers/moonshot")],
  ["@redcode/ai/providers/moonshot/chat", () => import("@redcode/ai/providers/moonshot/chat")],
  ["@redcode/ai/providers/moonshot/messages", () => import("@redcode/ai/providers/moonshot/messages")],
  ["@redcode/ai/providers/moonshot/responses", () => import("@redcode/ai/providers/moonshot/responses")],
  ["@redcode/ai/providers/openai", () => import("@redcode/ai/providers/openai")],
  ["@redcode/ai/providers/openai/chat", () => import("@redcode/ai/providers/openai/chat")],
  ["@redcode/ai/providers/openai/responses", () => import("@redcode/ai/providers/openai/responses")],
  ["@redcode/ai/providers/openai/images", () => import("@redcode/ai/providers/openai/images")],
  ["@redcode/ai/providers/openai/embeddings", () => import("@redcode/ai/providers/openai/embeddings")],
  ["@redcode/ai/providers/openai-compatible", () => import("@redcode/ai/providers/openai-compatible")],
  [
    "@redcode/ai/providers/openai-compatible/responses",
    () => import("@redcode/ai/providers/openai-compatible/responses"),
  ],
  ["@redcode/ai/providers/openai-compatible/images", () => import("@redcode/ai/providers/openai-compatible/images")],
  [
    "@redcode/ai/providers/openai-compatible/decisions",
    () => import("@redcode/ai/providers/openai-compatible/decisions"),
  ],
  [
    "@redcode/ai/providers/openai-compatible/embeddings",
    () => import("@redcode/ai/providers/openai-compatible/embeddings"),
  ],
  [
    "@redcode/ai/providers/openai-compatible-responses",
    () => import("@redcode/ai/providers/openai-compatible-responses"),
  ],
  ["@redcode/ai/providers/opencode/decisions", () => import("@redcode/ai/providers/opencode/decisions")],
  ["@redcode/ai/providers/openrouter", () => import("@redcode/ai/providers/openrouter")],
  ["@redcode/ai/providers/openrouter/decisions", () => import("@redcode/ai/providers/openrouter/decisions")],
  ["@redcode/ai/providers/openrouter/embeddings", () => import("@redcode/ai/providers/openrouter/embeddings")],
  ["@redcode/ai/providers/openrouter/images", () => import("@redcode/ai/providers/openrouter/images")],
  ["@redcode/ai/providers/openrouter/videos", () => import("@redcode/ai/providers/openrouter/videos")],
  ["@redcode/ai/providers/openrouter/responses", () => import("@redcode/ai/providers/openrouter/responses")],
  ["@redcode/ai/providers/togetherai", () => import("@redcode/ai/providers/togetherai")],
  ["@redcode/ai/providers/typesafe-ai/decisions", () => import("@redcode/ai/providers/typesafe-ai/decisions")],
  ["@redcode/ai/providers/venice", () => import("@redcode/ai/providers/venice")],
  ["@redcode/ai/providers/venice/responses", () => import("@redcode/ai/providers/venice/responses")],
  ["@redcode/ai/providers/volcengine/videos", () => import("@redcode/ai/providers/volcengine/videos")],
  ["@redcode/ai/providers/vercel-ai-gateway", () => import("@redcode/ai/providers/vercel-ai-gateway")],
  ["@redcode/ai/providers/vercel-ai-gateway/chat", () => import("@redcode/ai/providers/vercel-ai-gateway/chat")],
  [
    "@redcode/ai/providers/vercel-ai-gateway/messages",
    () => import("@redcode/ai/providers/vercel-ai-gateway/messages"),
  ],
  [
    "@redcode/ai/providers/vercel-ai-gateway/responses",
    () => import("@redcode/ai/providers/vercel-ai-gateway/responses"),
  ],
  [
    "@redcode/ai/providers/vercel-ai-gateway/decisions",
    () => import("@redcode/ai/providers/vercel-ai-gateway/decisions"),
  ],
  ["@redcode/ai/providers/vercel-ai-gateway/images", () => import("@redcode/ai/providers/vercel-ai-gateway/images")],
  [
    "@redcode/ai/providers/vercel-ai-gateway/embeddings",
    () => import("@redcode/ai/providers/vercel-ai-gateway/embeddings"),
  ],
  ["@redcode/ai/providers/xai", () => import("@redcode/ai/providers/xai")],
  ["@redcode/ai/providers/xai/images", () => import("@redcode/ai/providers/xai/images")],
  ["@redcode/ai/providers/zai", () => import("@redcode/ai/providers/zai")],
  ["@redcode/ai/providers/zai/chat", () => import("@redcode/ai/providers/zai/chat")],
  ["@redcode/ai/providers/zai/images", () => import("@redcode/ai/providers/zai/images")],
  ["@redcode/ai/providers/zai-coding-plan", () => import("@redcode/ai/providers/zai-coding-plan")],
  ["@redcode/ai/providers/zai-coding-plan/chat", () => import("@redcode/ai/providers/zai-coding-plan/chat")],
  ["@redcode/ai/providers/zai-coding-plan/messages", () => import("@redcode/ai/providers/zai-coding-plan/messages")],
  [
    "@redcode/ai/providers/zai-coding-plan/responses",
    () => import("@redcode/ai/providers/zai-coding-plan/responses"),
  ],
])

/** Native `@redcode/ai/providers/*` entrypoints bundled with Core and loadable by name from config. */
export const builtinPackages: ReadonlySet<string> = new Set(builtins.keys())

export const loadPackage = Effect.fn("Provider.loadPackage")(function* (input: string, npm?: Npm.Interface) {
  const specifier = AISDKNative.packageName(input)
  const builtin = builtins.get(specifier)
  if (builtin) return yield* importPackage(specifier, specifier, builtin)
  const resolved = yield* Effect.sync(() => {
    if (specifier.startsWith("file://") || specifier.startsWith("@redcode/ai/")) return specifier
    try {
      return import.meta.resolve(specifier)
    } catch {
      return undefined
    }
  })
  if (resolved) return yield* importPackage(specifier, resolved)
  if (!npm) {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} is not installed`),
    })
  }
  const parts = specifier.split("/")
  const root = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? specifier)
  const installed = yield* npm.add(root).pipe(Effect.mapError((cause) => new LoadError({ package: specifier, cause })))
  const entrypoint = yield* Effect.try({
    try: () => resolveModule(specifier, installed.directory),
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  return yield* importPackage(specifier, entrypoint)
})

const settingsKeys = Struct.keys(Provider.Settings.schema.fields)
const providerOnlyKeys = settingsKeys.filter((key) => !(key in Model.Settings.schema.fields))

/** The provider options: every settings key RedCode doesn't read itself. */
export function nativeSettings(settings: Settings) {
  return Struct.omit(settings, settingsKeys)
}

/** Settings a model inherits from its provider. */
export function modelSettings(settings: Settings | undefined) {
  return settings && Struct.omit(settings, providerOnlyKeys)
}

const decodeTimeout = Schema.decodeUnknownOption(HttpTimeout)

/** Applied to `headerTimeout` when provider settings leave it unset or invalid. */
export const DEFAULT_TIMEOUT_MS = 300_000

/**
 * Applied to `chunkTimeout` when provider settings leave it unset or invalid. Some providers, such as DeepSeek, have
 * specifically asked clients to allow at least 15 minutes, because their models can stream nothing for minutes while
 * they reason.
 */
export const DEFAULT_CHUNK_TIMEOUT_MS = 900_000

/** One timeout setting without a default; invalid values are dropped. */
export function timeout(value: unknown) {
  return Option.getOrUndefined(decodeTimeout(value))
}

/** Request timeouts from provider settings, resolved for every route. `timeout` has no default. */
export function timeouts(settings: Readonly<Record<string, unknown>>) {
  return {
    timeout: timeout(settings.timeout),
    headerTimeout: timeout(settings.headerTimeout) ?? DEFAULT_TIMEOUT_MS,
    chunkTimeout: timeout(settings.chunkTimeout) ?? DEFAULT_CHUNK_TIMEOUT_MS,
  }
}

const decodeEncoding = Schema.decodeUnknownOption(Provider.Encoding)

/** Request body encoding from provider or model settings; invalid values are dropped. */
export function encoding(settings: Readonly<Record<string, unknown>>) {
  return Option.getOrUndefined(decodeEncoding(settings.encoding))
}

const decodeTls = Schema.decodeUnknownOption(Provider.Tls)

/** Client certificate from provider settings. An empty `cert` or `key`, such as a missing `{file:}`, leaves it unset. */
export function tls(settings: Readonly<Record<string, unknown>>) {
  const value = Option.getOrUndefined(decodeTls(settings.tls))
  return value?.cert && value.key ? value : undefined
}

export const Request = Provider.Request
export type Request = Provider.Request

export const Compaction = Provider.Compaction
export type Compaction = Provider.Compaction

export const Cache = Provider.Cache
export type Cache = Provider.Cache

export const Transport = Provider.Transport
export type Transport = Provider.Transport

export const Settings = Provider.Settings
export type Settings = Provider.Settings

export const Info = Provider.Info
export type Info = Provider.Info

export type MutableInfo = DeepMutable<Info>

export { Event } from "@redcode/schema/provider"

/** Provider metadata owns its drafts; model definitions remain immutable inputs. */
export type Definition = {
  readonly provider: Info
  readonly models: ReadonlyMap<Model.ID, Model.Info>
  readonly sourceConnection?: IntegrationConnection.Info
}

export interface Editor {
  readonly list: () => readonly Definition[]
  readonly get: (providerID: ID) => Definition | undefined
  readonly add: (definition: {
    readonly info: Info
    readonly models: readonly Model.Info[]
    readonly sourceConnection?: IntegrationConnection.Info
  }) => void
  readonly update: (providerID: ID, update: (provider: MutableInfo) => void) => void
  readonly remove: (providerID: ID) => void
  readonly models: {
    readonly set: (providerID: ID, models: readonly Model.Info[]) => void
    readonly update: (providerID: ID, modelID: Model.ID, update: (model: DeepMutable<Model.Info>) => void) => void
    readonly remove: (providerID: ID, modelID: Model.ID) => void
  }
}

export interface Snapshot {
  readonly records: ReadonlyMap<ID, Definition>
  readonly available: readonly Definition[]
  readonly providers: readonly Info[]
}

export interface Interface extends State.Transformable<Editor> {
  readonly get: (providerID: ID) => Effect.Effect<Info | undefined>
  readonly all: () => Effect.Effect<readonly Info[]>
  readonly available: () => Effect.Effect<readonly Info[]>
  /** Internal definition/access snapshot; raw model inventories never cross the HTTP API. */
  readonly snapshot: () => Effect.Effect<Snapshot>
}

export class Service extends Context.Service<Service, Interface>()("@redcode/Provider") {}

// Every location references the same index for a shared immutable definition array.
const definitions = new WeakMap<readonly Model.Info[], Map<ID, ReadonlyMap<Model.ID, Model.Info>>>()
function index(providerID: ID, models: readonly Model.Info[]) {
  const indexes = definitions.get(models) ?? new Map<ID, ReadonlyMap<Model.ID, Model.Info>>()
  const cached = indexes.get(providerID)
  if (cached) return cached
  // Model shares these definitions without copying, so a foreign definition takes this provider's identity here.
  const result = freeze(
    new Map(models.map((model) => [model.id, model.providerID === providerID ? model : { ...model, providerID }])),
    true,
  )
  indexes.set(providerID, result)
  definitions.set(models, indexes)
  return result
}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const bus = yield* Bus.Service
    const integrations = yield* Integration.Service
    const location = yield* Location.Service
    const state = State.create<
      Map<
        ID,
        {
          provider: MutableInfo
          models: ReadonlyMap<Model.ID, Model.Info>
          sourceConnection?: IntegrationConnection.Info
        }
      >,
      Editor
    >({
      name: "provider",
      initial: () => new Map(),
      editor: (records) => {
        const maps = new WeakSet<ReadonlyMap<Model.ID, Model.Info>>()
        const models = new WeakSet<Model.Info>()
        const entry = (id: ID) => {
          const current = records.get(id)
          if (current) return current
          const added = { provider: Info.empty(id) as MutableInfo, models: new Map<Model.ID, Model.Info>() }
          records.set(id, added)
          maps.add(added.models)
          return added
        }
        const writable = (id: ID) => {
          const record = entry(id)
          if (maps.has(record.models)) return record.models as Map<Model.ID, Model.Info>
          const owned = new Map(record.models)
          record.models = owned
          maps.add(owned)
          return owned
        }
        return {
          list: () => Array.from(records.values()),
          get: (id) => records.get(id),
          add: (definition) => {
            records.set(definition.info.id, {
              provider: structuredClone(definition.info) as MutableInfo,
              models: index(definition.info.id, definition.models),
              sourceConnection: definition.sourceConnection,
            })
          },
          update: (id, update) => {
            const record = entry(id)
            update(record.provider)
            record.provider.id = id
            AISDKNative.rewrite(record.provider, {
              builtins: builtinPackages,
              specifier: record.provider.package,
              providerID: id,
              canonical: record.provider.canonical,
            })
          },
          remove: (id) => {
            records.delete(id)
          },
          models: {
            set: (id, values) => {
              entry(id).models = index(id, values)
            },
            update: (providerID, modelID, update) => {
              const record = entry(providerID)
              const target = writable(providerID)
              const current = target.get(modelID)
              const model = // An earlier add/set can publish and freeze an owned model within this fold.
                (
                  current && models.has(current) && !Object.isFrozen(current)
                    ? current
                    : current
                      ? structuredClone(current)
                      : Model.Info.default(providerID, modelID)
                ) as DeepMutable<Model.Info>
              update(model)
              model.id = modelID
              model.providerID = providerID
              AISDKNative.rewrite(model, {
                builtins: builtinPackages,
                specifier: model.package ?? record.provider.package,
                providerID,
                canonical: model.canonical ?? record.provider.canonical,
                modelID: model.modelID ?? modelID,
              })
              models.add(model)
              target.set(modelID, model)
            },
            remove: (providerID, modelID) => {
              if (!records.has(providerID)) return
              writable(providerID).delete(modelID)
            },
          },
        }
      },
      notify: () => notify,
    })
    // Registrations may outlive a borrowed service layer; their later disposal must
    // not query dependencies that have already closed.
    yield* Effect.addFinalizer(() => State.shutdown(state.reload()))
    let cached: { records: Snapshot["records"]; value: Snapshot } | undefined
    const snapshot = Effect.fn("Provider.snapshot")(function* () {
      while (true) {
        const revision = integrations.revision()
        const records = state.get()
        // Connection presence decides availability; resolving OAuth tokens belongs to execution.
        const connections = yield* integrations.list()
        // Either fold can disable a plugin that also contributed to the other domain.
        if (revision !== integrations.revision() || records !== state.get()) continue
        const byID = new Map(connections.map((integration) => [integration.id, integration]))
        const available = Array.from(records.values()).filter((record) => {
          if (record.provider.activation === "disabled") return false
          const integration = byID.get(record.provider.integrationID ?? Integration.ID.make(record.provider.id))
          // Never combine the previous account's discovered endpoints/models with a new connection.
          if (
            record.sourceConnection &&
            IntegrationConnection.key(record.sourceConnection) !==
              IntegrationConnection.key(integration?.connections[0])
          )
            return false
          if (record.provider.activation === "enabled") return true
          if (integration?.connections.length) return true
          return record.provider.integrationID === undefined && !integration
        })
        // A credential change that leaves the same definitions available is not a catalog change.
        if (
          cached?.records === records &&
          cached.value.available.length === available.length &&
          cached.value.available.every((record, index) => record === available[index])
        )
          return cached.value
        const value = freeze({ records, available, providers: available.map((record) => record.provider) }, true)
        cached = { records, value }
        return value
      }
    })
    let published: Snapshot | undefined
    const notify: Effect.Effect<void> = Effect.gen(function* () {
      const value = yield* snapshot()
      if (value === published) return
      published = value
      yield* bus.publish(
        Provider.Event.Updated,
        {},
        {
          location: { directory: location.directory, workspaceID: location.workspaceID },
        },
      )
    })
    yield* bus.subscribe([Integration.Event.Updated, Credential.Event.Switched]).pipe(
      Stream.runForEach(() => notify),
      Effect.forkScoped({ startImmediately: true }),
    )
    return Service.of({
      transform: state.transform,
      reload: state.reload,
      get: Effect.fn("Provider.get")((id) => Effect.sync(() => freeze(state.get().get(id)?.provider, true))),
      all: Effect.fn("Provider.all")(() =>
        Effect.sync(() => Array.from(state.get().values(), (record) => freeze(record.provider, true))),
      ),
      available: Effect.fn("Provider.available")(() => snapshot().pipe(Effect.map((value) => value.providers))),
      snapshot,
    })
  }),
)

export const node = makeLocationNode({ service: Service, layer, deps: [Bus.node, Integration.node, Location.node] })

const importPackage = Effect.fn("Provider.importPackage")(function* (
  specifier: string,
  entrypoint: string,
  load = () => importModule(entrypoint),
) {
  const module = yield* Effect.tryPromise({
    try: () => {
      const existing = packages.get(entrypoint)
      if (existing) return existing
      const loaded = load()
      packages.set(entrypoint, loaded)
      return loaded
    },
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  if (typeof module !== "object" || module === null || typeof (module as { model?: unknown }).model !== "function") {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} does not export model(modelID, settings)`),
    })
  }
  return module as ProviderPackage.Definition
})
