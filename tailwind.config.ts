import type { Config } from 'tailwindcss';
// import defaultTheme from 'tailwindcss/defaultTheme'
// import colors from 'tailwindcss/colors'
import { screens } from './composables/breakpoints';

export default <Partial<Config>> {
  theme: {
    screens,
    extend: {},
  },
};
