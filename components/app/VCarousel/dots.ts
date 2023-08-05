import { computed } from 'vue';
import { Breakpoint, breakpoints } from '~/utils/breakpoints';

type CapacityOptions = string | number | undefined | Partial<Record<Breakpoint, string | number | undefined>>;

const getPagesOptionsEntries = (capacityOptions: CapacityOptions, itemsCount: number) => {
  const pagesOptionsEntries : [Breakpoint, number][] = [];
  if (typeof capacityOptions === 'object') {
    const optionsEntries = Object.entries(capacityOptions);
    optionsEntries.forEach(([breakpoint, capacity]) => {
      const option = Number(capacity);
      if (!option) return;
      pagesOptionsEntries.push([
        breakpoint as Breakpoint,
        Math.ceil(itemsCount / option),
      ]);
    })
  } else {
    const option = Number(capacityOptions);
    if (option) {
      pagesOptionsEntries.push([
        'xs',
        Math.ceil(itemsCount / option),
      ]);
    }
  }
  return pagesOptionsEntries;
};
const getDots = (max: number, options: Partial<Record<Breakpoint, number>>) => {
  const states: boolean[] = new Array(max).fill(true);
  const result: string[][] = new Array(max).fill(1).map(() => ['VCarousel-Controls']);
  const points = breakpoints.keys.filter((point) => point in options);
  points.forEach((point) => {
    const pagesCount = options[point] as number;
    result.forEach((page, index) => {
      const state = index < pagesCount;
      if (states[index] === state) return;
      const className = state ? 'isVisible' : 'isHidden';
      const classPoint = point === 'xs' ? '' : `-${point}`;
      page.push(className + classPoint);
      states[index] = state;
    });
  });
  return result;
};

export function useDots(
  isShowDots: MaybeRefOrGetter<boolean>,
  capacityOptions: MaybeRefOrGetter<CapacityOptions>,
  itemsCount : MaybeRefOrGetter<number>
) {
  const dots = computed(() => {
    if (!toValue(isShowDots)) return [];
    const pagesOptionsEntries = getPagesOptionsEntries(
      toValue(capacityOptions),
      toValue(itemsCount),
    );
    const pages = pagesOptionsEntries.map(([, value]) => value);
    const max = Math.max(...pages);
    const options = Object.fromEntries(pagesOptionsEntries);
    return getDots(max, options);
  });
  return { dots };
}