export interface PaystackConfig {
  apiKey: string
  baseUrl: string
  maxRetries: number
}

export interface LoadConfigOptions {
  envFilePath?: string
  envPrefix?: string
  overrides?: Partial<PaystackConfig>
}

type EnvRecord = Record<string, string | undefined>

function readEnvFromRuntime(): EnvRecord {
  const bunEnv = (globalThis as any).Bun?.env as EnvRecord | undefined

  if (bunEnv) {
    return bunEnv
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env as EnvRecord
  }

  return {}
}

async function readEnvFile(path: string): Promise<EnvRecord> {
  let content: string | undefined

  const bunFile = (globalThis as any).Bun?.file

  if (typeof bunFile === "function") {
    try {
      const file = bunFile(path)
      content = await file.text()
    } catch {
      content = undefined
    }
  } else {
    try {
      const fs = await import("node:fs/promises")
      content = await fs.readFile(path, "utf8")
    } catch {
      content = undefined
    }
  }

  if (!content) {
    return {}
  }

  const result: EnvRecord = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const index = trimmed.indexOf("=")

    if (index === -1) {
      continue
    }

    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    result[key] = value
  }

  return result
}

export async function loadPaystackConfig(options: LoadConfigOptions = {}): Promise<PaystackConfig> {
  const prefix = options.envPrefix ?? ""
  const runtimeEnv = readEnvFromRuntime()
  const fileEnv = options.envFilePath ? await readEnvFile(options.envFilePath) : {}

  const getEnv = (key: string): string | undefined => {
    const fullKey = `${prefix}${key}`

    if (fullKey in fileEnv) {
      return fileEnv[fullKey]
    }

    if (fullKey in runtimeEnv) {
      return runtimeEnv[fullKey]
    }

    return undefined
  }

  const apiKey =
    options.overrides?.apiKey ??
    getEnv("PAYSTACK_SECRET_KEY")

  if (!apiKey) {
    throw new Error(
      "Missing Paystack API key. Set PAYSTACK_SECRET_KEY or provide overrides.apiKey.",
    )
  }

  const baseUrl =
    options.overrides?.baseUrl ??
    getEnv("PAYSTACK_BASE_URL") ??
    "https://api.paystack.co"

  const maxRetriesSource =
    options.overrides?.maxRetries ??
    getEnv("PAYSTACK_MAX_RETRIES")

  const maxRetries =
    typeof maxRetriesSource === "number"
      ? maxRetriesSource
      : maxRetriesSource
      ? Number(maxRetriesSource)
      : 3

  return {
    apiKey,
    baseUrl,
    maxRetries,
  }
}
