import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const commonProps = {
  textStyle: 'button',
  color: 'white',
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
      background: 'grey',
      boxShadow: 'none',
    },
  },
  _disabled: {
    bgColor: 'grey',
    opacity: 1,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const secondary = defineStyle({
  ...commonProps,
  bgColor: 'bgGreen.200',
  border: '2px solid',
  borderColor: 'green.100',
  // filter: 'drop-shadow(0px 9px 18px rgba(107, 201, 91, 0.27))',

  _hover: {
    bgColor: 'green.400',
    borderColor: 'green.400',
    _disabled: {
      background: 'grey',
    },
  },
  _disabled: {
    bgColor: 'grey',
    opacity: 1,
    color: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    filter: 'none',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { primary, secondary },
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
