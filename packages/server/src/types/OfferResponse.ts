import { Field, ObjectType, ID } from 'type-graphql';
import { User } from '../entity/User';

@ObjectType()
class OfferResponse {
  @Field(() => User)
  from!: User;

  @Field()
  offer!: string;
}

export { OfferResponse };
