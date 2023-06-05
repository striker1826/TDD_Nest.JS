import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { PostService } from './post.service';
import { PostLike } from '../../entities/post-like.entity';
import { Comment } from '../../entities/comment.entity';
import { PostRepository } from './post.repository';

const posts = [
    { id: 1, UserId: 1, title: '제목', content: '내용', createdAt: '2023-06-05T05:39:28.388Z' },
    { id: 2, UserId: 2, title: '제목2', content: '내용2', createdAt: '2023-06-05T05:39:28.388Z' },
    { id: 3, UserId: 3, title: '제목3', content: '내용3', createdAt: '2023-06-05T05:39:28.388Z' },
];

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
            jest.spyOn(postRepository, 'findAllPosts').mockResolvedValue(posts);
            await postService.findAllPosts();
            expect(postRepository.findAllPosts).toHaveBeenCalled();
        });

        it('repo의 결과물인 post 배열을 리턴하는지 확인', async () => {
            jest.spyOn(postRepository, 'findAllPosts').mockResolvedValue(posts);
            const result = await postService.findAllPosts();
            expect(result).toEqual(posts);
        });
    });
});
