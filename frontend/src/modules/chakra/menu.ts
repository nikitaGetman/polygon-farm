import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  list: {
    color: 'white',
    border: 'none',
  },
  item: {},
  button: {},
});

const darkTransparent = {
  item: {
    fontSize: '18px',
    _hover: { bgColor: 'bgGreen.600' },
    _focus: { bgColor: 'bgGreen.600' },
    _active: { bgColor: 'bgGreen.600' },
  },
  list: {
    bgColor: 'bgGreen.800',
  },
};
const green = {
  // TODO : add styles from WalletMenu
};

export const menuTheme = defineMultiStyleConfig({
  variants: { 'dark-transparent': darkTransparent },
  baseStyle,
});
