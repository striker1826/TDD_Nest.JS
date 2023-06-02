import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'nickname' })
  nickname: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @OneToMany(() => Post, (Post) => Post.User)
  Post: Post[];

  @OneToMany(() => Comment, (Comment) => Comment.User)
  Comment: Comment[];

  @OneToMany(() => PostLike, (PostLike) => PostLike.User)
  PostLike: PostLike[];
}
