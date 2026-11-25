import { Agent } from "@redcode/core/agent"
import { App } from "@redcode/core/app"
import { Artifact } from "@redcode/core/artifact"
import { AISDK } from "@redcode/core/aisdk"
import { Command } from "@redcode/core/command"
import { Config } from "@redcode/core/config"
import { Credential } from "@redcode/core/credential"
import { Database } from "@redcode/core/database/database"
import { Environment } from "@redcode/core/environment/index"
import { FileAccess } from "@redcode/core/file-access"
import { Flag } from "@redcode/core/flag"
import { LayerNodePlatform } from "@redcode/util/effect/app-node-platform"
import { AppProcess } from "@redcode/util/process"
import { LayerNode } from "@redcode/util/effect/layer-node"
import { Bus } from "@redcode/core/bus"
import { FileSystem } from "@redcode/core/filesystem"
import { FSUtil } from "@redcode/util/fs-util"
import { Global } from "@redcode/util/global"
import { Form } from "@redcode/core/form"
import { Generate } from "@redcode/core/generate"
import { InstructionDiscovery } from "@redcode/core/instruction-discovery"
import { Integration } from "@redcode/core/integration"
import { Job } from "@redcode/core/job"
import { KV } from "@redcode/core/kv"
import { Location } from "@redcode/core/location"
import { Mcp } from "@redcode/core/mcp/index"
import { Model } from "@redcode/core/model"
import { Npm } from "@redcode/util/npm"
import { Plugin } from "@redcode/core/plugin"
import { PluginHooks } from "@redcode/core/plugin/hooks"
import { Provider } from "@redcode/core/provider"
import { Session } from "@redcode/core/session"
import { SharedCache } from "@redcode/core/shared-cache"
import { InstructionEntry } from "@redcode/core/session/instruction-entry"
import { PersistentPty } from "@redcode/core/persistent-pty"
import { LocationServiceMap } from "@redcode/core/location-service-map"
import { AppNodeBuilder } from "@redcode/core/effect/app-node-builder"
import { Permission } from "@redcode/core/permission"
import { Reference } from "@redcode/core/reference"
import { Rpc } from "@redcode/core/rpc"
import { Skill } from "@redcode/core/skill"
import { SkillDiscovery } from "@redcode/core/skill/discovery"
import { Watcher } from "@redcode/core/filesystem/watcher"
import { Tool } from "@redcode/core/tool"
import { Vcs } from "@redcode/core/vcs"
import { WebSearch } from "@redcode/core/websearch"
import { Worktree } from "@redcode/core/worktree"
import { WorktreeStrategies } from "@redcode/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"
import { offlineModels } from "../fixture/models"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    allows: () => Effect.succeed(false),
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer, generate = generateLayer) =>
  AppNodeBuilder.build(
    LayerNode.group([
      App.node,
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Flag.node,
      Database.node,
      Environment.node,
      FileAccess.node,
      Global.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      Artifact.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      InstructionDiscovery.node,
      Integration.node,
      Job.node,
      KV.node,
      Mcp.node,
      Session.node,
      SharedCache.node,
      InstructionEntry.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generate),
      Permission.node.replace(permission),
      offlineModels,
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
