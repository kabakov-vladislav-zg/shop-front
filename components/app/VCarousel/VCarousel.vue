<script
  setup
  lang="ts"
>
import { Props } from './VCarousel';
import { useBindings } from './bindings';
import { useSettings } from './settings';

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  id: 'id',
  items: () => [],
});
const settings = useSettings(props);
const bindings = useBindings(settings);
</script>

<template>
  <section
    :style="{ '--count' : value }"
    v-bind="bindings"
    class="VCarousel"
  >
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
  --count: 0;
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
  --shift: calc(-1 * var(--count) * (100% + var(--getters)));
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
