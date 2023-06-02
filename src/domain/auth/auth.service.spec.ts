import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { DatabaseModule } from '../database/database.module';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

export const mockData = {
    user: {
        email: 'test@email.com',
        nickname: 'testUser',
        password: '1234',
    },
};

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: AuthRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
            providers: [AuthService, AuthRepository],
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
            jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue({ email: 'test@email.com' });
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
});
