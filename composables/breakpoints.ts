import { ref, readonly, computed } from 'vue';
import type { Ref } from 'vue';
import { useSustainableListener } from './events';

type Breakpoints =
  | 'isSm'
  | 'isMd'
  | 'isLg'
  | 'isXl'
  | 'is2xl'
type Ranges =
  | 'isXsOnly'
  | 'isSmOnly'
  | 'isMdOnly'
  | 'isLgOnly'
  | 'isXlOnly';
const breakpoints : Array<[Breakpoints, string]> = [
  ['isSm', '640px'],
  ['isMd', '768px'],
  ['isLg', '1024px'],
  ['isXl', '1280px'],
  ['is2xl', '1536px'],
];
type Data = Record<Breakpoints | Ranges, Ref<boolean>>;
const data: Data = {
  isSm: ref(false),
  isMd: ref(false),
  isLg: ref(false),
  isXl: ref(false),
  is2xl: ref(false),
  isXsOnly: computed(() => !data.isSm.value),
  isSmOnly: computed(() => data.isSm.value && !data.isMd.value),
  isMdOnly: computed(() => data.isMd.value && !data.isLg.value),
  isLgOnly: computed(() => data.isLg.value && !data.isXl.value),
  isXlOnly: computed(() => data.isXl.value && !data.is2xl.value),
};
type ReadonlyData = Record<Breakpoints | Ranges, Readonly<Ref<boolean>>>;
const readonlyData : ReadonlyData = {
  isSm: readonly(data.isSm),
  isMd: readonly(data.isMd),
  isLg: readonly(data.isLg),
  isXl: readonly(data.isXl),
  is2xl: readonly(data.is2xl),
  isXsOnly: readonly(data.isXsOnly),
  isSmOnly: readonly(data.isSmOnly),
  isMdOnly: readonly(data.isMdOnly),
  isLgOnly: readonly(data.isLgOnly),
  isXlOnly: readonly(data.isXlOnly),
};
const listeners : Array<() => void> = [];
breakpoints.forEach(([name, value]) => {
  const listener = useSustainableListener({
    getTarget() {
      return window.matchMedia(`(min-width: ${value})`);
    },
    callback({ matches }) {
      data[name].value = matches;
    },
    init(target, callback) {
      callback(target);
    },
    event: 'change',
  });
  listeners.push(listener);
});
export function useBreakpoints() {
  listeners.forEach((listener) => listener());
  return readonlyData;
}
export const screens = Object.fromEntries(breakpoints.map(([name, value]) => [
  name.slice(2)[0].toLowerCase(),
  value,
]));
