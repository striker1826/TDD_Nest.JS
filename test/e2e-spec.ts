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
import { CommentModule } from '../src/domain/comment/comment.module';

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
                CommentModule,
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
            ],
            providers: [JwtStrategy],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('case 1: 회원가입 -> 로그인', () => {
        it('/auth/signup (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email: 'test@email.com', password: '1234', nickname: 'testUser' });
            expect(result.status).toEqual(201);
            expect(result.body).toEqual({});
        });

        it('/auth/login (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@email.com', password: '1234' });
            expect(result.status).toEqual(201);
            expect(result.body).toHaveProperty('access_token');
            expect(result.body).toHaveProperty('refresh_token');
        });
    });

    describe('case 2: 게시글 작성 -> 게시글 조회 -> 게시글 상세 조회 -> 게시글 변경 -> 게시글 삭제', () => {
        it('게시글 작성 /post (POST)', () => {
            return request(app.getHttpServer())
                .post('/post')
                .send({ title: '제목', content: '내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);
        });

        it('게시글 조회 /post (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/post');
            expect(result.status).toBe(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('게시글 상세 조회 /post/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/post/1');
            expect(result.status).toBe(200);
            expect(result.body.title).toEqual('제목');
            expect(result.body.content).toEqual('내용');
            expect(result.body.category).toEqual(1);
        });

        it('게시글 변경 /post/:postId (PUT)', async () => {
            const result = await request(app.getHttpServer())
                .put('/post/1')
                .send({ title: '제목', content: '수정된 내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({});
        });

        it('게시글 삭제 /post/:postId (DELETE', async () => {
            const result = await request(app.getHttpServer())
                .delete('/post/1')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({});
        });
    });

    describe('case 3: 게시글 작성 -> 게시글 조회 -> 게시글 상세 조회 -> 댓글 조회 -> 댓글 작성 -> 댓글 조회', () => {
        let postId: number;

        it('게시글 작성 /post (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/post')
                .send({ title: '제목', content: '내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(201);
            expect(result.body).toEqual({});
        });

        it('게시글 조회 /post (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/post');
            postId = result.body[0].id;
            expect(result.status).toEqual(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('게시글 상세 조회 /post/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get(`/post/${postId}`);
            expect(result.status).toEqual(200);
            expect(result.body.title).toEqual('제목');
            expect(result.body.content).toEqual('내용');
            expect(result.body.category).toEqual(1);
        });

        it('댓글 조회 /comment/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get(`/comment/${postId}`);
            expect(result.status).toEqual(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('댓글 작성 /comment/:postId (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post(`/comment/${postId}`)
                .send({ content: '댓글' })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(201);
            expect(result.body).toEqual({});
        });

        it('댓글 조회 /comment/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/comment/2');
            expect(result.status).toEqual(200);
            expect(Array.isArray(result.body)).toEqual(true);
            expect(result.body[0].content).toEqual('댓글');
        });
    });

    it('게시글 조회 /post (GET)', async () => {
        const result = await request(app.getHttpServer()).get('/post');
        expect(result.status).toBe(200);
        expect(Array.isArray(result.body)).toEqual(true);
    });

    describe('case 4: 회원가입 -> 로그인 -> 게시글 조회 -> 게시글 작성 -> 게시글 조회 -> 게시글 상세 조회 -> 댓글 조회 -> 댓글 작성 -> 댓글 변경 -> 댓글 삭제 -> 게시글 삭제', () => {
        let postId: number;

        it('/auth/signup (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/auth/signup')
                .send({ email: 'test2@email.com', password: '1234', nickname: 'testUser' });
            expect(result.status).toEqual(201);
            expect(result.body).toEqual({});
        });

        it('/auth/login (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@email.com', password: '1234' });
            expect(result.status).toEqual(201);
            expect(result.body).toHaveProperty('access_token');
            expect(result.body).toHaveProperty('refresh_token');
        });

        it('게시글 조회 /post (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/post').expect(200);
            expect(result.status).toBe(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('게시글 작성 /post (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post('/post')
                .send({ title: '제목', content: '내용', category: 1 })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(201);
            expect(result.body).toEqual({});
        });

        it('게시글 조회 /post (GET)', async () => {
            const result = await request(app.getHttpServer()).get('/post');
            postId = result.body[0].id;
            expect(result.status).toEqual(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('게시글 상세 조회 /post/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get(`/post/${postId}`);
            expect(result.status).toEqual(200);
            expect(result.body.title).toEqual('제목');
            expect(result.body.content).toEqual('내용');
            expect(result.body.category).toEqual(1);
        });

        it('댓글 조회 /comment/:postId (GET)', async () => {
            const result = await request(app.getHttpServer()).get(`/comment/${postId}`);
            expect(result.status).toEqual(200);
            expect(Array.isArray(result.body)).toEqual(true);
        });

        it('댓글 작성 /comment/:postId (POST)', async () => {
            const result = await request(app.getHttpServer())
                .post(`/comment/${postId}`)
                .send({ content: '댓글' })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toBe(201);
            expect(result.body).toEqual({});
        });

        it('댓글 변경 /comment/:commentId (PUT)', async () => {
            const result = await request(app.getHttpServer())
                .put('/comment/1')
                .send({ content: '수정된 댓글' })
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({});
        });

        it('댓글 삭제 /comment/:commentId (DELETE)', async () => {
            const result = await request(app.getHttpServer())
                .delete('/comment/1')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({});
        });

        it('게시글 삭제 /post/:postId (DELETE)', async () => {
            const result = await request(app.getHttpServer())
                .delete('/post/1')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({});
        });
    });
});
