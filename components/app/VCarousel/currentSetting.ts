import { computed } from 'vue';
import { Breakpoint } from '~/utils/breakpoints';

export function useCurrentSetting<T>({
    options,
    defaultOption,
    currentBreakpoints,
    format,
  } : {
    options: MaybeRefOrGetter<any | Partial<Record<Breakpoint, any>>>,
    defaultOption: any,
    currentBreakpoints: MaybeRefOrGetter<Breakpoint[]>,
    format: (value: any) => T,
  }
) {
  const current = computed(() => {
    let current: T;
    const currentOptions = toValue(options);
    const currentBreakpoint = toValue(currentBreakpoints);
    if (typeof currentOptions === 'object') {
      const breakpoint = currentBreakpoint
        .filter((breakpoint) => breakpoint in currentOptions)
        .pop();
      current = currentOptions[breakpoint || 'xs'];
    } else {
      current = currentOptions;
    }
    return format(current || defaultOption);
  });
  return { current };
}