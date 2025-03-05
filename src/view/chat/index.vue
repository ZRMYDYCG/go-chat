<script lang="ts" setup>
import ChatContent from './components/chat-content.vue'
import ChatHistory from './components/chat-history.vue'
</script>

<template>
  <div class="chat flex">
    <ChatHistory />

    <ChatContent />
  </div>
</template>

<style scoped></style>
