import { Injectable } from '@nestjs/common';
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
}
