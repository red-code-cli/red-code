export * as RedCodeWorkerd from "./workerd"

import { Layer } from "effect"
import type { Config, Scope } from "effect"
import { WorkerdProfile } from "../internal/workerd"
import { RedCode } from "./opencode"

export type Configuration = WorkerdProfile.Configuration

export interface CreateOptions<R = never> extends WorkerdProfile.Options {
  readonly log?: RedCode.CreateOptions["log"]
  readonly plugins?: RedCode.CreateOptions["plugins"]
  readonly workspaceProviders?: RedCode.CreateOptions["workspaceProviders"]
  readonly instances?: RedCode.CreateOptions<R>["instances"]
}

export const create = <R = never>({ log, plugins, workspaceProviders, instances, ...options }: CreateOptions<R>) => {
  const profile = WorkerdProfile.make(options)
  return RedCode.create(
    { ...profile.options, log, plugins, workspaceProviders, instances },
    { overrides: profile.replacements },
  )
}

export const layer = <R = never>(
  options: CreateOptions<R>,
): Layer.Layer<RedCode.Service, Config.ConfigError | Error, Exclude<R, Scope.Scope>> =>
  Layer.effect(RedCode.Service, create(options))

export type Interface = RedCode.Interface
export type Requirements = Scope.Scope
