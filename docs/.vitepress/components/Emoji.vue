<script setup>
import { defineProps } from 'vue'
defineProps({
  alt: { type: String, default: null },
  symbol: { type: String, default: null}
})
</script>

<template>
  <span :alt="alt" class="pr-1 text-lg ">
  {{symbol}}
  </span>
</template>
