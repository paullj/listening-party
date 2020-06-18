import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@ObjectType()
@Entity()
class Track {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  artist!: string;

  @Field()
  @Column()
  album!: string;

  @Field()
  @Column()
  albumCover?: string;

  @Field()
  @Column()
  duration?: number;

  @Field()
  @Column()
  provider?: string;

  @Field()
  @Column()
  providerId?: string;

  @CreateDateColumn()
  createdAt?: Date;
}

export { Track };
