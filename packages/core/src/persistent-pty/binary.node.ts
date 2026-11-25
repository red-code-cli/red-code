export const available = true

export async function resolveBinary() {
  return process.env.REDCODE_PTY_BIN || "opencode-pty"
}
