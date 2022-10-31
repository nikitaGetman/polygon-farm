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
    100: '#0d923a',
    400: '#6bc95b',
    900: 'rgba(107, 201, 91)',
  },
  turquoise: '#2d969a',
  blue: '#1adce2',
  red: '#c95b5b',
  grey: '#4d6655',
  bgGreen: {
    200: '#1f3e2c',
  },
  headerBg: 'rgba(12, 34, 14, 0.2)',
};

const semanticTokens = {
  colors: {
    error: 'red',
    text: {
      default: 'white.200',
    },
    // success: 'green.500',
    // primary: {
    //   default: 'red.500',
    //   _dark: 'red.400',
    // },
    // secondary: {
    //   default: 'red.800',
    //   _dark: 'red.700',
    // },
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
  // h1: {
  //   fontSize: ['90px'],
  //   fontWeight: 'bold',
  //   lineHeight: '110%',
  //   color: 'white',
  // },
  h1: {
    fontSize: ['52px'],
    fontWeight: 'bold',
    lineHeight: '130%',
    color: 'white',
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: ['38px'],
    fontWeight: 'bold',
    lineHeight: '130%',
    color: 'white',
  },
  text1: {
    fontSize: ['18px'],
    fontWeight: '500',
    lineHeight: '130%',
    color: 'white',
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
});
