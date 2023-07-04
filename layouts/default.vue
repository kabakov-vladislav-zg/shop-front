<script
  setup
  lang="ts"
>
import { useBreakpoints } from '~/composables/breakpoints';

const { isXl } = useBreakpoints();
</script>

<template>
  <div class="">
    привет мир {{ isXl }}
    <slot />
  </div>
</template>

<style scoped>

</style>
