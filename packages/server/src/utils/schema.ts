import { buildSchema, AuthChecker } from 'type-graphql';
import { Context } from '../types/Context';
import { UserResolver } from '../resolvers/UserResolver';
import { isAuthorized } from './isAuthorized';
import { GraphQLSchema } from 'graphql';

const authChecker: AuthChecker<Context> = ({ context }) => isAuthorized(context);

const generateSchema = async () : Promise<GraphQLSchema> => {
  const schema = buildSchema({
    resolvers: [
      UserResolver
    ],
    // emitSchemaFile: true,
    authChecker
  });
  return schema;
};

export { generateSchema };
