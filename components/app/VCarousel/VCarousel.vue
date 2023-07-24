<script
  setup
  lang="ts"
>
import { withDefaults, computed, watch, watchEffect, ref, toValue } from 'vue';
import { Props, Emits } from './VCarousel';
import { useBindings } from './bindings';
import { useCapacity } from './capacity';
import { useNavigation } from './navigation';
import { usePages } from '~/components/app/VCarousel/pages';
import { useDragAndDrop } from '~/components/app/VCarousel/dragAndDrop';

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  page: 0,
  draggable: true,
  id: 'id',
  capacity: 1,
  items: () => [],
});

const settings = computed(() => {
  const { padding, getters, capacity, speed, justify } = props;
  return { padding, getters, capacity, speed, justify };
});
const bindings = useBindings(settings);

const itemsCount = computed(() => props.items.length);
const capacity = computed(() => settings.value.capacity);
const currentCapacity = useCapacity(capacity);
const {
  step,
  maxStep,
  setStep,
  page,
  maxPage,
  setPage,
} = useNavigation({ itemsCount, currentCapacity });
const pages = usePages(capacity, itemsCount);

const emit = defineEmits<Emits>();
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

const stageBack = ref<HTMLElement | null>(null);
const stageFront = ref<HTMLElement | null>(null);
const stageItems = ref<Array<HTMLElement> | []>([]);
const {
  events: dragAndDropEvents,
  classes: dragAndDropClasses,
  styles: dragAndDropStyles,
  step: dragAndDropStep,
} = useDragAndDrop({
  stageBack,
  stageFront,
  stageItems,
  currentCapacity,
});
watch(dragAndDropStep, (value) => {
  setStep(value);
});
</script>

<template>
  <section
    v-bind="bindings"
    class="VCarousel"
  >
    <div>
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
          <div class="">
            <button
              v-for="(page, i) in pages"
              :key="i"
              :class="page"
              class="mx-1 bg-red-400 px-3"
              @click="setPage(i)"
            >
              {{ i }}
            </button>
          </div>
        </div>
      </slot>
    </div>
    <div
      class="VCarousel-Stage"
      v-on="{ ...dragAndDropEvents }"
    >
      <div
        ref="stageBack"
        class="VCarousel-BackStage"
      >
        <div
          ref="stageFront"
          :style="{
            '--step' : step,
            ...dragAndDropStyles
          }"
          :class="{ ...dragAndDropClasses }"
          class="VCarousel-FrontStage"
        >
          <slot name="items">
            <div
              v-for="item in items"
              :key="item[id]"
              ref="stageItems"
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

.isVisible {
  display: block!important;
}
.isHidden {
  display: none!important;
}
@each $breakpoint, $minWidth in $screens {
  @media (min-width: $minWidth) {
    .isVisible-#{$breakpoint} {
      display: block!important;
    }
    .isHidden-#{$breakpoint} {
      display: none!important;
    }
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
  --padding: 0;
  --getters: 16px;
  --capacity: 3;
  --speed: 0.25s;
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
  --step: 0;
  --shift: calc(-1 * var(--step) * (100% + var(--getters)));
  transform: translate3d(var(--shift), 0, 0);
  transition: transform var(--speed) ease 0s;
  width: 100%;
  overflow: visible;
  display: flex;
  position: relative;

  &.isDraggable {
    touch-action: manipulation;
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
