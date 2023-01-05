export const ETHER_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function trimAddress(address?: string, length = 4, isUppercase = true) {
  if (!address) return address;

  const trimmedAddress = `${address.slice(0, 2 + length)}...${address.slice(-length)}`;

  return isUppercase ? trimmedAddress.toUpperCase() : trimmedAddress;
}
