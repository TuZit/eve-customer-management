import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          service: 'dealer-management',
          status: 'ok',
          database: expect.objectContaining({
            database: 'eve_dealer_management',
            host: 'localhost',
            status: 'disabled',
          }),
        });
      });
  });

  it('/api/docs-json (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
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

  it('/api/docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((response) => {
        expect(response.text).toContain('SwaggerUIBundle');
        expect(response.text).toContain('/api/docs-json');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
