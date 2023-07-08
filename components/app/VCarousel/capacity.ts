import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, WritableComputedRef, watch } from 'vue';
import { SettingValue, ResponsiveSettingValue, Breakpoint } from './VCarousel';

function getBreakpointsList(settings : ResponsiveSettingValue) : Record<string, number> {
  const entries = Object.entries(breakpointsTailwind);
  const list = entries.filter(([name]) => {
    return name in settings;
  });
  return Object.fromEntries(list);
}
export function useCapacity(capacity : ComputedRef<SettingValue>) : ComputedRef<number> {
  if (typeof capacity.value === 'object') {
    const settings : ResponsiveSettingValue = capacity.value;
    const breakpointsList = getBreakpointsList(settings);
    const breakpoints = useBreakpoints(breakpointsList);
    // @ts-ignore
    const currents : ComputedRef<Breakpoint[]> = breakpoints.current();
    const currentBreakpoint = computed<Breakpoint>(() => {
      const length = currents.value.length;
      if (length) {
        return currents.value[length - 1];
      } else {
        return 'xs';
      }
    });
    return computed(() => {
      return Number(settings[currentBreakpoint.value]);
    });
  } else {
    return computed(() => Number(capacity.value));
  }
}