import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
            controllers: [AuthController],
            providers: [AuthService, AuthRepository],
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
});
