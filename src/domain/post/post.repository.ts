import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostsOutputDto } from './dto/output/posts';

@Injectable()
export class PostRepository {
    constructor(@InjectRepository(Post) private postModel: Repository<Post>) {}

    async createPost(UserId: number, title: string, content: string, category: number): Promise<void> {
        const newPost = this.postModel.create();
        newPost.userId = UserId;
        newPost.title = title;
        newPost.content = content;
        newPost.category = category;
        await this.postModel.save(newPost);
        return;
    }

    async findAllPosts(): Promise<PostsOutputDto[]> {
        const result = await this.postModel.find();
        return plainToInstance(PostsOutputDto, result);
    }

    async findOnePost(postId: number): Promise<PostsOutputDto> {
        const result = await this.postModel.findOne({ where: { id: postId } });
        return plainToInstance(PostsOutputDto, result);
    }
}
