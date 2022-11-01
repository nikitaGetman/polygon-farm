import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const layoutWidth = [
  '100%',
  'container.sm',
  'container.md',
  'container.lg',
  'container.xl',
  'var(--chakra-sizes-container-2xl)',
];

const dashboard = defineStyle({
  width: layoutWidth,
  maxWidth: 'unset',
  display: 'flex',
  flexDirection: 'column',
});

const header = defineStyle({
  width: layoutWidth,
  maxWidth: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const containerTheme = defineStyleConfig({
  variants: { dashboard, header },
  defaultProps: {
    // variant: 'dashboard',
  },
});
