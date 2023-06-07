import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { PostRepository } from '../post/post.repository';
import { BadRequestException } from '@nestjs/common';

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

describe('CommentService', () => {
    let commentService: CommentService;
    let commentRepository: CommentRepository;
    let postRepository: PostRepository;

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
            providers: [CommentService, CommentRepository, PostRepository],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
        commentRepository = module.get<CommentRepository>(CommentRepository);
        postRepository = module.get<PostRepository>(PostRepository);
    });

    it('should be defined', () => {
        expect(commentService).toBeDefined();
    });

    describe('createComment', () => {
        let postId = 1;
        let UserId = 1;
        let body = { content: '댓글' };

        it('존재하는 게시글이 아니라면 에러 리턴', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(null);
            await expect(commentService.createComment(postId, UserId, body)).rejects.toThrowError(
                new BadRequestException('존재하지 않는 게시글 입니다'),
            );
        });

        it('repo의 createComment를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            jest.spyOn(commentRepository, 'createComment').mockResolvedValue(null);
            await commentService.createComment(postId, UserId, body);
            expect(commentRepository.createComment).toHaveBeenCalledWith(postId, UserId, body.content);
        });

        it('리턴값이 null인지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            jest.spyOn(commentRepository, 'createComment').mockResolvedValue(null);
            const result = await commentService.createComment(postId, UserId, body);
            expect(result).toEqual(undefined);
        });
    });

    describe('findCommentsByPostId', () => {
        let postId: 1;

        it('존재하는 게시글이 아니라면 에러 리턴', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(null);
            await expect(commentService.findCommentsByPostId(postId)).rejects.toThrowError(
                '존재하지 않는 게시글 입니다',
            );
        });

        it('commentRepository의 findCommentsByPostId를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            jest.spyOn(commentRepository, 'findCommentsByPostId').mockResolvedValue(mockData.comments);
            await commentService.findCommentsByPostId(postId);
            expect(commentRepository.findCommentsByPostId).toHaveBeenCalledWith(postId);
        });

        it('commentRepository의 findCommentsByPostId가 리턴하는 값을 리턴하는지', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            jest.spyOn(commentRepository, 'findCommentsByPostId').mockResolvedValue(mockData.comments);
            const result = await commentService.findCommentsByPostId(postId);
            expect(result).toEqual(mockData.comments);
        });
    });

    describe('updateComment', () => {
        let commentId = 1;
        let UserId = 1;
        let body = { content: '수정된 댓글' };

        it('존재하는 댓글이 아니라면 에러 리턴', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(null);
            await expect(commentService.updateComment(commentId, UserId, body)).rejects.toThrowError(
                new BadRequestException('존재하는 댓글이 아닙니다'),
            );
        });

        it('repo의 updateComment를 호출하는지 확인', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(mockData.comment);
            jest.spyOn(commentRepository, 'updateComment').mockResolvedValue(null);
            await commentService.updateComment(commentId, UserId, body);
            expect(commentRepository.updateComment).toHaveBeenCalledWith(commentId, UserId, body.content);
        });

        it('리턴 값이 null인지 확인', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(mockData.comment);
            jest.spyOn(commentRepository, 'updateComment').mockResolvedValue(null);
            const result = await commentService.updateComment(commentId, UserId, body);
            expect(result).toEqual(undefined);
        });
    });

    describe('deleteComment', () => {
        let commentId = 1;
        let UserId = 1;

        it('존재하는 댓글이 아니라면 에러 리턴', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(null);
            await expect(commentService.deleteComment(commentId, UserId)).rejects.toThrowError(
                '존재하는 댓글이 아닙니다',
            );
        });

        it('repo의 deleteComment를 호출하는지 확인', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(mockData.comment);
            jest.spyOn(commentRepository, 'deleteComment').mockResolvedValue(null);
            await commentService.deleteComment(commentId, UserId);
            expect(commentRepository.deleteComment).toHaveBeenCalledWith(commentId, UserId);
        });

        it('null을 리턴하는지 확인', async () => {
            jest.spyOn(commentRepository, 'findOneComment').mockResolvedValue(mockData.comment);
            jest.spyOn(commentRepository, 'deleteComment').mockResolvedValue(null);
            const result = await commentService.deleteComment(commentId, UserId);
            expect(result).toEqual(undefined);
        });
    });
});
