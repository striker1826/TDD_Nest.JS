import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { FindUserByEmailOutputDto } from './dto/output/findUserByEmail';

@Injectable()
export class AuthRepository {
    constructor(@InjectRepository(User) private userModel: Repository<User>) {}

    async findUserByEmail(email: string): Promise<FindUserByEmailOutputDto> {
        return await this.userModel
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .select('user.email')
            .getOne();
    }

    async createUser(email: string, hashedPassword: string, nickname: string): Promise<void> {
        await this.userModel.insert({ email, nickname, password: hashedPassword });
        return;
    }
}
