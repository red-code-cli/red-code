import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.REDCODE_PASSWORD
  const previousLegacyPassword = process.env.REDCODE_SERVER_PASSWORD
  const previousValue = process.env.REDCODE_SESSION_ENV_TEST
  process.env.REDCODE_PASSWORD = "password"
  process.env.REDCODE_SERVER_PASSWORD = "legacy"
  process.env.REDCODE_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.REDCODE_PASSWORD
  else process.env.REDCODE_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.REDCODE_SERVER_PASSWORD
  else process.env.REDCODE_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.REDCODE_SESSION_ENV_TEST
  else process.env.REDCODE_SESSION_ENV_TEST = previousValue

  expect(environment.REDCODE_PASSWORD).toBeUndefined()
  expect(environment.REDCODE_SERVER_PASSWORD).toBeUndefined()
  expect(environment.REDCODE_SESSION_ENV_TEST).toBe("included")
})
