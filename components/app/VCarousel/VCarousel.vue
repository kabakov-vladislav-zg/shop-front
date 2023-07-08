<script
  setup
  lang="ts"
>
import { withDefaults, computed } from 'vue';
import { Props, Emits } from './VCarousel';
import { useBindings } from './bindings';
import { usePagination } from './pagination';
import { useCapacity } from './capacity';

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  id: 'id',
  capacity: 1,
  items: () => [],
});
const emits = defineEmits<Emits>()
const settings = computed(() => {
  const { modelValue, id, items, ...settings } = props;
  return settings;
});
const bindings = useBindings(settings);
const value = computed({
  get() {
    return Number(props.modelValue);
  },
  set(value) {
    emits('update:modelValue', value);
  }
});
const length = computed(() => props.items.length);
const capacity = computed(() => props.capacity);
const currentCapacity = useCapacity(capacity);
const { step, count } = usePagination({
  value,
  length,
  capacity: currentCapacity,
});
</script>

<template>
  <section
    :style="{ '--step' : step }"
    v-bind="bindings"
    class="VCarousel"
  >
    <input v-model="count">
    <div
      class="VCarousel-Stage"
    >
      <div class="VCarousel-BackStage">
        <div
          class="VCarousel-FrontStage"
        >
          <slot>
            <div
              v-for="item in items"
              :key="item[id]"
              class="VCarousel-Item"
            >
              <slot
                name="item"
                :item="item"
              ></slot>
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
