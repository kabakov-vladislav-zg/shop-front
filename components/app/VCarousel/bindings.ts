import { computed } from 'vue';
import { Settings, SettingName, SettingValue, Breakpoint } from './VCarousel';

interface Bindings {
  style: Array<Record<string, SettingValue>>
}

function getStyle(
  name : string,
  value : SettingValue,
  breakpoint : string = ''
) : Record<string, SettingValue> {
  const point = breakpoint
    ? `-${breakpoint}`
    : '';
  const variableName = `--${name}${point}`;
  return {
    [variableName]: value,
  }
}
export function useBindings(settings : ComputedRef<Settings>) : ComputedRef<Bindings> {
  return computed(() => {
    const bindings : Bindings = {
      style: [],
    }
    const entries : Array<[string, SettingValue]> = Object.entries(settings.value);
    entries.forEach(([name, value]) => {
      if (!value) return;
      if (typeof value === 'object') {
        const breakpoints : Array<[string, SettingValue]> = Object.entries(value);
        breakpoints.forEach(([breakpoint, value]) => {
          if (breakpoint === 'xs') {
            bindings.style.push(getStyle(name, value));
          } else {
            bindings.style.push(getStyle(name, value, breakpoint));
          }
        });
      } else {
        bindings.style.push(getStyle(name, value));
      }
    })
    return bindings;
  });
}