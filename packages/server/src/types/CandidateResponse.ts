import { Field, ObjectType } from 'type-graphql';
import { User } from '../entity/User';

@ObjectType()
class CandidateResponse {
  @Field(() => User)
  from!: User;

  @Field()
  candidate!: string;
}

export { CandidateResponse };
