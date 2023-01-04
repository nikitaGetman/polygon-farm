import { FC, useCallback, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

type CloseLotteryRoundProps = {
  winnersForLevel: number[];
  onClose: () => void;
  onSubmit: (pk: string[][]) => Promise<void>;
};
export const CloseLotteryRound: FC<CloseLotteryRoundProps> = ({
  winnersForLevel,
  onClose,
  onSubmit,
}) => {
  const [pk, setPK] = useState<string[][]>(
    Array.from({ length: winnersForLevel.length }).map(() => [''])
  );
  const [isLoading, setIsLoading] = useState(false);

  const addWinner = useCallback(
    (level: number) => {
      const localPk = pk.slice();
      localPk[level].push('');
      setPK(localPk);
    },
    [pk, setPK]
  );

  const onChangePK = useCallback(
    (level: number, index: number, e: any) => {
      const localPk = pk.slice();
      localPk[level][index] = e.target.value;
      setPK(localPk);
    },
    [pk, setPK]
  );

  const handleSubmit = useCallback(() => {
    const formattedPK = pk.map((levelPk) => levelPk.filter(Boolean));
    setIsLoading(true);
    onSubmit(formattedPK).finally(() => {
      setIsLoading(false);
      onClose();
    });
  }, [pk, onSubmit, onClose]);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Close Raffle round
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mb="12px">Optionally specify winners in any field</Text>

          {pk.map((levelPk, level) => (
            <Box key={level}>
              <Text textStyle="text1" fontSize="20px">
                Level {level + 1}
              </Text>

              <Box mt="8px">
                {levelPk?.map((localPk, index) => (
                  <Input
                    key={`${level}-${index}`}
                    mb="8px"
                    value={localPk}
                    placeholder={`Winner ${level + 1}-${index + 1}: 0x...`}
                    onChange={onChangePK.bind(this, level, index)}
                  />
                ))}

                {levelPk.length < winnersForLevel[level] ? (
                  <Link onClick={() => addWinner(level)}>+ Add winner</Link>
                ) : null}
              </Box>
            </Box>
          ))}

          <ModalFooter>
            <Button width="100%" variant="outlined" isLoading={isLoading} onClick={handleSubmit}>
              Close Raffle round
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
