import { getRepository } from 'typeorm';
import { Mutation, Resolver, Query, Ctx, Authorized, Field, ObjectType, Arg } from 'type-graphql';
import { Context } from '../types/Context';
import { User } from '../entity/User';
import { createAccessToken, setRefreshToken } from '../utils/tokens';
import { isAuthorized } from '../utils/isAuthorized';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
}

@Resolver(() => User)
class UserResolver {
  // TODO: remove this
  @Query(() => String)
  async hi (): Promise<string> {
    return 'Hello from the ListeningParty GraphQL API!';
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me (@Ctx() context: Context): Promise<User | null> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(context.payload?.userId);
    if (user) {
      return user;
    }

    return null;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login (@Ctx() context: Context, @Arg('name') name: string): Promise<LoginResponse | null> {
    if (isAuthorized(context)) return null;

    const userRepository = getRepository(User);
    const user = userRepository.create({
      name,
      tokenVersion: 0
    });

    userRepository.save(user);

    setRefreshToken(context.res, user);

    return {
      accessToken: createAccessToken(user)
    };
  }
}

export { UserResolver, LoginResponse };
