import type { ElectronNative } from "../preload/types"

declare global {
  interface ImportMetaEnv {
    readonly REDCODE_TEST_ONBOARDING: boolean
  }

  interface Window {
    electron: ElectronNative
    __REDCODE__?: {
      deepLinks?: string[]
    }
  }
}
