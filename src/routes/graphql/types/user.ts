import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import { ProfileLoader } from '../dataLoaders/profileLoader.js';
import { Context } from './context.js';
import { PostLoader } from '../dataLoaders/postLoader.js';
import { SubscribedToUserLoader } from '../dataLoaders/subscribedToUserLoader.js';
import { UserSubscribedToLoader } from '../dataLoaders/userSubscribedToLoader.js';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async ({id}, _, context: Context) => {
        return ProfileLoader(context).load(id);
      }
    },
    posts: {
      type: new GraphQLList(Post),
      args: { id: { type: UUIDType } },
      resolve: async ({id}, _, context: Context) => {
        return PostLoader(context).load(id);
      }
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      args: {
        id: { type: UUIDType },
      },
      resolve: async ({id}, _, context: Context) => {
        return SubscribedToUserLoader(context).load(id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(User),
      args: {
        id: { type: UUIDType },
      },
      resolve: async ({id}, _, context: Context) => {
        return UserSubscribedToLoader(context).load(id);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  },
});
