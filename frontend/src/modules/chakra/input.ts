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
    bgColor: 'grey.200',
    borderRadius: 'sm',
  },
};

const xl = defineStyle({
  fontSize: 'lg',
  h: '52px',
  px: 5,
});

const sizes = {
  xl: definePartsStyle({ field: xl, element: { ...xl, mr: 5 }, addon: xl }),
};

export const inputTheme = defineMultiStyleConfig({
  variants: { main },
  sizes,
  defaultProps: {
    variant: 'main',
    size: 'xl',
  },
  baseStyle,
});
