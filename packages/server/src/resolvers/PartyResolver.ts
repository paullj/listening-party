import { Resolver, ID, Arg, Ctx, Authorized, Mutation, Query, Subscription, Root, PubSub, PubSubEngine, FieldResolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { Party } from '../entity/Party';

import { Context } from '../types/Context';
import { User } from '../entity/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreatePartyInput } from '../types/CreatePartyInput';
import { JoinPartyResponse } from '../types/JoinPartyResponse';
import { isUUID } from 'class-validator';

@Resolver(() => Party)
class PartyResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Party) private readonly partyRepository: Repository<Party>
  ) {}

  @Authorized()
  @Query(() => Party, { nullable: true })
  async party (@Arg('id', () => ID) id: string): Promise<Party | null> {
    if (!isUUID(id, 4)) {
      return null;
    }

    const party = await this.partyRepository
      .createQueryBuilder('party')
      .where('party.id = :id', { id })
      .leftJoinAndSelect('party.host', 'host')
      .getOne();

    if (party) {
      return party;
    }

    return null;
  }

  @Authorized()
  @Query(() => [Party])
  async parties (): Promise<Party[] | null> {
    const parties = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.host', 'host')
      .getMany();

    if (parties) {
      return parties;
    }

    return null;
  }

  @Authorized()
  @Mutation(() => Party)
  async createParty (
    @Ctx() context: Context,
    @Arg('input') input: CreatePartyInput
  ): Promise<Party | null> {
    let party = this.partyRepository.create({
      name: input.name,
      isPublic: input.isPublic,
      host: await this.userRepository.findOne(context.payload?.userId)
    });
    console.log(party);
    party = await this.partyRepository.save(party);
    return party;
  }

  @Authorized()
  @Mutation(() => String)
  async findParty (
    @Arg('pin') pin: string,
    @Ctx() context: Context
  ): Promise<string> {
    const party = await this.partyRepository.findOne({
      pin: pin.toUpperCase()
    });
    if (party) {
      const me = await this.userRepository.findOne(context.payload?.userId);
      if (me) {
        me.party = party;
        await this.userRepository.save(me);
      }
      return party.id;
    }
    return '';
  }

  @Authorized()
  @Mutation(() => JoinPartyResponse)
  async joinParty (
    @Arg('id', () => ID) id: string,
    @Ctx() context: Context
  ): Promise<JoinPartyResponse | null> {
    if (!isUUID(id, 4)) {
      return null;
    }

    const party = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.host', 'host')
      .leftJoinAndSelect('party.users', 'users')
      .where('party.id = :id', { id })
      .getOne();

    const me = await this.userRepository.findOne(context.payload?.userId);
    if (me) {
      me.party = party;
      await this.userRepository.save(me);
    }

    return party ?? null;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async leaveParty (
      @Ctx() context: Context
  ): Promise<boolean> {
    const me = await this.userRepository.findOne(context.payload?.userId);
    if (me) {
      me.party = undefined;
      await this.userRepository.save(me);
    }

    return false;
  }
}

export { PartyResolver };
