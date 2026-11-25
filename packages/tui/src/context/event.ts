import type { RedCodeEvent } from "@redcode/client"
import { useClient } from "./client"

type EventMetadata = {
  directory: string | undefined
}
type RedCodeEventMap = { [Type in RedCodeEvent["type"]]: Extract<RedCodeEvent, { type: Type }> }

export function useEvent() {
  const client = useClient()

  function subscribe(handler: (event: RedCodeEvent, metadata: EventMetadata) => void) {
    return client.event.listen(({ details }) => {
      if (details.type === "server.connected") return
      handler(details, { directory: details.location?.directory })
    })
  }

  function on<T extends RedCodeEvent["type"]>(
    type: T,
    handler: (event: RedCodeEventMap[T], metadata: EventMetadata) => void,
  ) {
    return client.event.on(type, (event) => {
      handler(event, { directory: event.location?.directory })
    })
  }

  return {
    subscribe,
    on,
  }
}
