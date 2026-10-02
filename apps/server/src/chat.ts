// server/chat.ts
import { implement } from '@orpc/server';
import { contract } from '@repo/api';
import OpenAI from 'openai';

import { fakeDB } from './database/modelProviderModel.js';

const os = implement(contract);

// 用 os 实现 contract，并绑定到 chatStream
export const chatStreamImpl = os.chat.chatStream.handler(async function* ({ input, signal }) {
  const { modelProviderId, chatList } = input;

  // 把 oRPC 的 chatList 转换为 OpenAI 需要的 messages
  // 注意：timestamp 字段 OpenAI 不需要，需剔除
  const messages = chatList.map(({ role, content, name }) => ({
    role,
    content,
    ...(name ? { name } : {}),
  }));

  // 解包 modelProvider
  const modelProvider = fakeDB.find((provider) => provider.id === modelProviderId);
  if (modelProvider === undefined) {
    yield {
      type: 'finish',
      reason: 'Invalid model provider id.',
    };
    return;
  }

  // 调用 OpenAI 流式接口，并传入 signal 以支持中断
  const openai = new OpenAI({ baseURL: modelProvider.baseUrl, apiKey: modelProvider.apiKey });
  const stream = await openai.chat.completions.create(
    {
      model: modelProvider.model,
      messages,
      stream: true,
    },
    { signal }, // 客户端断开时自动中止底层请求
  );

  try {
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        // 每次产出一个符合 ChatStreamEventSchema 的事件
        yield { type: 'text-delta' as const, text: delta };
      }
    }

    // 流正常结束，发出 finish 事件
    yield { type: 'finish' as const, reason: 'stop' };
  } catch (err) {
    // 流中途出错，也发一个 finish 让前端收尾
    yield {
      type: 'finish' as const,
      reason: err instanceof Error ? err.message : 'error',
    };
  }
});

// 汇总导出，供 router 使用
export const chatRouter = {
  chatStream: chatStreamImpl,
};
