<script
  setup
  lang="ts"
>
import { Props } from './UiCarousel';
import { useBindings } from './bindings';

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  id: 'id',
  items: () => [],
});
const settings = computed(() => {
  const { value, id, items, ...settings } = props;
  return settings;
});
const bindings = useBindings(settings);
</script>

<template>
  <section
    :style="{ '--count' : value }"
    v-bind="bindings"
    class="ui-crs"
  >
    <div
      class="ui-crs__stage"
    >
      <div class="ui-crs__backstage">
        <div
          class="ui-crs__frontstage"
        >
          <slot>
            <div
              v-for="item in items"
              :key="item[id]"
              class="ui-crs__item"
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

<style>
.ui-crs {
  --count: 0;
  --padding: 0;
  --getters: 16px;
  --capacity: 3;
  --speed: 0.5s;
  --justify: flex-start;
  display: flex;
  flex-wrap: wrap;
}

.ui-crs__stage {
  overflow-x: hidden;
  width: 100%;
  padding: var(--padding);
  display: grid;
  justify-items: var(--justify);
}

.ui-crs__backstage {
  --visible-items-width: calc(100% - var(--getters) * (var(--capacity) - 1));
  width: calc(var(--visible-items-width) / var(--capacity));
  min-width: 0;
  max-width: 100%;
}

.ui-crs__frontstage {
  --shift: calc(-1 * var(--count) * (100% + var(--getters)));
  transform: translate3d(var(--shift), 0, 0);
  transition: var(--speed) linear;
  width: 100%;
  overflow: visible;
  display: flex;
  position: relative;
}

.ui-crs__frontstage_draggable {
  touch-action: pan-y pinch-zoom;
}

.ui-crs__frontstage_dragged {
  transition: none;
}

.ui-crs__item {
  flex-shrink: 0;
  width: 100%;
  margin-right: var(--getters);
}
</style>
