import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
class LoginResponse {
  @Field(() => ID)
  id?: string;

  @Field()
  name?: string;

  @Field()
  accessToken!: string;
}

export { LoginResponse };
