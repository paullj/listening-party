import { Field, ObjectType } from 'type-graphql';
import { User } from '../entity/User';

@ObjectType()
class JoinPartyResponse {
  @Field({ nullable: true })
  host?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];
}

export { JoinPartyResponse };
