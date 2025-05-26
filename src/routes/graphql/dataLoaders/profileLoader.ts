import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const ProfileLoader = (context: Context) => {
  let dataLoader = context.dataLoaders.get('profile');
  if (!dataLoader) {
    dataLoader = new DataLoader(async (ids: readonly string[]) => {
      const res =  await context.prisma.profile.findMany({
        where: { userId: { in: [...ids] } },
      });
      return ids.map(id => res.find(profile => profile.userId === id) || null);
    });
    context.dataLoaders.set('profile', dataLoader);
  }
  return dataLoader;
}