import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  table: {},
  thead: {},
  tbody: {},
  tr: {
    textStyle: 'textSansSmall',
    _even: {
      bgColor: 'rgba(42, 96, 47, 0.5)',
    },
    _odd: {
      bgColor: 'rgba(30, 51, 32, 0.5)',
    },
  },
  th: {
    fontSize: 'inherit',
    bgColor: 'rgba(45, 150, 154, 0.3)',
  },
  td: {},
});

const main = definePartsStyle({
  td: {
    py: '8px',
    height: '48px',
  },
});

export const tableTheme = defineMultiStyleConfig({
  variants: { main },
  baseStyle,
});
