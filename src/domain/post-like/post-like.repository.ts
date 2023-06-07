import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../../entities/post-like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeRepository {
    constructor(@InjectRepository(PostLike) private postLikeModel: Repository<PostLike>) {}
}
