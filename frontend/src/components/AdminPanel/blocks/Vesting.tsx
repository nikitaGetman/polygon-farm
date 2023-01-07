import { Box, Button, useDisclosure } from '@chakra-ui/react';

import { useVesting } from '@/hooks/useVesting';

import { AdminSection } from '../common/AdminSection';
import { CreateVestingSchedule } from '../common/CreateVestingSchedule';

export const Vesting = () => {
  const { createVestingSchedules } = useVesting();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection title="Vesting">
      <Box>
        <Button size="sm" onClick={onOpen}>
          Create new Vesting schedule
        </Button>

        {isOpen ? (
          <CreateVestingSchedule onClose={onClose} onSubmit={createVestingSchedules.mutateAsync} />
        ) : null}
      </Box>
    </AdminSection>
  );
};
