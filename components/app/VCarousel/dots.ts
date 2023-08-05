import { computed } from 'vue';
import { Breakpoint, breakpoints } from '~/utils/breakpoints';

type CapacityOptions = string | number | undefined | Partial<Record<Breakpoint, string | number | undefined>>;

 /**
   * Returns matrix of visible dots quantity per breakpoint.
   */
const getPagesOptionsMatrix = (capacityOptions: CapacityOptions, itemsCount: number) => {
  const pagesOptionsMatrix : [Breakpoint, number][] = [];
  if (typeof capacityOptions === 'object') {
    const optionsEntries = Object.entries(capacityOptions);
    optionsEntries.forEach(([breakpoint, capacity]) => {
      const option = Number(capacity);
      if (!option) return;
      pagesOptionsMatrix.push([
        breakpoint as Breakpoint,
        Math.ceil(itemsCount / option),
      ]);
    })
  } else {
    const option = Number(capacityOptions);
    if (option) {
      pagesOptionsMatrix.push([
        'xs',
        Math.ceil(itemsCount / option),
      ]);
    }
  }
  return pagesOptionsMatrix;
};

/**
  * Returns array of dots classes.
  */
const getDots = (optionsMatrix: [Breakpoint, number][]) => {
  // Calculate maximum possible number of dots.
  const max = Math.max(...optionsMatrix.map(([, value]) => value));
  const options = Object.fromEntries(optionsMatrix);
  // Array of dots css classes.
  const result: string[][] = new Array(max).fill(1).map(() => ['VCarousel-Controls']);
  // Actual visibility statuses for each dot.
  const states: boolean[] = new Array(max).fill(true);
  // Filter out breakpoints with no option.
  const actualBreakpoints = breakpoints.keys.filter((point) => point in options);
  actualBreakpoints.forEach((breakpoint) => {
    // For each breakpoint calculate quantity of visible dots.
    const dotsQuantity = options[breakpoint] as number;
    result.forEach((page, index) => {
      // For each point calculate its visibility status.
      const isVisible = index < dotsQuantity;
      // If visibility status for this dot has not changed - go to the next dot.
      if (states[index] === isVisible) return;
      // Else - update visibility status and set class.
      states[index] = isVisible;
      const className = isVisible ? 'isVisible' : 'isHidden';
      const classPoint = breakpoint === 'xs' ? '' : `-${breakpoint}`;
      page.push(className + classPoint);
    });
  });
  return result;
};

 /**
   * Reactive array of dots classes.
   * @param isShowDots - Whether to display the dots panel.
   * @param capacityOptions - Capacity per breakpoint.
   * @param itemsCount - Carousel items quantity.
   */
export function useDots(
  isShowDots: MaybeRefOrGetter<boolean>,
  capacityOptions: MaybeRefOrGetter<CapacityOptions>,
  itemsCount : MaybeRefOrGetter<number>
) {
  const dots = computed(() => {
    // If there is no dots panel, do no calculations.
    if (!toValue(isShowDots)) return [];
    const pagesOptionsMatrix = getPagesOptionsMatrix(
      toValue(capacityOptions),
      toValue(itemsCount),
    );
    return getDots(pagesOptionsMatrix);
  });
  return { dots };
}