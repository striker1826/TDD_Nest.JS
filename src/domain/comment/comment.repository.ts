import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { FindOneCommentOutputDto } from './dto/output/findOneComment';

@Injectable()
export class CommentRepository {
    constructor(@InjectRepository(Comment) private commentModel: Repository<Comment>) {}

    async createComment(postId: number, UserId: number, content: string): Promise<void> {
        const newComment = this.commentModel.create();
        newComment.postId = postId;
        newComment.userId = UserId;
        newComment.content = content;
        await this.commentModel.save(newComment);
        return;
    }

    async findOneComment(commentId: number): Promise<FindOneCommentOutputDto> {
        const result = await this.commentModel.findOne({ where: { id: commentId } });
        return plainToInstance(FindOneCommentOutputDto, result);
    }

    async updateComment(commentId: number, UserId: number, content: string): Promise<void> {
        await this.commentModel.update({ id: commentId, userId: UserId }, { content });
        return;
    }
}
