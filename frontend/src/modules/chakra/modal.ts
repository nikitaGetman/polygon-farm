import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {},
  dialog: {
    bgColor: '#213D2F',
    borderRadius: 'md',
    boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
    padding: '30px 30px 36px 30px',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  body: {
    padding: '24px 0 0 0',
  },
  footer: {
    padding: '20px 0 0 0',
  },
  closeButton: {
    top: 30,
    right: 30,
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
