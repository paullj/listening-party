import { buildSchema, AuthChecker } from 'type-graphql';
import { Container } from 'typedi';
import { Context } from '../types/Context';
import { isAuthorized } from './isAuthorized';
import { GraphQLSchema } from 'graphql';

import { UserResolver } from '../resolvers/UserResolver';
import { PartyResolver } from '../resolvers/PartyResolver';
import { PeerResolver } from '../resolvers/PeerResolver';
import { TrackResolver } from '../resolvers/TrackResolver';

const authChecker: AuthChecker<Context> = ({ context }) => isAuthorized(context);

const generateSchema = async () : Promise<GraphQLSchema> => {
  const schema = buildSchema({
    resolvers: [
      UserResolver,
      PartyResolver,
      PeerResolver,
      TrackResolver
    ],
    container: Container,
    validate: false,
    authChecker
  });
  return schema;
};

export { generateSchema };
