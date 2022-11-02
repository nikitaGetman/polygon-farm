import { extendTheme } from '@chakra-ui/react';
import { buttonTheme } from './button';
import { containerTheme } from './container';

const breakpoints = {
  sm: '0px',
  md: '480px',
  lg: '640px',
  xl: '1024px',
  '2xl': '1600px',
};

const colors = {
  yellow: '#d6d873',
  green: {
    100: '#0d923a', // rgb(13, 146, 58)
    400: '#6bc95b', // rgb(107, 201, 91)
  },
  turquoise: '#2d969a',
  blue: '#1adce2',
  red: '#c95b5b',
  grey: '#4d6655',
  bgGreen: {
    200: '#1f3e2c',
    600: '#1a725c',
  },
  headerBg: 'rgba(12, 34, 14, 0.2)',
};

const semanticTokens = {
  colors: {
    error: 'red',

    // success: 'green.500',
    primary: 'green.400',
    secondary: 'green.100',

    stakingHeader: 'rgb(13, 146, 58, 0.5)',
  },
  sizes: {
    'container-sm': '320px',
    'container-md': '460px',
    'container-lg': '600px',
    'container-xl': '944px',
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
  h1: {
    fontSize: ['52px'],
    fontWeight: 'bold',
    lineHeight: '130%',
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: ['38px'],
    fontWeight: 'bold',
    lineHeight: '130%',
  },
  text1: {
    fontSize: ['18px'],
    fontWeight: '500',
    lineHeight: '130%',
  },
  textMedium: {
    fontSize: ['26px'],
    fontWeight: '500',
    lineHeight: '130%',
  },
  textBald: {
    fontSize: ['18px'],
    fontWeight: '700',
    lineHeight: '130%',
  },
  textSansCommon: {
    textStyle: 'textBald',
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

export const theme = extendTheme({
  components: {
    Button: buttonTheme,
    IconButton: buttonTheme,
    Container: containerTheme,
  },
  breakpoints,
  semanticTokens,
  colors,
  textStyles,
  radii,
  styles,
});
