import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql/type/index.js';
import { User, CreateUserInput, ChangeUserInput } from '../types/user.js';
import { Context } from '../types/context.js';
import { Post, CreatePostInput, ChangePostInput } from '../types/post.js';
import { Profile, CreateProfileInput, ChangeProfileInput } from '../types/profile.js';
import {UUIDType} from "../types/uuid.js";

export const mutationHandler = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: {type: new GraphQLNonNull(CreatePostInput)},
      },
      resolve: async (_, {dto}, context: Context) => {
        return await context.prisma.post.create({data: dto});
      },
    },

    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }, context: Context) => {
        return await context.prisma.user.create({ data: dto });
      },
    },

    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }, context: Context) => {
        return await context.prisma.profile.create({ data: dto });
      },
    },

    deletePost: {
        type: GraphQLString,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }, context: Context) => {
          const res = await context.prisma.post.delete({ where: { id } });
          return `Post ${res.id} deleted successfully`;
        },
    },

    deleteUser: {
    type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, context: Context) => {
        const res = await context.prisma.user.delete({ where: { id } });
        return `User ${res.id} deleted successfully`;
      },
    },

    deleteProfile: {
    type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, context: Context) => {
        const res = await context.prisma.profile.delete({ where: { id } });
        return `Profile ${res.id} deleted successfully`;
      },
    },

    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }, context: Context) => {
        return await context.prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },

    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }, context: Context) => {
        return await context.prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }, context: Context) => {
        return await context.prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, context: Context) => {
        const subscription = await context.prisma.user.update({
          data: {
            userSubscribedTo: {
              create: {
                authorId
              }
            }
          },
          where: {
            id: userId,
          }
        });
        return `Subscribed to user ${subscription.id} successfully`;
      },
    },

    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, context: Context) => {
        const subscription = await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            }
          }
        });
        return `Unsubscribed from user ${subscription.authorId} successfully`;
      },
    }
  },
})