import type { BigNumber, Event } from 'ethers';
import { constants } from 'ethers';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useSavContract } from './contracts/useSavContract';
import { useSavRContract } from './contracts/useSavRContract';
import { StakingEvent, useStakingContract } from './contracts/useStakingContract';

// Listen to events and refresh data
export const useEvents = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  //   const forumContract = useForumContract();
  //   const tokenContract = useGoflowContract();
  const stakingContract = useStakingContract();
  const savContract = useSavContract();
  const savRContract = useSavRContract();

  useEffect(() => {
    // const questionHandler = () => {
    //   queryClient.invalidateQueries(['questions']);
    // };

    // const stakingInfoHandler = () => {};

    // const answerHandler = (answer: Answer, emittedEvent: Event) => {
    //   if (questionId) {
    //     const answerQidNumber = answer.questionId.toNumber();
    //     const questionIdNumber = questionId.toNumber();
    //     const answerIdNumber = answer.answerId.toNumber();
    //     if (answerQidNumber !== questionIdNumber) {
    //       return;
    //     }

    //     // Check which event we've received
    //     // and only refetch the query by its id
    //     if (emittedEvent.event === ForumEvent.AnswerAdded) {
    //       queryClient.invalidateQueries(['answers', answerQidNumber]);
    //     } else if (emittedEvent.event === ForumEvent.AnswerUpvoted) {
    //       queryClient.invalidateQueries(['upvotes', answerIdNumber]);
    //     }
    //   }
    // };

    const stakingHandler = async (
      from: string,
      to: string,
      amount: BigNumber,
      emittedEvent: Event
    ) => {
      console.log('stakingHandler', emittedEvent);
      // if(emittedEvent)
      //   if (to === forumContract.contract.address) {
      //     console.log(`Transferred ${makeNum(amount)} GOFLOW to Forum contract`);
      //     queryClient.invalidateQueries(['contractBalance']);
      //   } else if (from === constants.AddressZero) {
      //     // e.g. '0x0000000000000000000000000000000000000000'
      //     console.log(`Minted ${makeNum(amount)} GOFLOW to: ${truncateMiddle(to, 6, 5, '...')}`);
      //     queryClient.invalidateQueries(['userBalance', to]);
      //   } else {
      //     console.log(`Transferred ${makeNum(amount)} GOFLOW to: ${truncateMiddle(to, 6, 5, '...')}`);
      //     queryClient.invalidateQueries(['userBalance', to]);
      //   }
    };

    stakingContract.contract.on(StakingEvent.Subscribed, stakingHandler);
    stakingContract.contract.on(StakingEvent.Staked, stakingHandler);
    stakingContract.contract.on(StakingEvent.Claimed, stakingHandler);

    return () => {
      stakingContract.contract.off(StakingEvent.Subscribed, stakingHandler);
      stakingContract.contract.off(StakingEvent.Staked, stakingHandler);
      stakingContract.contract.off(StakingEvent.Claimed, stakingHandler);
    };
  }, [stakingContract, account]);
};
