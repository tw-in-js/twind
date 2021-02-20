<script setup>
import { defineProps } from 'vue'
defineProps({
  module: { type: String, default: null },
})

/** 
 * Potential issues with this iframe approach:
 * 1. I am having a hard time figuring out how to get the iframe to take up the full width it needs.
 * So, the height is set to 100vh, which forces the user to scroll the inner container.
 * 2. Although we can navigate the user from the sidebar, there is no way that I know of to stay in sync if the 
 * user uses the hamburger menu navigation within the iframe.
*/

</script>
<template ref="wrapper">
<Quote>You are viewing an embedded Typedoc site. Please make sure to scroll the inner container to see all contents. </Quote>
  <iframe :src="`/typedoc/modules/` + module + `.html`" alt="Twind API Reference" class="flex w-full min-h-screen border-none shadow-md flex-1"/>
</template>