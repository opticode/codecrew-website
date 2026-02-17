<template>
  <div class="md:hidden">
    <button
      @click="open = !open"
      class="relative z-50 p-2 text-white"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      aria-expanded="false"
      :aria-expanded="open"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path v-if="!open" d="M4 6h16M4 12h16M4 18h16" />
        <path v-else d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <Transition name="menu">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-xl tracking-[0.15em] text-white hover:text-[#00e5ff] transition-colors"
          style="font-family: 'Syne Variable', sans-serif"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  links: { href: string; label: string }[];
}>();

const open = ref(false);
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.25s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
