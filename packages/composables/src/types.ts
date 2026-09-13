/** 标准消息格式 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** 流式回调上下文 */
export interface StreamCallbacks {
  /** 收到文本增量时触发 */
  onChunk: (chunk: string) => void;
  /** 流正常结束时触发（可选，用于获取 token 统计等元数据） */
  onComplete?: () => void;
  /** 发生错误时触发 */
  onError: (error: Error) => void;
}

/**
 * 聊天传输层接口
 * 这是 useChat 与底层实现之间的唯一契约
 */
export interface ChatTransport {
  /**
   * 发起流式请求
   * @param messages - 当前完整对话历史
   * @param callbacks - 流式事件回调
   * @param signal - AbortSignal，用于中断请求
   */
  stream(messages: ChatMessage[], callbacks: StreamCallbacks, signal: AbortSignal): Promise<void>;
}

/** useChat 配置项 */
export interface UseChatOptions {
  /** 注入的传输层实现 */
  transport: ChatTransport;
  /** 初始消息 */
  initialMessages?: ChatMessage[];
}
