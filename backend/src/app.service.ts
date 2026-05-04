import { Injectable, Optional } from '@nestjs/common';
import {
  DatabaseService,
  type DatabaseHealth,
} from './database/database.service';

export interface AppHealth {
  service: string;
  status: 'ok';
  database?: DatabaseHealth;
}

@Injectable()
export class AppService {
  constructor(@Optional() private readonly databaseService?: DatabaseService) {}

  async getHealth(): Promise<AppHealth> {
    const health: AppHealth = {
      service: 'dealer-management',
      status: 'ok',
    };

    if (this.databaseService) {
      health.database = await this.databaseService.getHealth();
    }

    return health;
  }
}
