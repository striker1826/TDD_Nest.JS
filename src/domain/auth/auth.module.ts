import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.passport';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, JwtStrategy],
})
export class AuthModule {}
