import { Field, ObjectType } from 'type-graphql';
import { User } from '../entity/User';

@ObjectType()
class AnswerResponse {
  @Field(() => User)
  from!: User;

  @Field()
  answer!: string;
}

export { AnswerResponse };
