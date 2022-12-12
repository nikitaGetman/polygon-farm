import { QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      structuralSharing: true,
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      // TODO: add toasts and notifications
      //   react-hot-toasts
      //   toast.error(
      //     'Network Error: Ensure Metamask is connected & on the same network that your contract is deployed to.'
      //   );
    },
  }),
});
