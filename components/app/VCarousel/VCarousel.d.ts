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
  page?: string | number
  items?: Array<object>
  id?: string
  draggable?: boolean | Partial<Record<Breakpoint, boolean>>
  padding?: string | Partial<Record<Breakpoint, string>>
  getters?: string | Partial<Record<Breakpoint, string>>
  capacity?: string | number | Partial<Record<Breakpoint, string | number>>
  speedSteo?: string | Partial<Record<Breakpoint, string>>
  speedPage?: string | Partial<Record<Breakpoint, string>>
}
export type Emits = {
  'update:modelValue': [value: string | number],
  'update:page': [value: string | number],
}