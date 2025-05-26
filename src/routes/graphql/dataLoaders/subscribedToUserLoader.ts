import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const SubscribedToUserLoader = (context: Context) => {
  let dataLoader = context.dataLoaders.get('subscribedToUser');
  if (!dataLoader) {
    dataLoader = new DataLoader(async (ids: readonly string[]) => {
      const res =  await context.prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: { in: [...ids] },
            },
          },
        },
        include: {
          userSubscribedTo: true,
        },
      });
      return ids.map((id) =>
        res.filter((user) => user.userSubscribedTo[0].authorId === id));
    });
    context.dataLoaders.set('subscribedToUser', dataLoader);
  }
  return dataLoader;
}