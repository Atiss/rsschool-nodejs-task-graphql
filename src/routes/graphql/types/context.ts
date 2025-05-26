import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export interface Context {
  prisma: PrismaClient;
  dataLoaders: Map<string, DataLoader<unknown, unknown>>;
}

export interface ID {
  id: string;
}
