<script setup lang="ts">
import { ChatPanel } from '@repo/components';
import { useChat } from '@repo/composables';

import { BackendTransport } from '@/transports/backendTransport';

const { messages, inputValue, loading, handleSend, abort } = useChat({
  transport: new BackendTransport({ modelProviderId: '1' }),
  initialMessages: [],
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
