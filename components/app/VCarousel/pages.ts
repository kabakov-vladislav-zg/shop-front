import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue';
import { SettingValue, ResponsiveSettingValue, Breakpoint } from './VCarousel';

export function usePages(capacity : ComputedRef<SettingValue>, itemsCount : ComputedRef<number>) : Array<string> {
  if (typeof capacity.value === 'object') {
    const pagesEntries = Object.entries(toValue(capacity)).map(([bp, capacity]) => {
      return [bp, Math.ceil(toValue(itemsCount) / Number(capacity))];
    });
    const pages = Object.fromEntries(pagesEntries);
    let breakpoints = Object.entries({ xs: 0, ...breakpointsTailwind });
    breakpoints = breakpoints.filter(([breakpoint]) => {
      return pagesEntries.find(([key]) => key === breakpoint);
    });
    breakpoints.sort(([, a], [, b]) => a - b);
    breakpoints = breakpoints.map(([key]) => key);
    const maxPages = Math.max(...pagesEntries.map(([, value]) => Number(value)));
    const states = new Array(maxPages).fill(true);
    const result = new Array(maxPages).fill('');
    for (let i = 0; i < breakpoints.length; i++) {
      const pagesLength = pages[breakpoints[i]];
      for (let j = 0; j < states.length; j++) {
        const state = j < pagesLength;
        if (states[j] !== state) {
          const className = `${state ? 'isDisplay' : 'isNone'}:${breakpoints[i]}`;
          if (typeof result[j] !== 'object') {
            result[j] = [];
          }
          result[j].push(className)
          states[j] = state;
        }
      }
    }
    return result;
  } else {

  }
}