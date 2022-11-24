export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error instanceof Object && (error as any).message) return String((error as any).message);
  return String(error);
}

export function tryToGetErrorData(error: unknown): { title: string; description?: string } {
  const message = getErrorMessage(error);

  if (message.includes('user rejected transaction')) {
    return { title: 'Failed', description: 'Rejected by user' };
  }

  // For local development mostly
  if (message.includes('Expected nonce to be')) {
    const expectedNonce = message.split('Expected nonce to be')[1].trim().split(' ')[0];
    return { title: 'Wrong nonce', description: `Expected nonce ${expectedNonce}` };
  }

  if (message.includes('amount exceeds balance')) {
    return { title: 'Failed', description: 'Not enough funds in your wallet' };
  }

  if (message.includes('Referrer')) {
    return { title: 'Failed', description: 'This address cannot be the leader' };
  }

  if (message.includes('Not enough tokens for reward')) {
    return {
      title: 'Failed',
      description: 'There are not enough funds in the pool to pay the reward',
    };
  }

  const hasReadableError = message.includes('reverted with reason string ');

  const errorReg = /reverted with reason string '(?<data>[^']*)'/gm;

  let errorMessage = 'Something went wrong';
  if (hasReadableError) {
    const res = Array.from(message.matchAll(errorReg));

    if (res && res[0] && res[0][1]) {
      errorMessage = `Error: ${res[0][1]}`;
    }
  }

  return { title: 'Transaction failed', description: errorMessage };
}
