import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostRepository],
})
export class PostModule {}
