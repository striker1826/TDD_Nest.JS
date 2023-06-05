import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository, private jwtService: JwtService) {}

    async createUser(body): Promise<null> {
        const { email, password, nickname } = body;
        const isUserByEmail = await this.authRepository.findUserByEmail(email);
        if (isUserByEmail) throw new BadRequestException('이미 존재하는 이메일 입니다');
        const hashedPassword = await this.hash(password);
        await this.authRepository.createUser(email, hashedPassword, nickname);
        return;
    }

    async hash(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async login(body) {
        const { email, password } = body;
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) throw new BadRequestException('계정이 올바르지 않습니다');
        const isCompareByPassword = await bcrypt.compare(password, user.password);
        if (!isCompareByPassword) throw new BadRequestException('계정이 올바르지 않습니다');
        const access_token = await this.jwtGenerate(user, 'accessToken');
        const refresh_token = await this.jwtGenerate(user, 'refreshToken');
        return { access_token, refresh_token };
    }

    async jwtGenerate(data, key: string): Promise<string> {
        let jwtExpireTime: string;
        let jwtSecretKey: string;

        if (key === 'accessToken') {
            jwtExpireTime = '1800s';
            jwtSecretKey = 'accessKey';
            const access_token = this.jwtService.sign(
                { UserId: data.id },
                { secret: jwtSecretKey, expiresIn: jwtExpireTime },
            );
            return access_token;
        }
        if (key === 'refreshToken') {
            jwtExpireTime = '3600s';
            jwtSecretKey = 'refreshKey';
            const refresh_token = this.jwtService.sign(
                { UserId: data.id },
                { secret: jwtSecretKey, expiresIn: jwtExpireTime },
            );
            return refresh_token;
        }
    }
}
