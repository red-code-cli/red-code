import { Option, Schema } from "effect"

declare const REDCODE_VERSION: string
declare const REDCODE_CHANNEL: string
declare const REDCODE_ARTIFACT: string
declare const REDCODE_RELEASE_HIGHLIGHTS: string

const version = typeof REDCODE_VERSION === "string" ? REDCODE_VERSION : "local"
const channel = typeof REDCODE_CHANNEL === "string" ? REDCODE_CHANNEL : "local"
const artifact = typeof REDCODE_ARTIFACT === "string" ? REDCODE_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof REDCODE_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(REDCODE_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as REDCODE_VERSION,
  channel as REDCODE_CHANNEL,
  artifact as REDCODE_ARTIFACT,
  highlights as REDCODE_HIGHLIGHTS,
}
export const REDCODE_LOCAL = channel === "local"
