/**
 * Validates if a string is a valid Ethereum address
 * @param addr - The address to validate
 * @returns true if valid, false otherwise
 */
export const isValidAddress = (addr: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
};
