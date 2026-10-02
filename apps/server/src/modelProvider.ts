import { implement } from '@orpc/server';
import { contract } from '@repo/api';
import { v4 as uuidv4 } from 'uuid';

import { fakeDB } from './database/modelProviderModel.js';

const os = implement(contract);

export const listModelProviders = os.modelProvider.list.handler(async () => {
  // replace with your database query
  return fakeDB;
});

export const findModelProvider = os.modelProvider.find.handler(async ({ input }) => {
  // replace with your database query
  return fakeDB.find((provider) => provider.id === input.id);
});

export const createModelProvider = os.modelProvider.create.handler(async ({ input }) => {
  // replace with your database insert
  const newProvider = { id: uuidv4(), ...input };
  fakeDB.push(newProvider);
  return newProvider;
});
export const modelProviderRouter = {
  list: listModelProviders,
  find: findModelProvider,
  create: createModelProvider,
};
