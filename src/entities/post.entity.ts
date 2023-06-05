import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { User } from './user.entity';

@Entity('Post')
export class Post {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int', { name: 'userId' })
    userId: number;

    @Column('int', { name: 'category' })
    category: number;

    @Column('varchar', { name: 'title' })
    title: string;

    @Column('varchar', { name: 'content' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => PostLike, PostLike => PostLike.Post)
    PostLike: PostLike[];

    @OneToMany(() => Comment, Comment => Comment.Post)
    Comment: Comment[];

    @ManyToOne(() => User, User => User.Post, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
    User: User;
}
