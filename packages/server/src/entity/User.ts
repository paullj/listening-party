import { Field, ObjectType, ID } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Party } from './Party';

@ObjectType()
@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column()
  tokenVersion!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => Party, (party) => party.users, { nullable: true })
  party?: Party | null;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
export { User };
