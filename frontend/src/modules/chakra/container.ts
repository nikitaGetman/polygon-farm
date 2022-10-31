import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const dashboardLayout = defineStyle({
  width: [
    '100%',
    'container.sm',
    'container.md',
    'container.lg',
    'container.xl',
    'var(--chakra-sizes-container-2xl)',
  ],
  maxWidth: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const containerTheme = defineStyleConfig({
  variants: { dashboardLayout },
  defaultProps: {
    // variant: 'dashboardLayout',
  },
});
