import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { CommentModule } from './domain/comment/comment.module';
import { PostLikeModule } from './domain/post-like/post-like.module';
import { PostModule } from './domain/post/post.module';
import { UserModule } from './domain/user/user.module';
import { DatabaseModule } from './domain/database/database.module';

@Module({
    imports: [
        UserModule,
        PostModule,
        CommentModule,
        PostLikeModule,
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        AuthModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
