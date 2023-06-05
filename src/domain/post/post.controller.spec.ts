import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

const mockData = {
    posts: [
        { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 2, UserId: 2, title: '제목2', content: '내용2', createdAt: '2023-06-05T05:39:28.388Z' },
        { id: 3, UserId: 3, title: '제목3', content: '내용3', createdAt: '2023-06-05T05:39:28.388Z' },
    ],
    post: { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
};

describe('PostController', () => {
    let postController: PostController;
    let postService: PostService;

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
            controllers: [PostController],
            providers: [PostService, PostRepository],
        }).compile();

        postService = module.get<PostService>(PostService);
        postController = module.get<PostController>(PostController);
    });

    it('should be defined', () => {
        expect(postController).toBeDefined();
    });

    describe('createPost', () => {
        const body = { title: '제목', content: '게시글 내용' };
        const UserId = 1;
        it('postService의 createPost를 호출하는지 확인', async () => {
            jest.spyOn(postService, 'createPost').mockResolvedValue(null);
            await postController.createPost(UserId, body);
            expect(postService.createPost).toHaveBeenCalledTimes(1);
        });

        it('리턴값이 null인지 확인', async () => {
            jest.spyOn(postService, 'createPost').mockResolvedValue(null);
            const result = await postController.createPost(UserId, body);
            expect(result).toEqual(null);
        });
    });

    describe('getAllPosts', () => {
        it('postService의 findAllPosts를 호출하는지 확인', async () => {
            jest.spyOn(postService, 'findAllPosts').mockResolvedValue(mockData.posts);
            await postController.getAllPosts();
            expect(postService.findAllPosts).toHaveBeenCalledTimes(1);
        });

        it('리턴값이 postService에서 넘겨준 값인지 확인', async () => {
            jest.spyOn(postService, 'findAllPosts').mockResolvedValue(mockData.posts);
            const result = await postController.getAllPosts();
            expect(result).toEqual(mockData.posts);
        });
    });

    describe('getOnePost', () => {
        let postId = 1;
        it('postService의 findOnePost를 호출하는지 확인', async () => {
            jest.spyOn(postService, 'findOnePost').mockResolvedValue(mockData.post);
            await postController.getOnePost(postId);
            expect(postService.findOnePost).toHaveBeenCalledWith(postId);
        });

        it('리턴값이 postService에서 넘겨준 값인지 확인', async () => {
            jest.spyOn(postService, 'findOnePost').mockResolvedValue(mockData.post);
            const result = await postController.getOnePost(postId);
            expect(result).toEqual(mockData.post);
        });
    });
});
