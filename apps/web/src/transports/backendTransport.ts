import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterContractClient } from '@orpc/contract';
import type { contract } from '@repo/api';
import type { ChatMessage, ChatTransport, StreamCallbacks } from '@repo/composables';

/** BackendTransport 配置项 */
export interface BackendTransportOptions {
  /** 后端 oRPC 服务地址路径（不含 origin），需与后端 handler 的 prefix 一致，默认 '/rpc' */
  baseURL?: `/${string}`;
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
  private client: RouterContractClient<typeof contract>;
  private modelProviderId: string;

  constructor(options: BackendTransportOptions) {
    const { baseURL = '/rpc', modelProviderId } = options;

    const link = new RPCLink({ origin: 'http://127.0.0.1:3000', url: baseURL });
    this.client = createORPCClient(link);
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
