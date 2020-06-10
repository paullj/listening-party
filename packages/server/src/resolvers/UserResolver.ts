import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Mutation, Resolver, Query, Ctx, Authorized, Arg } from 'type-graphql';

import { User } from '../entity/User';
import { Context } from '../types/Context';
import { isAuthorized } from '../utils/isAuthorized';
import { createAccessToken, setRefreshToken } from '../utils/tokens';
import { LoginResponse } from '../types/LoginResponse';

@Resolver(User)
class UserResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Authorized()
  @Query(() => User, { nullable: true })
  async me (@Ctx() context: Context): Promise<User | null> {
    const user = await this.userRepository.findOne(context.payload?.userId);
    if (user) {
      return user;
    }

    return null;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login (
    @Ctx() context: Context
  ): Promise<LoginResponse | null> {
    if (isAuthorized(context)) return null;

    let user = this.userRepository.create({
      tokenVersion: 0
    });

    user = await this.userRepository.save(user);

    setRefreshToken(context.res, user);

    return {
      ...user,
      accessToken: createAccessToken(user)
    };
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async changeName (
    @Ctx() context: Context,
    @Arg('newName') newName: string
  ): Promise<boolean> {
    const user = await this.userRepository.findOne(context.payload?.userId);

    if (user) {
      user.name = newName;
      this.userRepository.save(user);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

export { UserResolver, LoginResponse };
