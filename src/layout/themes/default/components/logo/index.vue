<script setup lang="ts"></script>

<template>
  <div class="gc-logo group flex cursor-pointer items-center justify-start gap-3">
    <div class="relative transition-all duration-300 group-hover:rotate-[15deg] hover:!rotate-0">
      <img class="w-[50px] animate-[pulse_6s_ease-in-out_infinite]" src="/logo.svg" alt="lightChat" />
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 mix-blend-soft-light"
      ></div>
    </div>
    <h2
      class="cursor-default bg-gradient-to-r from-blue-500 via-purple-400 to-indigo-600 bg-clip-text text-xl font-bold text-transparent"
    >
      lightChat
    </h2>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.02);
  }
}

.gc-logo:hover {
  gap: 15px;
}

@media (max-width: 768px) {
  .gc-logo img {
    width: 40px;
  }
  .gc-logo h2 {
    font-size: 18px;
  }
}
</style>
