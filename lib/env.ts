/**
 * Environment variable validation utility
 * Validates required environment variables at startup
 */

interface EnvConfig {
  OPENROUTER_API_KEY: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface OptionalEnvConfig {
  NEXT_PUBLIC_APP_URL: string;
}

const requiredEnvVars = [
  "OPENROUTER_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

/**
 * Validates that all required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\n` +
      `Please create a .env.local file with these variables. See .env.example for reference.`
    );
  }
}

/**
 * Gets a validated environment variable
 * @param key - Environment variable key
 * @returns The environment variable value
 * @throws Error if the environment variable is not set
 */
export function getEnv(key: keyof EnvConfig): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Safely gets an optional environment variable
 * @param key - Environment variable key (must be a known optional env var)
 * @param defaultValue - Default value if not set
 * @returns The environment variable value or default
 */
export function getOptionalEnv(key: keyof OptionalEnvConfig, defaultValue = ""): string {
  return process.env[key] || defaultValue;
}
