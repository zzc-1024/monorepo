import type { ChatMessage, ChatTransport, StreamCallbacks } from '@repo/composables';

import type { ORPCClient } from '@/client';

/** BackendTransport 配置项 */
export interface BackendTransportOptions {
  /** 类型安全的 oRPC 客户端实例，由使用方创建并注入 */
  client: ORPCClient;
  /** 使用的模型提供方 id（对应后端数据库中的记录） */
  modelProviderId: string;
}

/**
 * 通过后端 API 实现的 transport
 *
 * 把 useChat 的流式请求转发到后端 oRPC 接口（chat.chatStream），
 * 由后端持有 API Key 并调用真正的模型服务，避免密钥暴露在前端。
 */
export class BackendTransport implements ChatTransport {
  private client: ORPCClient;
  private modelProviderId: string;

  constructor(options: BackendTransportOptions) {
    const { client, modelProviderId } = options;

    this.client = client;
    this.modelProviderId = modelProviderId;
  }

  async stream(
    messages: ChatMessage[],
    callbacks: StreamCallbacks,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      // 把 useChat 的 ChatMessage 转换为后端契约要求的 ChatItem（补 timestamp）
      const chatList = messages.map(({ role, content }) => ({
        role,
        content,
        timestamp: new Date(),
      }));

      const stream = await this.client.chat.chatStream(
        { modelProviderId: this.modelProviderId, chatList },
        { signal },
      );

      for await (const event of stream) {
        if (event.type === 'text-delta') {
          callbacks.onChunk(event.text);
        } else if (event.type === 'finish') {
          // reason 为 'stop' 表示正常结束，其余视为错误原因
          if (event.reason && event.reason !== 'stop') {
            callbacks.onError(new Error(event.reason));
            return;
          }
        }
      }

      callbacks.onComplete?.();
    } catch (err) {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
