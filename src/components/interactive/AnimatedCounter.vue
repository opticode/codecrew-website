<template>
  <span ref="el">{{ display }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  target: number;
  suffix?: string;
  duration?: number;
}>();

const el = ref<HTMLElement | null>(null);
const current = ref(0);
const display = ref(`0${props.suffix || ''}`);

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!el.value) return;

  if (prefersReduced) {
    display.value = `${props.target}${props.suffix || ''}`;
    return;
  }

  const obj = { val: 0 };
  gsap.to(obj, {
    val: props.target,
    duration: props.duration || 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el.value,
      start: 'top 85%',
    },
    onUpdate: () => {
      display.value = `${Math.round(obj.val)}${props.suffix || ''}`;
    },
  });
});
</script>
