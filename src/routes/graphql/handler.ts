import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/type/index.js';
import {MemberType, MemberTypeId} from './types/memberType.js';
import { Context, ID } from './types/context.js';
import { Profile } from './types/profile.js';
import { Post } from './types/post.js';
import { User } from './types/user.js';
import {UUIDType} from "./types/uuid.js";

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(MemberType)),
      resolve: async (_, __, context: Context) => {
        return await context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_, args: ID, context: Context) => {
        return await context.prisma.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (_, __, context: Context) => {
        return await context.prisma.profile.findMany();
      },
    },

    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: ID, context: Context) => {
        return await context.prisma.profile.findUnique({
          where: { id: args.id },
          include: { memberType: true },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (_, __, context: Context) => {
        return await context.prisma.post.findMany();
      },
    },

    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: ID, context: Context) => {
        return await context.prisma.post.findUnique({
          where: { id: args.id },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(User)), // Assuming User is similar to Profile
      resolve: async (_, __, context: Context) => {
        return await context.prisma.user.findMany();
      },
    },

    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args: ID, context: Context) => {
        return await context.prisma.user.findUnique({
          where: { id: args.id },
        });
      },
    },

  },
});

