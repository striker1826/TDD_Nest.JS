import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([User]),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User, Post, Comment, PostLike],
                    synchronize: true,
                }),
            ],
            controllers: [AuthController],
            providers: [AuthService, AuthRepository, JwtService],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signup', () => {
        let body;

        beforeEach(() => {
            body = { email: 'test@email.com', password: '1234', nickname: 'testUser' };
        });

        it('AuthService의 createUser를 호출하는지', async () => {
            jest.spyOn(authService, 'createUser').mockResolvedValue(null);
            await authController.signup(body);
            expect(authService.createUser).toHaveBeenCalledWith(body);
        });
    });

    describe('login', () => {
        let body;

        beforeEach(() => {
            body = { email: 'test@email.com', password: '1234' };
        });
        it('AuthService의 login을 호출하는지 확인', async () => {
            jest.spyOn(authService, 'login').mockResolvedValue({
                access_token: 'accessToken',
                refresh_token: 'refreshToken',
            });
            await authController.login(body);
            expect(authService.login).toHaveBeenCalledWith(body);
        });
    });
});
