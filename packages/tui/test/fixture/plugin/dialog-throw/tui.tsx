import { Plugin } from "@redcode/plugin/tui"

// A dialog that throws while rendering (Vempire-X/RedCode#61101).
export default Plugin.define({
  id: "fixture.dialog-throw",
  setup(context) {
    context.ui.dialog.show(() => {
      throw new Error("dialog exploded")
    })
  },
})
