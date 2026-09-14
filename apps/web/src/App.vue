<script setup lang="ts">
import { ChatPanel } from '@repo/components';
import { useChat, OpenAITransport } from '@repo/composables';
const { messages, inputValue, loading, handleSend, abort } = useChat({
  transport: new OpenAITransport(
    '<YOUR_OPENAI_API_KEY>',
    'https://api.deepseek.com',
    'deepseek-flash',
  ),
  initialMessages: [{ role: 'system', content: 'You are a helpful assistant.' }],
});
</script>

<template>
  <ChatPanel
    style="height: 100dvh"
    :messages="messages"
    :input-value="inputValue"
    :loading="loading"
    @submit="handleSend"
    @change="(text) => (inputValue = text)"
    @cancel="abort"
  ></ChatPanel>
</template>

<style scoped></style>
