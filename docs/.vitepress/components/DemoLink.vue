<script setup>
import { defineProps } from 'vue'
defineProps({
  href: { type: String, default: null },
})
</script>

<template>
  <a :href="href" target="_blank" rel="noreferrer noopener" class="demo-link">
    Live Demo
    <svg
      class="demo-icon"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      data-icon="external-link"
      viewBox="0 0 32 40"
      x="0px"
      y="0px"
    >
      <path
        d="M32 0l-8 1 2.438 2.438-9.5 9.5-1.063 1.063 2.125 2.125 1.063-1.063 9.5-9.5 2.438 2.438 1-8zm-30 3c-.483 0-1.047.172-1.438.563-.391.391-.563.954-.563 1.438v25c0 .483.172 1.047.563 1.438.391.391.954.563 1.438.563h25c.483 0 1.047-.172 1.438-.563.391-.391.563-.954.563-1.438v-15h-3v14h-23v-23h15v-3h-16z"
      />
    </svg>
  </a>
</template>
