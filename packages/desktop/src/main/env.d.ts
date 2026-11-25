interface ImportMetaEnv {
  readonly REDCODE_CHANNEL: string
  readonly REDCODE_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
