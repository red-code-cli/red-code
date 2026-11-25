import { EOL } from "os"
import { Effect } from "effect"
import { RedCode } from "@redcode/client"
import { Commands } from "../../commands"
import { Runtime } from "../../../framework/runtime"
import { Service } from "@redcode/client/effect/service"
import { ServerConnection } from "../../../services/server-connection"
import { waitForPlugins } from "../../../services/plugin-startup"

export default Runtime.handler(
  Commands.commands.debug.commands.agents,
  Effect.fn("cli.debug.agents")(function* () {
    const { endpoint } = yield* ServerConnection.resolve()
    const client = RedCode.make({ baseUrl: endpoint.url, headers: Service.headers(endpoint) })
    yield* waitForPlugins(client, process.cwd())
    const response = yield* Effect.promise(() => client.agent.list({ location: { directory: process.cwd() } }))
    process.stdout.write(
      JSON.stringify(
        response.data.toSorted((a, b) => a.id.localeCompare(b.id)),
        null,
        2,
      ) + EOL,
    )
  }),
)
