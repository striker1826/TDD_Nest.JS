import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class CommentRepository {
    constructor(@InjectRepository(Comment) private commentModel: Repository<Comment>) {}
}
