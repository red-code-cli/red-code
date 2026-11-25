import { Plugin } from "@redcode/plugin/tui"
import { createMermaidCodeBlockRenderer } from "./markdown.js"
import { resolveRedCodeDiagramPalette } from "./palette.js"

export default Plugin.define({
  id: "opencode.merman",
  setup(context) {
    context.markdown.registerCodeBlockRenderer(
      "mermaid",
      createMermaidCodeBlockRenderer(context.renderer, () => ({
        colors: resolveRedCodeDiagramPalette(context.theme, context.themeMode),
      })),
    )
  },
})
