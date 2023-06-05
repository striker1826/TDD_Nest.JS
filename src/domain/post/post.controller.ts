import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpUser } from '../../common/decorators/http_user.decorator';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createPost(@HttpUser() httpUser, @Body() body) {
        const UserId = httpUser.UserId;
        return await this.postService.createPost(UserId, body);
    }

    @Get()
    async getAllPosts() {
        return await this.postService.findAllPosts();
    }

    @Get('/:postId')
    async getOnePost(@Param('postId') postId: number) {
        return await this.postService.findOnePost(postId);
    }
}
