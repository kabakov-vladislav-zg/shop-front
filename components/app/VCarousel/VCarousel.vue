<script
  setup
  lang="ts"
>
import { withDefaults, computed, watch, watchEffect, ref, toValue } from 'vue';
import { Props, Emits } from './VCarousel';
import { useBindings } from './bindings';
import { useCapacity } from './capacity';
import { usePages } from './pages';
import { useNavigation } from './navigation';

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  page: 0,
  id: 'id',
  capacity: 1,
  items: () => [],
});
const emit = defineEmits<Emits>()
const settings = computed(() => {
  const { modelValue, page, id, items, ...settings } = props;
  return settings;
});
const cssSettings = useBindings(settings);
const itemsCount = computed(() => props.items.length);
const capacitySetting = computed(() => settings.value.capacity);
const capacity = useCapacity(capacitySetting);
const pages = usePages(capacitySetting, itemsCount);
const externalStep = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
const externalPage = computed({
  get() {
    return props.page;
  },
  set(value) {
    emit('update:page', value);
  }
});
const { step, maxStep, setStep, page, maxPage, setPage } = useNavigation(itemsCount, capacity);
watch(externalStep, (current) => {
  const { step, page } = setStep(current);
  externalStep.value = step;
  externalPage.value = page;
}, { immediate: true });
watch(externalPage, (current) => {
  const { step, page } = setPage(current);
  externalStep.value = step;
  externalPage.value = page;
}, { immediate: true });
watch(step, (current) => {
  externalStep.value = current;
});
watch(page, (current) => {
  externalPage.value = current;
});
</script>

<template>
  <section
    :style="{ '--step' : step }"
    v-bind="cssSettings"
    class="VCarousel"
  >
    <slot
      name="nav"
      v-bind="{ step, setStep, maxStep, items }"
    >

      <div class="">
        <button
          @click="setStep(step - 1)"
          class="mr-3"
        >
          назад
        </button>
        <button
          @click="setStep(step + 1)"
        >
          вперед
        </button>
        <div>
          step: {{ step }}
        </div>
        <div>
          maxStep: {{ maxStep }}
        </div>
        <div>
          page: {{ page }}
        </div>
        <div>
          maxPage: {{ maxPage }}
        </div>
        <div class="flex">
          <div
            v-for="(page, i) in pages"
            :key="i"
            :class="page"
            class="p-4 mx-1 bg-red-400"
            @click="setPage(i)"
          ></div>
        </div>
      </div>
    </slot>
    <div
      class="VCarousel-Stage"
    >
      <div class="VCarousel-BackStage">
        <div
          class="VCarousel-FrontStage"
        >
          <slot name="items">
            <div
              v-for="item in items"
              :key="item[id]"
              class="VCarousel-Item"
            >
              <slot :item="item" />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
$screens: (
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px"
);
$settings: "padding", "getters", "capacity", "speed", "justify", ;

@each $breakpoint, $minWidth in $screens {
  @media (min-width: $minWidth) {
    @each $setting in $settings {
      [style*="--#{$setting}-#{$breakpoint}"] {
        --#{$setting}: var(--#{$setting}-#{$breakpoint})!important;
      }
    }
  }
}
</style>

<style>
.VCarousel {
  --step: 0;
  --padding: 0;
  --getters: 16px;
  --capacity: 3;
  --speed: 0.5s;
  --justify: flex-start;
  display: flex;
  flex-wrap: wrap;
}

.VCarousel-Stage {
  overflow-x: hidden;
  width: 100%;
  padding: var(--padding);
  display: grid;
  justify-items: var(--justify);
}

.VCarousel-BackStage {
  --visible-items-width: calc(100% - var(--getters) * (var(--capacity) - 1));
  width: calc(var(--visible-items-width) / var(--capacity));
  min-width: 0;
  max-width: 100%;
}

.VCarousel-FrontStage {
  --shift: calc(-1 * var(--step) * (100% + var(--getters)));
  transform: translate3d(var(--shift), 0, 0);
  transition: var(--speed) linear;
  width: 100%;
  overflow: visible;
  display: flex;
  position: relative;

  &.isDraggable {
    touch-action: pan-y pinch-zoom;
  }

  &.isDragged {
    transition: none;
  }
}

.VCarousel-Item {
  flex-shrink: 0;
  width: 100%;
  margin-right: var(--getters);
}
</style>
