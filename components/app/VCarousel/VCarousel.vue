<script
  setup
  lang="ts"
>
import { computed, watch, ref } from 'vue';
import { useCssSettings } from './cssSettings';
import { useControls } from './controls';
import { useDots } from './dots';
import { useCurrentSetting } from './currentSetting';
import { useNavigation } from './navigation';
import { useDragAndDrop } from './dragAndDrop';
import { Breakpoint, breakpoints } from '~/utils/breakpoints';

type ControlsOption = boolean | Partial<Record<Breakpoint, boolean>>;
type SettingsOption = string | number | undefined | Partial<Record<Breakpoint, string | number | undefined>>;
type Props = {
  items?: Array<object>
  modelValue?: string | number
  page?: string | number
  id?: string
  draggable?: ControlsOption
  dots?: ControlsOption
  nav?: ControlsOption
  capacity?: SettingsOption
  padding?: SettingsOption
  getters?: SettingsOption
  speedStep?: SettingsOption
  speedPage?: SettingsOption
};
type Emit = {
  (e: 'update:modelValue', value: number): void
  (e: 'update:page', value: number): void
};
const defaultProps = {
  items: () => [],
  modelValue: 0,
  page: 0,
  draggable: true,
  dots: true,
  nav: true,
  capacity: 1,
};
const props = withDefaults(defineProps<Props>(), defaultProps);
const emit = defineEmits<Emit>();

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
const { current: capacityCurrent } = useCurrentSetting({
  options: capacityOptions,
  defaultOption: defaultProps.capacity,
  currentBreakpoints: currentBreakpoints,
  format: (value) => Number(value),
});
const {
  step,
  maxStep,
  setStep,
  page,
  maxPage,
  setPage,
  classes: navigationClasses,
} = useNavigation({ itemsCount, capacityCurrent });

const externalStep = useVModel(props, 'modelValue', emit);
const externalPage = useVModel(props, 'page', emit);

watch(externalStep, (current) => {
  if (current === step.value) return;
  setStep(current);
  externalStep.value = step.value;
  externalPage.value = page.value;
}, { immediate: true });
watch(externalPage, (current) => {
  if (current === page.value) return;
  setPage(current);
  externalStep.value = step.value;
  externalPage.value = page.value;
}, { immediate: true });
watch(step, (current) => {
  if (current === externalStep.value) return;
  externalStep.value = current;
});
watch(page, (current) => {
  if (current === externalPage.value) return;
  externalPage.value = current;
});

// const stageBack = ref<HTMLElement | null>(null);
// const stageFront = ref<HTMLElement | null>(null);
// const stageItems = ref<Array<HTMLElement> | []>([]);
// const {
//   events: dragEvents,
//   classes: dragClasses,
//   styles: dragStyles,
//   step: dragStep,
// } = useDragAndDrop({
//   stageBack,
//   stageFront,
//   stageItems,
//   currentCapacity,
// });
// watch(dragStep, (value) => {
//   setStep(value);
// });
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
          <div
            v-if="isShowDots"
            :class="dotsControlsClasses"
          >
            <button
              v-for="(dot, i) in dots"
              :key="i"
              :class="dot"
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
    >
      <div
        ref="stageBack"
        class="VCarousel-BackStage"
      >
        <div
          ref="stageFront"
          :style="{
            '--step' : step,
          }"
          :class="{
            ...navigationClasses,
          }"
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

  &.isDraggable {
    touch-action: manipulation;
  }

  &.isDragged {
    transition: none;
  }
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
