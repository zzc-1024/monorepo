<script setup lang="ts">
import { ChatPanel } from '@repo/components';
import { t } from '@repo/i18n';
</script>

<template>
  <ChatPanel style="height: 100dvh"></ChatPanel>
  {{ t('greeting', { name: 'John' }) }}
</template>

<style scoped></style>
