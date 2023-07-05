<script
  setup
  lang="ts"
>

</script>

<template>
<section
  class="ui-carousel"
>
  <div
    class="ui-carousel__backstage"
  >
    <div
      class="ui-carousel__frontstage"
    >

    </div>
  </div>
</section>
</template>

<style scoped>
.ui-carousel {
  display: flex;
  flex-wrap: wrap;
}
.ui-carousel__stage {
  overflow-x: hidden;
  width: 100%;
  padding: 0 var(--padding);
  display: grid;
  justify-items: var(--justify);
}
.ui-carousel__stage_draggable .ui-carousel__frontstage {
  touch-action: pan-y pinch-zoom;
}
.ui-carousel__backstage {
  --visible-items-width: calc(100% - var(--getters) * (var(--capacity) - 1));
  width: calc(var(--visible-items-width) / var(--capacity));
  min-width: 0;
  max-width: 100%;
}
.ui-carousel__frontstage {
  --shift: calc(-1 * var(--count) * (100% + var(--getters)));
  transform: translate3d(var(--shift), 0, 0);
  transition: var(--speed) linear;
  width: 100%;
  overflow: visible;
  display: flex;
  position: relative;
}
.ui-carousel__frontstage_dragged {
  transition: none;
}
</style>