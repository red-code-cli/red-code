import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.REDCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.REDCODE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "RedCode Dev",
  beta: "RedCode Beta",
  prod: "RedCode",
}

const appIDs: Record<string, string> = {
  dev: "ai.redcode.desktop.dev",
  beta: "ai.redcode.desktop.beta",
  prod: "ai.redcode.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "RedCode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.redcode.desktop.dev"
