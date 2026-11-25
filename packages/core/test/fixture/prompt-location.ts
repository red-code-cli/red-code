import type { FileSystem } from "@redcode/core/filesystem"
import { Bus } from "@redcode/core/bus"
import { Image } from "@redcode/core/image"
import { LocationServiceMap } from "@redcode/core/location-service-map"
import type { LocationServices } from "@redcode/core/location-services"
import { Plugin } from "@redcode/core/plugin"
import { PluginHooks } from "@redcode/core/plugin/hooks"
import { Skill } from "@redcode/core/skill"
import type { Location } from "@redcode/schema/location"
import { makeGlobalNode } from "@redcode/util/effect/app-node"
import { LayerNode } from "@redcode/util/effect/layer-node"
import { Effect, Layer, LayerMap } from "effect"

// Plain-prompt unit fixtures use virtual directories.
export const promptLocationNode = makeGlobalNode({
  service: LocationServiceMap.Service,
  layer: Layer.effect(
    LocationServiceMap.Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      return yield* LayerMap.make(
        (_ref: Location.Ref) =>
          LayerNode.compile(LayerNode.group([PluginHooks.node, Image.node, Skill.node, Plugin.node]), {
            replacements: [
              Bus.node.replace(Layer.succeed(Bus.Service, bus)),
              Plugin.node.replace(Layer.mock(Plugin.Service, { awaitActivation: Effect.void })),
            ],
          }) as unknown as Layer.Layer<LocationServices, FileSystem.DirectoryNotFoundError>,
      )
    }),
  ),
  deps: [Bus.node],
})
