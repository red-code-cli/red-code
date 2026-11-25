import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@redcode/theme/tui"
import { getRedCodeTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getRedCodeTheme(), "light")
  const dark = selectTheme(getRedCodeTheme(), "dark")
  expect(selectTheme(getRedCodeTheme())).toEqual(light)
  expect(light.hue).toEqual(getRedCodeTheme().light.hue)
  expect(dark.text).toEqual(getRedCodeTheme().base.text)
  expect(dark.hue).toEqual(getRedCodeTheme().dark.hue)
  expect(selectThemeMode(getRedCodeTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getRedCodeTheme().base, light: getRedCodeTheme().light } as const
  const darkOnly = { base: getRedCodeTheme().base, dark: getRedCodeTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getRedCodeTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getRedCodeTheme(), "dark"), mode: "dark" })
})
