import { computed } from 'vue';
import { Breakpoint, breakpoints } from '~/utils/breakpoints';

type Options = boolean | Partial<Record<Breakpoint, boolean>>;

const getOptionsEntries = (options: Options) => {
  const optionsEntries : [Breakpoint, boolean][] = [];
  if (typeof options === 'object') {
    const optionsEntries = Object.entries(options);
    optionsEntries.forEach(([breakpoint, option]) => {
      optionsEntries.push([
        breakpoint as Breakpoint,
        option,
      ]);
    })
  } else {
    optionsEntries.push([
      'xs',
      options,
    ]);
  }
  return optionsEntries;
};
const getClassList = (options: Partial<Record<Breakpoint, boolean>>) => {
  const points = breakpoints.keys.filter((point) => point in options);
  const states: boolean[] = new Array(points.length).fill(true);
  const classes: string[] = ['VCarousel-Controls'];
  points.forEach((point, index) => {
    const option = options[point] as boolean;
    const currentStatus = (index === 0)
      ? true
      : states[index - 1];
    if (currentStatus !== option) {
      const className = option ? 'isVisible' : 'isHidden';
      const classPoint = point === 'xs' ? '' : `-${point}`;
      classes.push(className + classPoint);
    }
    states[index] = option;
  });
  return classes;
};

export function useControls(options: MaybeRefOrGetter<Options>) {
  const optionsEntries = computed(() => getOptionsEntries(toValue(options)));
  const isShow = computed(() => !!optionsEntries.value.find(([, option]) => option));
  const classes = computed(() => {
    if (!isShow.value) return [];
    return getClassList(Object.fromEntries(optionsEntries.value));
  });
  return {
    isShow,
    classes,
  }
}
