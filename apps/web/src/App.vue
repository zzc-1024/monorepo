<script setup lang="ts">
import { ChatPanel } from '@repo/components';
import { t } from '@repo/i18n';
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <ChatPanel></ChatPanel>
  {{ t('greeting', { name: 'John' }) }}
</template>

<style scoped></style>
