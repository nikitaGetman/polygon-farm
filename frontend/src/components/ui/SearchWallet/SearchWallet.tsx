import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';

type SearchWalletProps = {
  variant?: string;
  minWidth?: string;
  buttonText: string;
  placeholder?: string;
  onChange: (search: string) => void;
};
export const SearchWallet: FC<SearchWalletProps> = ({
  buttonText,
  onChange,
  minWidth = '340px',
  variant = 'primary',
  placeholder = '0x...',
}) => {
  const [search, setSearch] = useState<string>('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleOpenSearch = useCallback(() => {
    onOpen();
    setTimeout(() => searchRef.current?.focus(), 0);
  }, [onOpen]);

  const handleReset = useCallback(() => {
    setSearch('');
    onClose();
  }, [setSearch, onClose]);

  useEffect(() => {
    onChange(search);
  }, [search, onChange]);

  return (
    <Box>
      {isOpen || search ? (
        <InputGroup variant={variant} size="md" minWidth={minWidth}>
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            pr="40px"
            onBlur={onClose}
            ref={searchRef}
          />
          <InputRightElement>
            <IconButton
              variant="inputTransparentWhite"
              color="white"
              aria-label="Search"
              size="md"
              onClick={handleReset}
            >
              <CloseIcon width="12px" />
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
