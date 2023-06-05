import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import request from "supertest";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server : any
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer()
  });
  afterAll(async () => {
    app.close()
  });

  it('/ (GET)', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
