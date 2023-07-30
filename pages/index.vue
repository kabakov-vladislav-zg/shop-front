<script
  setup
  lang="ts"
>
  import UiCarousel from '~/components/app/VCarousel/VCarousel.vue';

  const items : Array<{ bg: string }> = [
    {
      bg: 'bg-red-100',
    },
    {
      bg: 'bg-red-200',
    },
    {
      bg: 'bg-red-300',
    },
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-100',
    },
    {
      bg: 'bg-blue-200',
    },
    {
      bg: 'bg-blue-300',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-100',
    },
    {
      bg: 'bg-green-200',
    },
    {
      bg: 'bg-green-300',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-100',
    },
    {
      bg: 'bg-amber-200',
    },
    {
      bg: 'bg-amber-300',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-100',
    },
    {
      bg: 'bg-cyan-200',
    },
    {
      bg: 'bg-cyan-300',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-100',
    },
    {
      bg: 'bg-fuchsia-200',
    },
    {
      bg: 'bg-fuchsia-300',
    },
    {
      bg: 'bg-fuchsia-400',
    },
    {
      bg: 'bg-zinc-100',
    },
    {
      bg: 'bg-zinc-200',
    },
    {
      bg: 'bg-zinc-300',
    },
    {
      bg: 'bg-zinc-400',
    },
    {
      bg: 'bg-red-200',
    },
    {
      bg: 'bg-red-300',
    },
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-100',
    },
    {
      bg: 'bg-blue-200',
    },
    {
      bg: 'bg-blue-300',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-100',
    },
    {
      bg: 'bg-green-200',
    },
    {
      bg: 'bg-green-300',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-100',
    },
    {
      bg: 'bg-amber-200',
    },
    {
      bg: 'bg-amber-300',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-100',
    },
    {
      bg: 'bg-cyan-200',
    },
    {
      bg: 'bg-cyan-300',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-100',
    },
    {
      bg: 'bg-fuchsia-200',
    },
    {
      bg: 'bg-fuchsia-300',
    },
    {
      bg: 'bg-fuchsia-400',
    },
    {
      bg: 'bg-zinc-100',
    },
    {
      bg: 'bg-zinc-200',
    },
    {
      bg: 'bg-zinc-300',
    },
    {
      bg: 'bg-zinc-400',
    },
    {
      bg: 'bg-red-200',
    },
    {
      bg: 'bg-red-300',
    },
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-100',
    },
    {
      bg: 'bg-blue-200',
    },
    {
      bg: 'bg-blue-300',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-100',
    },
    {
      bg: 'bg-green-200',
    },
    {
      bg: 'bg-green-300',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-100',
    },
    {
      bg: 'bg-amber-200',
    },
    {
      bg: 'bg-amber-300',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-100',
    },
    {
      bg: 'bg-cyan-200',
    },
    {
      bg: 'bg-cyan-300',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-100',
    },
    {
      bg: 'bg-fuchsia-200',
    },
    {
      bg: 'bg-fuchsia-300',
    },
    {
      bg: 'bg-fuchsia-400',
    },
    {
      bg: 'bg-zinc-100',
    },
    {
      bg: 'bg-zinc-200',
    },
    {
      bg: 'bg-zinc-300',
    },
    {
      bg: 'bg-zinc-400',
    },
    {
      bg: 'bg-red-200',
    },
    {
      bg: 'bg-red-300',
    },
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-100',
    },
    {
      bg: 'bg-blue-200',
    },
    {
      bg: 'bg-blue-300',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-100',
    },
    {
      bg: 'bg-green-200',
    },
    {
      bg: 'bg-green-300',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-100',
    },
    {
      bg: 'bg-amber-200',
    },
    {
      bg: 'bg-amber-300',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-100',
    },
    {
      bg: 'bg-cyan-200',
    },
    {
      bg: 'bg-cyan-300',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-100',
    },
    {
      bg: 'bg-fuchsia-200',
    },
    {
      bg: 'bg-fuchsia-300',
    },
    {
      bg: 'bg-fuchsia-400',
    },
    {
      bg: 'bg-zinc-100',
    },
    {
      bg: 'bg-zinc-200',
    },
    {
      bg: 'bg-zinc-300',
    },
    {
      bg: 'bg-zinc-400',
    },
    {
      bg: 'bg-red-200',
    },
    {
      bg: 'bg-red-300',
    },
    {
      bg: 'bg-red-400',
    },
    {
      bg: 'bg-blue-100',
    },
    {
      bg: 'bg-blue-200',
    },
    {
      bg: 'bg-blue-300',
    },
    {
      bg: 'bg-blue-400',
    },
    {
      bg: 'bg-green-100',
    },
    {
      bg: 'bg-green-200',
    },
    {
      bg: 'bg-green-300',
    },
    {
      bg: 'bg-green-400',
    },
    {
      bg: 'bg-amber-100',
    },
    {
      bg: 'bg-amber-200',
    },
    {
      bg: 'bg-amber-300',
    },
    {
      bg: 'bg-amber-400',
    },
    {
      bg: 'bg-cyan-100',
    },
    {
      bg: 'bg-cyan-200',
    },
    {
      bg: 'bg-cyan-300',
    },
    {
      bg: 'bg-cyan-400',
    },
    {
      bg: 'bg-fuchsia-100',
    },
    {
      bg: 'bg-fuchsia-200',
    },
    {
      bg: 'bg-fuchsia-300',
    },
    {
      bg: 'bg-fuchsia-400',
    },
    {
      bg: 'bg-zinc-100',
    },
    {
      bg: 'bg-zinc-200',
    },
    {
      bg: 'bg-zinc-300',
    },
    {
      bg: 'bg-zinc-400',
    },
  ];
  const capacity = {
    xs: 1,
    sm: 3,
    md: 4,
    lg: 5,
  }
  const step = ref(0);
  const page = ref(0);
</script>

<template>
  <div class="">
    <UiCarousel
      v-model="step"
      v-model:page="page"
      id="bg"
      :items="items"
      :capacity="capacity"
    >
      <template #default="{ item }">
        <div
          :class="item.bg"
          class="h-[220px] "
        ></div>
      </template>
    </UiCarousel>
    <input v-model="step">
    <div class="">
      <div class="">
        step:
      </div>
      <button
        @click="--step"
        class="mr-3"
      >
        назад
      </button>
      <button
        @click="++step"
      >
        вперед
      </button>
    </div>
    <input v-model="page">
    <div class="">
      <div class="">
        page:
      </div>
      <button
        @click="--page"
        class="mr-3"
      >
        назад
      </button>
      <button
        @click="++page"
      >
        вперед
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
