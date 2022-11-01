export function trimAddress(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}`.toUpperCase() : address;
}
