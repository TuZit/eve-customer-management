import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerAccountsModule } from './customer-accounts/customer-accounts.module';
import { DatabaseModule } from './database/database.module';
import { SwaggerDocsModule } from './swagger/swagger-docs.module';

@Module({
  imports: [DatabaseModule, CustomerAccountsModule, SwaggerDocsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
