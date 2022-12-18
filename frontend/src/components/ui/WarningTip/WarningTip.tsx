import { FC, ReactNode } from 'react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

type WarningTipProps = {
  children: ReactNode;
};
export const WarningTip: FC<WarningTipProps> = ({ children }) => {
  return (
    <Text textStyle="textBold" color="error" display="flex" alignItems="center" whiteSpace="nowrap">
      <>
        <WarningTwoIcon mr="10px" />
        {children}
      </>
    </Text>
  );
};
