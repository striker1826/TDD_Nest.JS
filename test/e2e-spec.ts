import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from '../src/entities/user.entity';
import { Post } from '../src/entities/post.entity';
import { Comment } from '../src/entities/comment.entity';
import { PostLike } from '../src/entities/post-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from '../src/domain/post/post.module';
import * as jwt from 'jsonwebtoken';
import { JwtStrategy } from '../src/domain/auth/passport/jwt.passport';

let accessToken;
const member = { id: 1, email: 'test@email.com', password: '1234' };

describe('AppController (e2e)', () => {
    let app: INestApplication;
    accessToken = jwt.sign({ UserId: member.id }, 'accessKey', { expiresIn: '1800s' });
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                AuthModule,
                PostModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: 3306,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_MOCK_DATABASE,
                    entities: [User, Post, Comment, PostLike],
                    synchronize: true,
                    dropSchema: true,
                }),
                // TypeOrmModule.forRoot({
                //     type: 'sqlite',
                //     database: ':memory:',
                //     entities: [User, Post, Comment, PostLike],
                //     synchronize: true,
                //     dropSchema: true,
                // }),
            ],
            providers: [JwtStrategy],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('auth', () => {
        it('/signup (POST)', () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email: 'test@email.com', password: '1234', nickname: 'testUser' })
                .expect(201);
        });

        it('/login (POST)', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@email.com', password: '1234' })
                .expect(201);
        });
    });

    describe('post', () => {
        it('/ (POST)', () => {
            return request(app.getHttpServer())
                .post('/post')
                .send({ title: '제목', content: '내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);
        });

        it('/ (GET)', () => {
            return request(app.getHttpServer()).get('/post').expect(200);
        });

        it('/:postId (GET)', () => {
            return request(app.getHttpServer()).get('/post/1').expect(200);
        });

        it('/:postId (PUT)', () => {
            return request(app.getHttpServer())
                .put('/post/1')
                .send({ title: '제목', content: '수정된 내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });

        it('/:postId (DELETE', () => {
            return request(app.getHttpServer())
                .delete('/post/1')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });
    });

    describe('comment', () => {
        it('/:postId (POST)', () => {
            return request(app.getHttpServer())
                .post('/comment/1')
                .send({ comment: '댓글' })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);
        });
    });
});
