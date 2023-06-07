import { BadRequestException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(private postRepository: PostRepository) {}

    async createPost(UserId, body): Promise<void> {
        const { title, content, category } = body;
        await this.postRepository.createPost(UserId, title, content, category);
        return;
    }

    async findAllPosts() {
        return await this.postRepository.findAllPosts();
    }

    async findOnePost(postId: number) {
        const post = await this.postRepository.findOnePost(postId);
        if (!post) throw new BadRequestException('존재하지 않는 게시글 입니다');
        return post;
    }

    async updatePost(postId: number, UserId: number, body): Promise<void> {
        const { title, content, category } = body;
        const post = await this.postRepository.findOnePost(postId);
        if (!post) throw new BadRequestException('존재하지 않는 게시글 입니다');
        await this.postRepository.updatePost(UserId, postId, title, content, category);
        return;
    }

    async deletePost(postId, UserId): Promise<void> {
        await this.postRepository.deletePost(postId, UserId);
        return;
    }
}
