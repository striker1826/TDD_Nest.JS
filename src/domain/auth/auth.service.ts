import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) {}

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
}
