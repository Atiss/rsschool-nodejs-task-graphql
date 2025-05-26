import { Context } from '../types/context.js';
import DataLoader from 'dataloader';

export const PostLoader = (context: Context) => {
  let dataLoader = context.dataLoaders.get('posts');
  if (!dataLoader) {
    dataLoader = new DataLoader(async (ids: readonly string[]) => {
      const res =  await context.prisma.post.findMany({
        where: { authorId: { in: [...ids] } },
      });
      return ids.map((id) =>
        res.filter((post) => post.authorId === id));
    });
    context.dataLoaders.set('posts', dataLoader);
  }
  return dataLoader;
}