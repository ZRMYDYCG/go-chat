<script setup lang="ts">
import CreateNote from './components/create-note.vue'
import NoteDetail from './components/note-detail.vue'
import NoteList from './components/note-list.vue'
</script>

<template>
  <NoteList />
  <NoteDetail />
  <CreateNote v-if="false" />
</template>

<style scoped></style>
