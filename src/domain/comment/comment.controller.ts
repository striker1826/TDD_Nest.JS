import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpUser } from '../../common/decorators/http_user.decorator';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Post('/:postId')
    @UseGuards(AuthGuard('jwt'))
    async createComment(@Param('postId') postId: number, @HttpUser() httpUser, @Body() body): Promise<void> {
        const UserId = httpUser.UserId;
        await this.commentService.createComment(postId, UserId, body);
        return;
    }

    @Put('/:commentId')
    @UseGuards(AuthGuard('jwt'))
    async updateComment(@Param('commentId') commentId: number, @HttpUser() httpUser, @Body() body): Promise<void> {
        const UserId = httpUser.UserId;
        await this.commentService.updateComment(commentId, UserId, body);
        return;
    }
}
