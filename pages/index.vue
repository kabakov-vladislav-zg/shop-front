<script
  setup
  lang="ts"
>
  import UiCarousel from '~/components/app/VCarousel/VCarousel.vue';

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
  const capacity = {
    xs: 1,
    sm: 3,
    md: 4,
    lg: 5,
  }
  const count = ref(2);
</script>

<template>
  <div class="">
    <UiCarousel
      v-model="count"
      id="bg"
      :items="items"
      :capacity="capacity"
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
    <input v-model="count">
  </div>
</template>

<style scoped>

</style>
