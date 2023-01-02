import { FC, ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

type AdminSectionProps = {
  title: string | ReactElement;
  children: string | ReactElement | ReactElement[];
};
export const AdminSection: FC<AdminSectionProps> = ({ title, children }) => {
  return (
    <Box border="2px solid" borderColor="gray.200" borderRadius="md" padding="16px" mb="20px">
      <Box textStyle="textMedium" mb="12px">
        {title}
      </Box>

      {children}
    </Box>
  );
};
