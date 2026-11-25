import path from "node:path"
import { REDCODE_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.REDCODE_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(REDCODE_CHANNEL) ||
    process.env.REDCODE_DISABLE_CHANNEL_DB === "1" ||
    process.env.REDCODE_DISABLE_CHANNEL_DB === "true"
      ? "redcode.db"
      : `redcode-${REDCODE_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
