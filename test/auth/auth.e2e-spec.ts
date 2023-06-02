import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/domain/auth/auth.service';
import { AuthRepository } from '../../src/domain/auth/auth.repository';
import {
  Connection,
  createConnection,
  getConnectionOptions,
  Repository,
} from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Post } from '../../src/entities/post.entity';
import { Comment } from '../../src/entities/comment.entity';
import { PostLike } from '../../src/entities/post-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../src/domain/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Post, Comment, PostLike],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer()).post('/auth/signup').expect(201);
  });
});
