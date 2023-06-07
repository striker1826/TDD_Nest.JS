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

const mockData = {
    posts: [
        { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 2, UserId: 2, title: '제목2', content: '내용2', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 3, UserId: 3, title: '제목3', content: '내용3', createdAt: '2023-06-05T05:39:28.388Z' },
    ],
    post: { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
    comments: [
        { id: 1, UserId: 1, postId: 1, content: '댓글', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 2, UserId: 1, postId: 1, content: '댓글', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 3, UserId: 1, postId: 1, content: '댓글', createdAt: '2023-06-05T05:39:28.388Z' },
    ],
    comment: { id: 1, UserId: 1, postId: 1, content: '댓글', createdAt: '2023-06-05T05:39:28.388Z' },
};

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

    describe('getCommentsByPostId', () => {
        let postId = 1;

        it('commentService의 findCommentsByPostId를 호출하는지 확인', async () => {
            jest.spyOn(commentService, 'findCommentsByPostId').mockResolvedValue(mockData.comments);
            await commentController.getCommentsByPostId(postId);
            expect(commentService.findCommentsByPostId).toHaveBeenCalledWith(postId);
        });

        it('commentService의 findCommentsByPostId의 리턴값을 리턴하는지 확인', async () => {
            jest.spyOn(commentService, 'findCommentsByPostId').mockResolvedValue(mockData.comments);
            const result = await commentController.getCommentsByPostId(postId);
            expect(result).toEqual(mockData.comments);
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

    describe('deleteComment', () => {
        let commentId = 1;
        let UserId = 1;

        it('commentService의 deleteComment를 호출하는지 확인', async () => {
            jest.spyOn(commentService, 'deleteComment').mockResolvedValue(null);
            await commentController.deleteComment(commentId, UserId);
            expect(commentService.deleteComment).toHaveBeenCalledTimes(1);
        });

        it('null을 리턴하는지 확인', async () => {
            jest.spyOn(commentService, 'deleteComment').mockResolvedValue(null);
            const result = await commentController.deleteComment(commentId, UserId);
            expect(result).toEqual(undefined);
        });
    });
});
