import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const MemberTypeLoader = (context: Context) => {
  let dataLoader = context.dataLoaders.get('memberType');
  if (!dataLoader) {
    dataLoader = new DataLoader(async (ids: readonly string[]) => {
      const res =  await context.prisma.memberType.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map(id => res.find(memberType => memberType.id === id) || null);
    });
    context.dataLoaders.set('memberType', dataLoader);
  }
  return dataLoader;
}