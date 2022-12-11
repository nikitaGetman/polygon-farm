import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const baseStyle = definePartsStyle({
  field: {
    textStyle: 'textSansBold',
    fontSize: '18px',
    _placeholder: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

const main = {
  field: {
    border: 'none',
    bgColor: 'gray.200',
    borderRadius: 'sm',
  },
};

const mailing = {
  field: {
    border: 'none',
    boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
    bgColor: 'rgba(38, 71, 55, 0.5)',
    borderRadius: '10px',
    fontWeight: '400',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',

    _placeholder: {
      fontWeight: '400',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
};

const primary = {
  field: {
    background: 'rgba(38, 71, 55, 0.5)',
    boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
    borderRadius: 'md',

    _readOnly: {
      color: 'white',
      opacity: 0.5,
    },
  },
};

const secondary = {
  field: {
    background: 'bgGreen.800',
    boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
    borderRadius: 'md',
  },
};

const transparent = {
  field: {
    background: 'transparent',
    boxShadow: 'none',
    border: 'none',
    padding: '0',
  },
};

const xl = defineStyle({
  fontSize: 'lg',
  h: '52px',
  px: 5,
});
const md = defineStyle({
  fontSize: '12px',
  h: '40px',
  p: '12px 15px',
});

const sizes = {
  xl: definePartsStyle({ field: xl, element: { ...xl, mr: 5 }, addon: xl }),
  md: definePartsStyle({ field: md, addon: md }),
};

export const inputTheme = defineMultiStyleConfig({
  variants: { main, primary, mailing, secondary, transparent },
  sizes,
  defaultProps: {
    variant: 'main',
    size: 'xl',
  },
  baseStyle,
});
