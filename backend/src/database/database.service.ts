import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import mysql, {
  type Pool,
  type PoolOptions,
  type QueryResult,
} from 'mysql2/promise';
import { loadDatabaseConfig, type DatabaseConfig } from './database.config';

export interface DatabaseHealth {
  status: 'ok' | 'disabled' | 'error';
  host: string;
  port: number;
  database: string;
  message?: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly config: DatabaseConfig = loadDatabaseConfig();
  private pool?: Pool;

  async onModuleInit(): Promise<void> {
    if (this.config.disabled) {
      return;
    }

    await this.getPool().query('SELECT 1');
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async getHealth(): Promise<DatabaseHealth> {
    const baseHealth = {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
    };

    if (this.config.disabled) {
      return {
        ...baseHealth,
        status: 'disabled',
      };
    }

    try {
      await this.getPool().query('SELECT 1');

      return {
        ...baseHealth,
        status: 'ok',
      };
    } catch (error) {
      return {
        ...baseHealth,
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async query<T extends QueryResult>(
    sql: string,
    values?: unknown[],
  ): Promise<T> {
    const [rows] = await this.getPool().query<T>(sql, values);

    return rows;
  }

  private getPool(): Pool {
    if (!this.pool) {
      this.pool = mysql.createPool(this.toPoolOptions());
    }

    return this.pool;
  }

  private toPoolOptions(): PoolOptions {
    return {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: this.config.password,
      connectionLimit: this.config.connectionLimit,
      timezone: this.config.timezone,
      waitForConnections: true,
    };
  }
}
