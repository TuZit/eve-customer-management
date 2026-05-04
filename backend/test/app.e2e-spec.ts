import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        database: {
          database: 'eve_dealer_management',
          host: 'localhost',
          port: 3306,
          status: 'disabled',
        },
        service: 'dealer-management',
        status: 'ok',
      });
  });

  it('/openapi.json (GET)', () => {
    return request(app.getHttpServer())
      .get('/openapi.json')
      .expect(200)
      .expect((response) => {
        const body = response.body as {
          openapi?: string;
          paths?: Record<string, unknown>;
        };

        expect(body.openapi).toBe('3.0.3');
        expect(body.paths?.['/customer-accounts']).toBeDefined();
      });
  });

  it('/api-docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/api-docs')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((response) => {
        expect(response.text).toContain('SwaggerUIBundle');
        expect(response.text).toContain('/openapi.json');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
