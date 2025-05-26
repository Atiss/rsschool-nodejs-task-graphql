import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { queryHandler } from './queries/queryHandler.js';
import {mutationHandler} from "./queries/mutationHandler.js";

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const context = {
        prisma,
        dataLoaders: new Map(),
      };
      const graphqlErrors = validate(schema, parse(query), [depthLimit(5)])
      if( graphqlErrors.length > 0 ) {
        return {
          data: null,
          errors: graphqlErrors.map(error => ({
            message: error.message,
            locations: error.locations,
          }))
        }
      }
      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });
    },
  });
};

export const schema = new GraphQLSchema({
  query: queryHandler,
  mutation: mutationHandler,
})

export default plugin;
