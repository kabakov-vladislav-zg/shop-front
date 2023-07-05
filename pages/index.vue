<script
  setup
  lang="ts"
>
  import UiCarousel from '~/components/ui/UiCarousel/UiCarousel.vue';

  const items = [
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-400',
    },
  ]
  const padding = ref('');
</script>

<template>
  <div class="">
    <UiCarousel
      id="bg"
      :items="items"
      :padding="padding"
    >
      <template
        #item="{ item }"
      >
        <div
          :class="item.bg"
          class="h-[220px]"
        ></div>
      </template>
    </UiCarousel>
    <input v-model="padding">
  </div>
</template>

<style scoped>

</style>
