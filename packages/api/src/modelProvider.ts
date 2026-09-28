import { oc } from '@orpc/contract';
import { z } from 'zod';

export const ModelProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  baseUrl: z.string(),
  apiKey: z.string(),
  model: z.string(),
});

export const listModelProvidersContract = oc.output(z.array(ModelProviderSchema));

export const findModelProviderContract = oc
  .input(z.object({ id: z.string() }))
  .output(ModelProviderSchema.optional());

export const createModelProviderContract = oc
  .input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      baseUrl: z.string(),
      apiKey: z.string(),
      model: z.string(),
    }),
  )
  .output(ModelProviderSchema);

export const modelProvider = {
  list: listModelProvidersContract,
  find: findModelProviderContract,
  create: createModelProviderContract,
};
