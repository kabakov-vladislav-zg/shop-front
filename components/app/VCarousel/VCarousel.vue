<script
  setup
  lang="ts"
  generic="Item extends object"
>
import { computed, watch, ref } from 'vue';
import { useCssSettings } from './cssSettings';
import { useControls } from './controls';
import { useDots } from './dots';
import { useCurrentSetting } from './currentSetting';
import { useNavigation } from './navigation';
import { useDrag } from './drag';
import { Breakpoint, breakpoints } from '~/utils/breakpoints';

type Option<T> = T | Partial<Record<Breakpoint, T>>;
const props = withDefaults(defineProps<{
  items?: Item[]
  modelValue?: string | number
  page?: string | number
  key?: keyof Item | ((item: Item) => string | number)
  draggable?: Option<boolean>
  dots?: Option<boolean>
  nav?: Option<boolean>
  capacity?: Option<string | number>
  padding?: Option<string | number>
  getters?: Option<string | number>
  speedStep?: Option<string | number>
  speedPage?: Option<string | number>
}>(), {
  items: () => [],
  modelValue: 0,
  page: 0,
  draggable: true,
  dots: true,
  nav: true,
  capacity: 1,
});
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:page': [value: number]
}>();

const { styles: cssSettings } = useCssSettings(() => {
  const { capacity, padding, getters, speedStep, speedPage } = props;
  return { capacity, padding, getters, speedStep, speedPage };
});

const itemsCount = computed(() => props.items.length);
const capacityOptions = computed(() => props.capacity);

const dotsOptions = computed(() => props.dots);
const {
  isShow: isShowDots,
  classes: dotsControlsClasses,
} = useControls(dotsOptions);

const { dots } = useDots(isShowDots, capacityOptions, itemsCount);

const { current: getCurrentBreakpoints } = useBreakpoints(breakpoints.object);
const currentBreakpoints = getCurrentBreakpoints() as ComputedRef<Breakpoint[]>;

const { setting: capacityCurrent } = useCurrentSetting({
  options: capacityOptions,
  defaultOption: 1,
  currentBreakpoints: currentBreakpoints,
  format: (value) => Number(value),
});

const {
  step,
  maxStep,
  page,
  maxPage,
  isStepTransition,
} = useNavigation({
  itemsCount,
  capacityCurrent,
  externalStep: useVModel(props, 'modelValue', emit),
  externalPage: useVModel(props, 'page', emit),
});

/**
 * Returns value of key attribute (v-for).
 * @param item
 * @returns Can invalid so as not to duplicate validation from vue.
 */
const getKey = (item: Item): any => {
  if (!props.key) return;
  return (typeof props.key === 'function')
    ? props.key(item)
    : item[props.key];
};

const stageFront = ref<HTMLElement | null>(null);
const {
  events: dragEvents,
  styles: dragStyles,
} = useDrag({
  el: stageFront,
  step,
  maxStep,
  itemsCount,
  isDraggable: ref(true),
  isStepTransition,
});
</script>

<template>
  <section
    :style="{
      '--count' : itemsCount,
      ...cssSettings
    }"
    class="VCarousel"
  >
    <div>
      <slot
        name="nav"
        v-bind="{ step, maxStep, items }"
      >
        <div class="">
          <button
            @click="step -= 1"
            class="mr-3"
          >
            назад
          </button>
          <button
            @click="step += 1"
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
          <div
            v-if="isShowDots"
            :class="dotsControlsClasses"
          >
            <button
              v-for="(dot, i) in dots"
              :key="i"
              :class="dot"
              class="mx-1 bg-red-400 px-3"
              @click="page = i"
            >
              {{ i }}
            </button>
          </div>
        </div>
      </slot>
    </div>
    <div
      class="VCarousel-Stage"
    >
      <div
        class="VCarousel-BackStage"
        v-on="{
          ...dragEvents
        }"
      >
        <div
          ref="stageFront"
          :style="{
            '--step' : step,
            ...dragStyles
          }"
          :class="{
            'isTransition-step': isStepTransition,
            'isTransition-page': !isStepTransition,
          }"
          class="VCarousel-FrontStage"
        >
          <slot name="items">
            <div
              v-for="item in items"
              :key="getKey(item)"
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
@use '~/utils/breakpoints';
$settings: "padding", "getters", "capacity", "speedstep", "speedpage";

.VCarousel-Controls {
  &.isVisible {
    display: block!important;
  }
  &.isHidden {
    display: none!important;
  }
}
@each $breakpoint, $minWidth in breakpoints.$screens {
  @media (min-width: $minWidth) {
    .VCarousel-Controls {
      &.isVisible-#{$breakpoint} {
        display: block!important;
      }
      &.isHidden-#{$breakpoint} {
        display: none!important;
      }
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
  --step: 0;
  --count: 0;
  --padding: 0;
  --getters: 16px;
  --capacity: 3;
  --speedstep: 0.25s;
  --speedpage: 1.25s;
  display: flex;
  flex-wrap: wrap;
}

.VCarousel-Stage {
  overflow-x: hidden;
  width: 100%;
}

.VCarousel-BackStage {
  margin-left: calc(-1 * var(--getters));
}

.VCarousel-FrontStage {
  width: calc(100% / var(--capacity) * var(--count));
  transform: translate3d(calc(-1 * var(--step) * 100% / var(--count)), 0, 0);
  transition-property: transform;
  transition-timing-function: ease;
  transition-delay: 0s;
  overflow: visible;
  display: flex;
  position: relative;

  &.isTransition-step {
    transition-duration: var(--speedstep);
  }
  &.isTransition-page {
    transition-duration: var(--speedpage);
  }
}

.VCarousel-Item {
  flex-shrink: 0;
  flex-grow: 1;
  padding-left: var(--getters);
}
</style>
