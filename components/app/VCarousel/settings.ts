import { computed } from 'vue';
import { Settings, Props } from './VCarousel';

export function useSettings(props : Props) : ComputedRef<Settings> {
  return computed(() => {
    const {
      modelValue,
      id,
      items,
      ...settings
    } = props;
    return settings;
  });
}