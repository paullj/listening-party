import { Field, ObjectType, ID } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, OneToMany, BeforeInsert, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { generateRandomPin } from '../utils/pin';

@ObjectType()
@Entity({ name: 'parties' })
class Party {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Field()
  @Column({ length: 50 })
  name!: string;

  @Field()
  @Column({ default: true })
  isPublic!: boolean;

  @Field()
  @Column()
  @Index({ unique: true })
  pin!: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.party)
  host!: User;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.party, { nullable: true })
  users?: User[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @BeforeInsert()
  setPin (): void {
    this.pin = generateRandomPin(6);
  }
}
export { Party };
