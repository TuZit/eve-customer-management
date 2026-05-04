import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionLimit: number;
  timezone: string;
  disabled: boolean;
}

type DatabaseConfigFile = Partial<Omit<DatabaseConfig, 'disabled'>>;

const DEFAULT_DATABASE_CONFIG: DatabaseConfigFile = {
  host: 'localhost',
  port: 3306,
  database: 'eve_dealer_management',
  user: 'eve_dealer',
  password: 'eve_dealer_password',
  connectionLimit: 10,
  timezone: '+07:00',
};

function readConfigFile(): DatabaseConfigFile {
  const configPath = resolve(
    process.env.DB_CONFIG_PATH ?? 'db/database.config.json',
  );

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(configPath, 'utf8')) as DatabaseConfigFile;
  } catch (error) {
    throw new Error(
      `Unable to read database config at ${configPath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function numberFromEnv(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid database number config value: ${value}`);
  }

  return parsed;
}

export function loadDatabaseConfig(): DatabaseConfig {
  const fileConfig = {
    ...DEFAULT_DATABASE_CONFIG,
    ...readConfigFile(),
  };

  return {
    host: process.env.DB_HOST ?? fileConfig.host ?? 'localhost',
    port: numberFromEnv(process.env.DB_PORT, fileConfig.port ?? 3306),
    database:
      process.env.DB_NAME ??
      process.env.DB_DATABASE ??
      fileConfig.database ??
      'eve_dealer_management',
    user: process.env.DB_USER ?? fileConfig.user ?? 'eve_dealer',
    password: process.env.DB_PASSWORD ?? fileConfig.password ?? '',
    connectionLimit: numberFromEnv(
      process.env.DB_CONNECTION_LIMIT,
      fileConfig.connectionLimit ?? 10,
    ),
    timezone: process.env.DB_TIMEZONE ?? fileConfig.timezone ?? '+07:00',
    disabled:
      process.env.DB_DISABLED === 'true' ||
      (process.env.NODE_ENV === 'test' &&
        process.env.DB_ENABLE_TEST_CONNECTION !== 'true'),
  };
}
