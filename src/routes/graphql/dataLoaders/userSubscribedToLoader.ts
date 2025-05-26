import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const UserSubscribedToLoader = (context: Context) => {
  let dataLoader = context.dataLoaders.get('userSubscribedTo');
  if (!dataLoader) {
    dataLoader = new DataLoader(async (ids: readonly string[]) => {
      const res =  await context.prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: { in: [...ids] },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });
      return ids.map((id) =>
        res.filter((user) => user.subscribedToUser[0].subscriberId === id));
    });
    context.dataLoaders.set('userSubscribedTo', dataLoader);
  }
  return dataLoader;
}