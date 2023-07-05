export type Breakpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type Justify = 'flex-start' | 'flex-end' | 'center';
type Setting = string | Partial<Record<Breakpoints, string>>;

export interface Settings {
  padding?: Setting
  getters?: Setting
  capacity?: Setting
  speed?: Setting
  justify?: Justify | Partial<Record<Breakpoints, Justify>>
}
export interface Props extends Settings{
  value?: number
  id?: string | number
  items?: Array<object | Array<any>>
}