import { FC, ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';

type AdminSectionProps = {
  title: string | ReactElement;
  isLoading?: boolean;
  children: string | ReactElement | ReactElement[];
};
export const AdminSection: FC<AdminSectionProps> = ({ title, isLoading, children }) => {
  return (
    <Box
      border="2px solid"
      borderColor="gray.200"
      borderRadius="md"
      padding="16px"
      mb="20px"
      position="relative"
    >
      {isLoading ? <CenteredSpinner /> : null}
      <Box textStyle="textMedium" mb="12px">
        {title}
      </Box>

      {children}
    </Box>
  );
};
