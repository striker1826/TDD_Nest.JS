import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { PostModule } from '../post/post.module';
import { PostRepository } from '../post/post.repository';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), PostModule],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
})
export class CommentModule {}
