import { computed } from 'vue';
import { Settings } from './UiCarousel';

export function useBindings(settings : ComputedRef<Settings>) {
  const keys = Object.keys(settings);
  const style = computed(() => ({ '--padding' : settings.value.padding }))
  return computed(() => ({ style: { '--padding' : settings.value.padding }}))
}