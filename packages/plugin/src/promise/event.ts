import type { RedCodeEvent } from "@redcode/client"
import type { SelectedEvent, SubscribeOptions } from "@redcode/client/promise/api"

type EventType = Exclude<RedCodeEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<RedCodeEvent, Type>>
}
