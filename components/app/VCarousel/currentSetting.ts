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
  const setting = computed(() => {
    let setting: T;
    const currentOptions = toValue(options);
    const currentBreakpoint = toValue(currentBreakpoints);
    if (typeof currentOptions === 'object') {
      const breakpoint = currentBreakpoint
        .filter((breakpoint) => breakpoint in currentOptions)
        .pop();
      setting = currentOptions[breakpoint || 'xs'];
    } else {
      setting = currentOptions;
    }
    return format(setting || defaultOption);
  });
  return { setting };
}