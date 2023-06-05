import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { PostService } from './post.service';
import { PostLike } from '../../entities/post-like.entity';
import { Comment } from '../../entities/comment.entity';
import { PostRepository } from './post.repository';
import { BadRequestException } from '@nestjs/common';

const mockData = {
    posts: [
        { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 2, UserId: 2, title: '제목2', content: '내용2', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 3, UserId: 3, title: '제목3', content: '내용3', createdAt: '2023-06-05T05:39:28.388Z' },
    ],
    post: { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
};
describe('PostService', () => {
    let postService: PostService;
    let postRepository: PostRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([Post]),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User, Post, Comment, PostLike],
                    synchronize: true,
                }),
            ],
            providers: [PostService, PostRepository],
        }).compile();

        postService = module.get<PostService>(PostService);
        postRepository = module.get<PostRepository>(PostRepository);
    });

    it('should be defined', () => {
        expect(postService).toBeDefined();
    });

    describe('createPost', () => {
        const body = { title: '제목', content: '게시글 내용', category: 1 };
        const UserId = 1;
        it('repo의 createPost를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'createPost').mockResolvedValue(null);
            await postService.createPost(UserId, body);
            expect(postRepository.createPost).toHaveBeenCalledWith(UserId, body.title, body.content, body.category);
        });

        it('결과값이 null인지 확인', async () => {
            jest.spyOn(postRepository, 'createPost').mockResolvedValue(null);
            const result = await postService.createPost(UserId, body);
            expect(result).toEqual(undefined);
        });
    });

    describe('findAllPosts', () => {
        it('repo의 findAllPosts를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'findAllPosts').mockResolvedValue(mockData.posts);
            await postService.findAllPosts();
            expect(postRepository.findAllPosts).toHaveBeenCalled();
        });

        it('repo의 결과물인 post 배열을 리턴하는지 확인', async () => {
            jest.spyOn(postRepository, 'findAllPosts').mockResolvedValue(mockData.posts);
            const result = await postService.findAllPosts();
            expect(result).toEqual(mockData.posts);
        });
    });

    describe('findOnePost', () => {
        const postId = 1;
        it('repo의 findOnePost를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await postService.findOnePost(postId);
            expect(postRepository.findOnePost).toHaveBeenCalledWith(postId);
        });

        it('repo의 결과물을 리턴하는지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            const result = await postService.findOnePost(postId);
            expect(result).toEqual(mockData.post);
        });
    });

    describe('updatePost', () => {
        const postId = 1;
        const UserId = 1;
        const body = { title: '제목', content: '게시글 내용', category: 1 };
        it('repo의 findOnePost를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await postService.updatePost(postId, UserId, body);
            expect(postRepository.findOnePost).toHaveBeenCalledWith(postId);
        });

        it('존재하지 않는 postId일 경우', async () => {
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(null);
            await expect(postService.updatePost(postId, UserId, body)).rejects.toThrowError(
                new BadRequestException('존재하지 않는 게시글 입니다'),
            );
        });

        it('repo의 updatePost를 호출하는지 확인', async () => {
            jest.spyOn(postRepository, 'updatePost').mockResolvedValue(null);
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await postService.updatePost(UserId, postId, body);
            expect(postRepository.updatePost).toHaveBeenCalledWith(
                postId,
                UserId,
                body.title,
                body.content,
                body.category,
            );
        });

        it('리턴값이 null인지 확인', async () => {
            jest.spyOn(postRepository, 'updatePost').mockResolvedValue(null);
            jest.spyOn(postRepository, 'findOnePost').mockResolvedValue(mockData.post);
            const result = await postService.updatePost(UserId, postId, body);
            expect(result).toEqual(undefined);
        });
    });
});
