import { useMutation } from '@tanstack/react-query';

import { useVestingContract, VestingScheduleProps } from './contracts/useVestingContract';
import { useNotification } from './useNotification';

export const useVesting = () => {
  const vestingContract = useVestingContract();
  const { success, handleError } = useNotification();

  const createVestingSchedules = useMutation(
    ['create-vesting-schedule'],
    async (props: VestingScheduleProps) => {
      const txHash = await vestingContract.createVestingSchedules(props);
      success({ title: 'Success', description: 'Vesting schedule has been created', txHash });
    },
    {
      onError: handleError,
    }
  );

  return { createVestingSchedules };
};
