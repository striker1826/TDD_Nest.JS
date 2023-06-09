import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

export const mockData = {
    user: {
        id: 1,
        email: 'test@email.com',
        nickname: 'testUser',
        password: '$2b$10$z7SxeipXpsoS4AwnxcWtg.utlF52DUBGB2k1yXg5LbfUi3jgryYwy',
    },
};

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: AuthRepository;

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
            providers: [AuthService, AuthRepository, JwtService],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authRepository = module.get<AuthRepository>(AuthRepository);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('createUser', () => {
        let body;

        beforeEach(() => {
            body = { email: 'test@email.com', password: '1234', nickname: 'testUser' };
        });

        it('존재하는 이메일이면 "이미 존재하는 이메일 입니다" 에러 메세지 리턴', async () => {
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(mockData.user);
            await expect(authService.createUser(body)).rejects.toThrowError(
                new BadRequestException('이미 존재하는 이메일 입니다'),
            );
        });

        it('repo의 createUser를 호출하는지 확인', async () => {
            const hashedPassword = '$2b$10$z7SxeipXpsoS4AwnxcWtg.utlF52DUBGB2k1yXg5LbfUi3jgryYwy';
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(null);
            jest.spyOn(authRepository, 'createUser').mockResolvedValue(null);
            jest.spyOn(authService, 'hash').mockResolvedValue(hashedPassword);
            await authService.createUser(body);
            expect(authRepository.createUser).toHaveBeenCalledWith(body.email, hashedPassword, body.nickname);
        });

        it('리턴 값이 null인지 확인', async () => {
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(null);
            const result = await authService.createUser(body);
            expect(result).toEqual(undefined);
        });
    });

    describe('login', () => {
        let body;

        beforeEach(() => {
            body = { email: 'test@email.com', password: '1234' };
        });
        it('email이 일치하지 않으면 계정이 올바르지 않습니다 에러 메세지 리턴', async () => {
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(null);
            await expect(authService.login(body)).rejects.toThrowError(
                new BadRequestException('계정이 올바르지 않습니다'),
            );
        });

        it('찾아온 유저와 비밀번호가 일치하지 않으면 계정이 올바르지 않습니다 에러 메세지 리턴', async () => {
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(mockData.user);
            await expect(authService.login({ email: 'test@email.com', password: '9999' })).rejects.toThrowError(
                new BadRequestException('계정이 올바르지 않습니다'),
            );
        });

        it('토큰을 리턴하는지 확인', async () => {
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(mockData.user);
            const result = await authService.login(body);
            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
        });
    });

    describe('jwtGenerate', () => {
        it('string token 리턴하는지 확인', async () => {
            const result = await authService.jwtGenerate(mockData.user, 'accessToken');
            expect(typeof result).toEqual('string');
        });
    });
});
