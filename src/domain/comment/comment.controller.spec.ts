import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from '../../entities/post-like.entity';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { PostRepository } from '../post/post.repository';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { Comment } from '../../entities/comment.entity';

describe('CommentController', () => {
    let commentController: CommentController;
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([Comment, Post]),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User, Post, Comment, PostLike],
                    synchronize: true,
                }),
            ],
            controllers: [CommentController],
            providers: [CommentService, CommentRepository, PostRepository],
        }).compile();

        commentController = module.get<CommentController>(CommentController);
        commentService = module.get<CommentService>(CommentService);
    });

    it('should be defined', () => {
        expect(commentController).toBeDefined();
    });

    describe('createComment', () => {
        let postId = 1;
        let UserId = 1;
        let body = { content: '댓글' };

        it('commentService의 createComment를 호출하는지 확인', async () => {
            jest.spyOn(commentService, 'createComment').mockResolvedValue(null);
            await commentController.createComment(postId, UserId, body);
            expect(commentService.createComment).toHaveBeenCalledTimes(1);
        });

        it('리턴값이 null인지 확인', async () => {
            jest.spyOn(commentService, 'createComment').mockResolvedValue(null);
            const result = await commentController.createComment(postId, UserId, body);
            expect(result).toEqual(undefined);
        });
    });

    describe('updateComment', () => {
        let commentId = 1;
        let UserId = 1;
        let body = { content: '수정된 댓글' };

        it('commentService의 updateComment를 호출하는지 확인', async () => {
            jest.spyOn(commentService, 'updateComment').mockResolvedValue(null);
            await commentController.updateComment(commentId, UserId, body);
        });

        it('리턴값이 null인지 확인', async () => {
            jest.spyOn(commentService, 'updateComment').mockResolvedValue(null);
            const result = await commentController.updateComment(commentId, UserId, body);
            expect(result).toEqual(undefined);
        });
    });
});
