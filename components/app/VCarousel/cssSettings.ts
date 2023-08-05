import { computed, toValue } from 'vue';
import { Breakpoint } from '~/utils/breakpoints';

type OptionName = 'capacity' | 'padding' | 'getters' | 'speedStep' | 'speedPage';
type OptionValue = string | number | undefined;
type Options = Partial<Record<OptionName, OptionValue | Partial<Record<Breakpoint, OptionValue>>>>;

const getCssVariable = ({
  optionName,
  optionValue,
  breakpoint = 'xs',
} : {
  optionName: OptionName,
  optionValue: OptionValue,
  breakpoint?: Breakpoint
}) => {
  const name = optionName.toLowerCase();
  const point = (breakpoint === 'xs')
    ? ''
    : `-${breakpoint}`;
  const variableName = `--${name}${point}`;
  let variableValue = optionValue;
  if (Number(optionValue)) {
    if (['padding', 'getters'].includes(optionName)) {
      variableValue = `${optionValue}px`;
    } else if (['speedStep', 'speedPage'].includes(optionName)) {
      variableValue = `${optionValue}s`;
    }
  }
  return {
    name: variableName,
    value: variableValue,
  };
}
const getCssSettings = (options : Options) => {
  const styles : Record<string, OptionValue> = {};
  const entries = Object.entries(options);
  entries.forEach(([key, option]) => {
    if (!option) return;
    const optionName = key as OptionName;
    if (typeof option === 'object') {
      const responsiveOptions = Object.entries(option);
      responsiveOptions.forEach(([key, optionValue]) => {
        if (!optionValue) return;
        const breakpoint = key as Breakpoint;
        const { name, value } = getCssVariable({ optionName, optionValue, breakpoint });
        styles[name] = value;
      });
    } else {
      const optionValue = option;
      const { name, value } = getCssVariable({ optionName, optionValue });
      styles[name] = value;
    }
  })
  return styles;
}

/**
 * Reactive style object of css vars for carousel settings.
 * @param options - Carousel css options.
 */
export function useCssSettings(options: MaybeRefOrGetter<Options>) {
  const styles = computed(() => getCssSettings(toValue(options)));
  return {
    styles,
  }
}
