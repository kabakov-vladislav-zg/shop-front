export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

class Breakpoints {
  readonly entries = [
    ['xs', 0],
    ['sm', 640],
    ['md', 768],
    ['lg', 1024],
    ['xl', 1280],
    ['2xl', 1536],
  ];
  readonly object: Record<Breakpoint, number>
  readonly keys: Breakpoint[]
  constructor() {
    this.object = Object.fromEntries(this.entries);
    this.keys = this.entries.map(([name]) => name as Breakpoint);
  }
}

export const breakpoints = new Breakpoints();
