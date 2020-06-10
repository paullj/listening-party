import { Resolver, Arg, Ctx, Authorized, Mutation, Query, Subscription, Root, PubSub, PubSubEngine, FieldResolver, Publisher, Args, ID } from 'type-graphql';
import { Repository } from 'typeorm';
import { Party } from '../entity/Party';

import { Context } from '../types/Context';
import { User } from '../entity/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CandidateResponse } from '../types/CandidateResponse';
import { Signal } from '../constants';
import { OfferResponse } from '../types/OfferResponse';
import { AnswerResponse } from '../types/AnswerResponse';

type FilterData = { payload: CandidatePayload, args: any, context: Context };

interface CandidatePayload {
  from: string;
  to: string;
  candidate: string;
}

interface OfferPayload {
  from: string;
  to: string;
  offer: string;
}

interface AnswerPayload {
  from: string;
  to: string;
  answer: string;
}

@Resolver(() => Party)
class PeerResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Party) private readonly partyRepository: Repository<Party>
  ) { }

  @Authorized()
  @Mutation(() => Boolean)
  async sendCandidate (
    @Arg('candidate') candidate: string,
    @Ctx() context: Context,
    @PubSub(Signal.ReceiveCandidate) publishCandidate: Publisher<CandidatePayload>
  ): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.party', 'party')
      .where('user.id = :id', { id: context.payload?.userId })
      .getOne();

    if (user?.party) {
      publishCandidate({
        from: user?.id,
        to: user?.party?.id,
        candidate
      });
      return true;
    }
    return false;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async sendOffer (
    @Arg('to', () => ID) to: string,
    @Arg('offer') offer: string,
    @Ctx() context: Context,
    @PubSub(Signal.ReceiveOffer) publishOffer: Publisher<OfferPayload>
  ): Promise<boolean> {
    if (context.payload) {
      publishOffer({
        to,
        from: context.payload?.userId,
        offer
      });
      return true;
    }
    return false;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async sendAnswer (
    @Arg('to', () => ID) to: string,
    @Arg('answer') answer: string,
    @Ctx() context: Context,
    @PubSub(Signal.ReceiveAnswer) publishAnswer: Publisher<AnswerPayload>
  ): Promise<boolean> {
    if (context.payload) {
      publishAnswer({
        to,
        from: context.payload?.userId,
        answer
      });
      return true;
    }
    return false;
  }

  @Subscription(() => CandidateResponse, {
    topics: Signal.ReceiveCandidate,
    filter: ({ payload, args, context }: FilterData) => {
      if (context.payload?.userId === payload.from) { return false; }
      if (payload.to === args.to) { return true; }
      return false;
    }
  })
  async receiveCandidate (
    @Arg('to', () => ID) to: string,
    @Root() payload: CandidatePayload
  ): Promise<CandidateResponse> {
    const from = await this.userRepository.findOne(payload.from);
    if (!from) {
      throw Error('From user not found!');
    }

    return {
      from,
      candidate: payload.candidate
    };
  }

  @Subscription(() => OfferResponse, {
    topics: Signal.ReceiveOffer,
    filter: ({ payload, args }: FilterData) => {
      if (payload.to === args.me) { return true; }
      return false;
    }
  })
  async receiveOffer (
    @Arg('me', () => ID) me: string,
    @Root() payload: OfferPayload
  ): Promise<OfferResponse> {
    const from = await this.userRepository.findOne(payload.from);
    if (!from) {
      throw Error('From user not found!');
    }

    return {
      from,
      offer: payload.offer
    };
  }

  @Subscription(() => AnswerResponse, {
    topics: Signal.ReceiveAnswer,
    filter: ({ payload, args }: FilterData) => {
      if (payload.to === args.me) { return true; }
      return false;
    }
  })
  async receiveAnswer (
    @Arg('me', () => ID) me: string,
    @Root() payload: AnswerPayload
  ): Promise<AnswerResponse> {
    const from = await this.userRepository.findOne(payload.from);
    if (!from) {
      throw Error('From user not found!');
    }

    return {
      from,
      answer: payload.answer
    };
  }
}

export { PeerResolver };
