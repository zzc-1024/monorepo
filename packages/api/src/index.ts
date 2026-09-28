export * from './modelProvider.js';
export * from './chat.js';
import { chat } from './chat.js';
import { modelProvider } from './modelProvider.js';

export const contract = {
  modelProvider,
  chat,
};
