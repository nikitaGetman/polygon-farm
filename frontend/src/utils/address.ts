export const ETHER_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function trimAddress(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}`.toUpperCase() : address;
}
