import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';

type TableSearchProps = {
  buttonText: string;
  placeholder?: string;
  onChange: (search: string) => void;
};
export const TableSearch: FC<TableSearchProps> = ({
  onChange,
  buttonText,
  placeholder = '0x...',
}) => {
  const [search, setSearch] = useState<string>('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleOpenSearch = useCallback(() => {
    onOpen();
    setTimeout(() => searchRef.current?.focus(), 0);
  }, [onOpen]);

  useEffect(() => {
    onChange(search);
  }, [search, onChange]);

  return (
    <Box>
      {isOpen || search ? (
        <InputGroup variant="primary" size="md" minWidth="320px">
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            pr="40px"
            onBlur={onClose}
            ref={searchRef}
          />
          <InputRightElement>
            <IconButton variant="inputTransparentWhite" color="white" aria-label="Search" size="md">
              <SearchIcon />
            </IconButton>
          </InputRightElement>
        </InputGroup>
      ) : (
        <Button variant="link" onClick={handleOpenSearch} height="40px">
          {buttonText}
          <SearchIcon ml="12px" />
        </Button>
      )}
    </Box>
  );
};
