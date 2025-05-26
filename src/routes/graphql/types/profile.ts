import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { MemberTypeLoader } from '../dataLoaders/memberTypeLoader.js';
import { Context } from './context.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async ({ memberTypeId }, _, context: Context) => {
        return MemberTypeLoader(context).load(memberTypeId);
      }
    }
  },
});