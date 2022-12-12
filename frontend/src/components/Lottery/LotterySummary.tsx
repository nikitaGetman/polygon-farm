import React, { FC, useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { LotteryWinners } from '@/lib/lottery';
import { trimAddress } from '@/utils/address';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

import './lottery.scss';

const PAGE_LIMIT = 10;
type LotterySummaryProps = {
  userPrize?: BigNumberish;
  winners: LotteryWinners[];
};
export const LotterySummary: FC<LotterySummaryProps> = ({ userPrize, winners }) => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const { isOpen, onToggle, onOpen } = useDisclosure();

  const sortedWinners = useMemo(() => winners.sort((a, b) => a.level - b.level), [winners]);

  const filteredWinners = useMemo(
    () =>
      sortedWinners.filter(({ address }) =>
        address.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [sortedWinners, search]
  );

  useEffect(() => {
    setPage(0);
    if (search) {
      onOpen();
    }
  }, [search, onOpen]);

  const fromItem = useMemo(
    () => Math.min(page * PAGE_LIMIT + 1, filteredWinners.length),
    [page, filteredWinners]
  );
  const toItem = useMemo(
    () => Math.min((page + 1) * PAGE_LIMIT, filteredWinners.length),
    [page, filteredWinners]
  );

  const paginatedWinners = useMemo(
    () => filteredWinners.slice(fromItem - 1, toItem),
    [filteredWinners, fromItem, toItem]
  );

  const hasPrevPage = page > 0;
  const hasNextPage = toItem < filteredWinners.length;

  return (
    <Box
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      padding="30px 40px 40px"
    >
      <Box textStyle="textSemiBold" textTransform="uppercase">
        <Flex justifyContent="space-between" alignItems="center" mb="20px">
          <Heading fontSize="41px">Summary</Heading>

          <SearchWallet
            buttonText="Search wallet"
            onChange={setSearch}
            minWidth="270px"
            variant="secondary"
          />
        </Flex>

        <Text mb="10px">Congratulations to the raffle winners</Text>

        <Flex justifyContent="space-between" alignItems="center" fontSize="16px">
          <Button p={0} variant="link" color="red" onClick={onToggle}>
            See all winners
          </Button>
          <Text color="blue">{bigNumberToString(userPrize || 0)} SAVR</Text>
        </Flex>
      </Box>

      {isOpen ? (
        <>
          <Divider mt="32px" borderColor="white" opacity={0.5} />

          <Box mb="40px">
            <table className="lottery-summary__table">
              <thead>
                <tr>
                  <th className="lottery-summary__cell lottery-summary__cell--heading lottery-summary__cell--level">
                    Level
                  </th>
                  <th className="lottery-summary__cell lottery-summary__cell--heading lottery-summary__cell--wallet">
                    Wallet
                  </th>
                  <th className="lottery-summary__cell lottery-summary__cell--heading lottery-summary__cell--tickets">
                    Entered with
                  </th>
                  <th className="lottery-summary__cell lottery-summary__cell--heading lottery-summary__cell--prize">
                    Won
                    <br />
                    SAVR
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedWinners.map((winner, index) => (
                  <tr key={index}>
                    <td className="lottery-summary__cell lottery-summary__cell--level">
                      {winner.level + 1}
                    </td>
                    <td className="lottery-summary__cell lottery-summary__cell--wallet">
                      {trimAddress(winner.address, 8)}
                    </td>
                    <td className="lottery-summary__cell lottery-summary__cell--tickets">
                      {winner.tickets}
                    </td>
                    <td className="lottery-summary__cell lottery-summary__cell--prize">
                      {getReadableAmount(winner.prize)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Flex justifyContent="space-between" alignItems="center">
            <Text textStyle="text1">
              {fromItem}-{toItem} of {filteredWinners.length}
            </Text>

            <Box>
              <IconButton
                mr="30px"
                aria-label="prev page"
                disabled={!hasPrevPage}
                size="md"
                variant="transparent"
                icon={<ChevronLeftIcon boxSize="2em" />}
                onClick={() => setPage(page - 1)}
              />
              <IconButton
                aria-label="next page"
                disabled={!hasNextPage}
                size="md"
                variant="transparent"
                icon={<ChevronRightIcon boxSize="2em" />}
                onClick={() => setPage(page + 1)}
              />
            </Box>
          </Flex>
        </>
      ) : null}
    </Box>
  );
};
