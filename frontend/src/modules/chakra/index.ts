import { extendTheme } from '@chakra-ui/react';

import { buttonTheme } from './button';
import { containerTheme } from './container';
import { inputTheme } from './input';
import { menuTheme } from './menu';
import { modalTheme } from './modal';
import { tableTheme } from './table';

const breakpoints = {
  sm: '10px',
  md: '480px',
  lg: '640px',
  xl: '1024px',
  '2xl': '1600px',
};

const colors = {
  sav: '#A5ED5D',
  savr: '#1ADCE2',
  yellow: {
    200: '#d6d873',
  },
  green: {
    100: '#0d923a', // rgb(13, 146, 58)
    // TODO: как добавить прозрачность существующему цвету?
    // возможно стоит вынести цвет в переменную и использовать сторонние утилиты для изменения алфа канала
    10050: 'rgba(13, 146, 58, 0.5)',
    400: '#6bc95b', // rgb(107, 201, 91)
  },
  turquoise: {
    200: '#2d969a',
  },
  blue: '#1adce2',
  red: '#c95b5b',
  gray: {
    200: '#4d6655',
  },
  bgGreen: {
    50: '#174033',
    100: '#193524',
    200: '#1f3e2c',
    400: '#264737',
    600: '#1a725c',
    800: '#192219',
    900: '#0B200B',
  },
  headerBg: '#1b3925e3',
};

const semanticTokens = {
  colors: {
    error: 'red',
    primary: 'green.400',
    secondary: 'green.100',
    stakingHeader: 'rgb(13, 146, 58, 0.5)',
  },
  sizes: {
    'container-sm': '320px',
    'container-md': '460px',
    'container-lg': '600px',
    'container-xl': '964px',
    'container-2xl': '1300px',
  },
  fonts: {
    heading: 'Montserrat, PT Sans, sans-serif',
    body: 'Montserrat, PT Sans, sans-serif',
  },
};

// Пока только для 1600+ разрешения,
// можно задать значения для всех разрешений через массив
// @see: https://chakra-ui.com/docs/styled-system/text-and-layer-styles#text-styles
const textStyles = {
  sectionHeading: {
    fontSize: { base: '26px', xl: '38px', '2xl': '52px' },
    fontWeight: 'bold',
    lineHeight: '130%',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  h1: {
    fontSize: ['52px'],
    fontWeight: 'bold',
    lineHeight: '130%',
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: { lg: '26px', xl: '38px' },
    fontWeight: 'bold',
    lineHeight: '130%',
  },
  h3: {
    fontSize: ['26px'],
    fontWeight: '700',
    lineHeight: '130%',
  },
  heading1: {
    fontSize: ['36px'],
    fontWeight: '600',
    lineHeight: '130%',
  },
  text1: {
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '500',
    lineHeight: '130%',
  },
  text2: {
    fontSize: ['16px'],
    fontWeight: '500',
    lineHeight: '130%',
  },
  textRegular: {
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '400',
    lineHeight: '130%',
  },
  textMedium: {
    fontSize: ['26px'],
    fontWeight: '500',
    lineHeight: '130%',
    fontFamily: 'Montserrat',
  },
  textExtraBoldUpper: {
    fontSize: ['26px'],
    fontWeight: '700',
    lineHeight: '130%',
    textTransform: 'uppercase',
  },
  textBold: {
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '700',
    lineHeight: '130%',
  },
  textSemiBold: {
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '600',
    lineHeight: '130%',
  },
  textBaldPtSans: {
    fontFamily: 'PT Sans',
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '700',
    lineHeight: '130%',
  },
  textSansBold: {
    fontSize: { sm: '16px', '2xl': '18px' },
    fontWeight: '700',
    lineHeight: '130%',
    fontFamily: 'PT Sans',
  },
  textSansSmall: {
    fontSize: '12px',
    lineHeight: '130%',
    fontFamily: 'PT Sans',
  },
  button: {
    fontSize: ['16px'],
    fontWeight: '600',
    lineHeight: '20px',
    textTransform: 'uppercase',
  },
  menuDefault: {
    fontSize: ['26px'],
    fontWeight: '600',
    lineHeight: '130%',
  },
};

// border radius
const radii = {
  sm: '5px',
  md: '10px',
};

const styles = {
  global: {
    body: {
      color: 'white',
    },
  },
};

const shadows = {
  outline: '0 0 0 3px var(--chakra-colors-pink-200) !important',
};

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
  },
  shadows,
  components: {
    Button: buttonTheme,
    IconButton: buttonTheme,
    Container: containerTheme,
    Modal: modalTheme,
    Menu: menuTheme,
    Input: inputTheme,
    Table: tableTheme,
  },
  breakpoints,
  semanticTokens,
  colors,
  textStyles,
  radii,
  styles,
});
