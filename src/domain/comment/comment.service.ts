import { BadRequestException, Injectable } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
    constructor(private commentRepository: CommentRepository, private postRepository: PostRepository) {}

    async createComment(postId: number, UserId: number, body): Promise<void> {
        const { content } = body;
        const post = await this.postRepository.findOnePost(postId);
        if (!post) throw new BadRequestException('존재하지 않는 게시글 입니다');
        await this.commentRepository.createComment(postId, UserId, content);
        return;
    }

    async updateComment(commentId, UserId, body): Promise<void> {
        const { content } = body;
        const comment = await this.commentRepository.findOneComment(commentId);
        if (!comment) throw new BadRequestException('존재하는 댓글이 아닙니다');
        await this.commentRepository.updateComment(commentId, UserId, content);
        return;
    }
}
