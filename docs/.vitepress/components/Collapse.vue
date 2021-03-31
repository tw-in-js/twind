<script setup>
import { defineProps } from 'vue'
defineProps({
  title: { type: String, default: null },
})
</script>

<template>
  <details>
    <summary class="text-base font-medium cursor-pointer">{{ title }}</summary>
    <slot />
  </details>
</template>
