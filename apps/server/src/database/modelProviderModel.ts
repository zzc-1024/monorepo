import type { ModelProviderSchema } from '@repo/api';
import { z } from 'zod';
export const fakeDB: z.infer<typeof ModelProviderSchema>[] = [
  {
    id: '1',
    name: 'Earth',
    description: 'Our home planet',
    baseUrl: 'https://api.earth.com',
    apiKey: 'key1',
    model: 'model1',
  },
  {
    id: '2',
    name: 'Mars',
    description: 'The red planet',
    baseUrl: 'https://api.mars.com',
    apiKey: 'key2',
    model: 'model2',
  },
];
