import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { PostLikeModule } from './post-like.module';
import { PostLikeRepository } from './post-like.repository';
import { PostLikeService } from './post-like.service';

describe('PostLikeService', () => {
    let postLikeService: PostLikeService;
    let postLikeRepository: PostLikeRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([PostLike]),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User, Post, Comment, PostLike],
                    synchronize: true,
                }),
            ],
            providers: [PostLikeService, PostLikeRepository],
        }).compile();

        postLikeService = module.get<PostLikeService>(PostLikeService);
        postLikeRepository = module.get<PostLikeRepository>(PostLikeRepository);
    });

    it('should be defined', () => {
        expect(postLikeService).toBeDefined();
    });
});
