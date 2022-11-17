export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function tryToGetErrorData(error: unknown): { title: string; description?: string } {
  const message = getErrorMessage(error);

  if (message.includes('user rejected transaction'))
    return { title: 'Failed', description: 'Rejected by user' };

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
