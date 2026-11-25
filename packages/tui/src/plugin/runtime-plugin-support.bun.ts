import { ensurePluginRuntime, provides } from "@redcode/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@redcode/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@redcode/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
