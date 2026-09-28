import { asyncIteratorObject } from '@orpc/contract';
import { oc } from '@orpc/contract';
import { z } from 'zod';

export const ChatItemSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  name: z.string().optional(),
  content: z.string(),
  timestamp: z.date(),
});

export const ChatListSchema = z.array(ChatItemSchema);

// 定义流式输出的事件类型
export const ChatStreamEventSchema = z.discriminatedUnion('type', [
  // 文本增量：最核心的事件
  z.object({
    type: z.literal('text-delta'),
    text: z.string(),
  }),
  // 结束信号
  z.object({
    type: z.literal('finish'),
    reason: z.string().optional(),
  }),
]);

export const chatStream = oc
  .input(
    z.object({
      modelProviderId: z.string(),
      chatList: ChatListSchema,
    }),
  )
  .output(asyncIteratorObject(ChatStreamEventSchema));

export const chat = {
  chatStream: chatStream,
};
