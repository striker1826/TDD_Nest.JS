import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './domain/comment/comment.module';
import { PostLikeModule } from './domain/post-like/post-like.module';
import { PostModule } from './domain/post/post.module';
import { UserModule } from './domain/user/user.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    CommentModule,
    PostLikeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
