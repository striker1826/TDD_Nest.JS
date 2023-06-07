import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from '../../entities/post-like.entity';
import { PostLikeController } from './post-like.controller';
import { PostLikeRepository } from './post-like.repository';
import { PostLikeService } from './post-like.service';

@Module({
    imports: [TypeOrmModule.forFeature([PostLike])],
    controllers: [PostLikeController],
    providers: [PostLikeService, PostLikeRepository],
})
export class PostLikeModule {}
