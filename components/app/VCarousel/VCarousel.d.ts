export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type Justify = 'flex-start' | 'flex-end' | 'center';
export type ResponsiveSettingValue = Partial<Record<Breakpoint, string | number>>;
export type SettingValue = string | number | ResponsiveSettingValue;
export type SettingName =
  | 'padding'
  | 'getters'
  | 'capacity'
  | 'speed'
  | 'justify';

export type Settings = Partial<Record<SettingName, SettingValue>>
export type Props = {
  modelValue?: string | number
  id?: string | number
  items?: Array<object | Array<any>>
  padding?: SettingValue
  getters?: SettingValue
  capacity?: SettingValue
  speed?: SettingValue
  justify?: SettingValue
}
export type Emits = {
  (e: 'update:modelValue', value: string | number): void
}