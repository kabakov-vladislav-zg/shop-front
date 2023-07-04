<script
  setup
  lang="ts"
>
import { useBreakpoints } from '~/composables/breakpoints';

const { isXlOnly } = useBreakpoints();
</script>

<template>
  <div class="text-red-400">
    привет мир {{ isXlOnly }}
  </div>
</template>

<style scoped>

</style>
