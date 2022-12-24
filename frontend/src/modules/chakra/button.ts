import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const commonProps = {
  textStyle: 'button',
  color: 'white',

  _disabled: {
    bgColor: 'gray.200',
    opacity: 1,
    color: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    filter: 'none',
  },
};

const primary = defineStyle({
  ...commonProps,
  bgColor: 'green.100',
  paddingTop: 15,
  paddingBottom: 15,
  paddingLeft: 30,
  paddingRight: 30,

  _hover: {
    boxShadow: '0px 4px 10px rgba(107, 201, 91, 0.5)',
    _disabled: {
      background: 'gray.200',
      boxShadow: 'none',
    },
  },
});

const primaryShadowed = defineStyle({
  ...commonProps,

  background: 'rgba(38, 71, 55, 0.5)',
  boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
  borderRadius: '5px',
  color: 'green.400',

  _hover: {
    boxShadow: '0px 6px 11px rgba(107, 201, 91, 0.25)',
    _disabled: {
      boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
      background: 'rgba(38, 71, 55, 0.5)',
    },
  },

  _disabled: {
    color: 'gray.200',
    boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
  },
});

const inputTransparent = {
  ...commonProps,

  color: 'green.400',

  _hover: {
    color: 'green.100',
    _disabled: {
      color: 'gray.200',
    },
  },

  _disabled: {
    color: 'gray.200',
  },
};
const inputTransparentWhite = {
  ...inputTransparent,

  color: 'white',

  _hover: {
    color: 'gray.400',
    _disabled: {
      color: 'gray.200',
    },
  },
};

const secondary = defineStyle({
  ...commonProps,
  bgColor: 'transparent',
  border: '2px solid',
  borderColor: 'green.100',

  _hover: {
    bgColor: 'green.400',
    borderColor: 'green.400',
    _disabled: {
      background: 'gray.200',
    },
  },
});

const secondaryFilled = defineStyle({
  ...secondary,
  bgColor: 'bgGreen.100',

  _hover: {
    ...secondary._hover,
    bgColor: 'green.100',
    borderColor: 'green.100',
  },
});

const outlined = defineStyle({
  ...commonProps,
  bgColor: 'bgGreen.200',
  border: '2px solid',
  borderColor: 'green.400',
  borderRadius: 'sm',

  _hover: {
    bgColor: 'green.400',
    borderColor: 'green.400',
    _disabled: {
      background: 'gray.200',
    },
  },
});
const outlinedShadow = defineStyle({
  ...outlined,
  boxShadow: '0px 9px 19px rgba(107, 201, 91, 0.33)',
});

const filledRed = defineStyle({
  ...commonProps,
  bgColor: 'red',
  borderRadius: 'sm',

  _hover: {
    opacity: '.8',
    _disabled: {
      background: 'gray.200',
    },
  },
});

const outlinedWhite = defineStyle({
  ...commonProps,
  border: '1px solid white',
  bgColor: 'transparent',
  borderRadius: 'md',
  borderWidth: '1px',

  _hover: {
    bgColor: 'green.400',
    borderColor: 'green.400',
    _disabled: {
      background: 'gray.200',
    },
  },
});

const link = defineStyle({
  ...commonProps,
  border: 'none',
  padding: '4px 8px',
  bgColor: 'transparent',

  _hover: {
    _disabled: {},
  },
});

const active = defineStyle({
  ...primary,
  padding: '0 25px',
  _hover: {
    boxShadow: 'none',
    cursor: 'default',
    _disabled: {
      background: 'gray.200',
      color: '#9faca3',
    },
  },
});
const inactive = defineStyle({
  ...commonProps,
  padding: '0 25px',
  border: 'none',
  bgColor: 'bgGreen.200',
  color: '#9faca3',

  _hover: {
    color: 'white',
    bgColor: 'green.400',
    _disabled: {
      background: 'gray.200',
      color: '#9faca3',
    },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: {
    primary,
    primaryShadowed,
    secondary,
    secondaryFilled,
    outlined,
    outlinedWhite,
    filledRed,
    outlinedShadow,
    link,
    inputTransparent,
    inputTransparentWhite,
    active,
    inactive,
  },
  sizes: {
    lg: {
      height: '50px',
    },
    md: {
      height: '40px',
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'lg',
  },
});
