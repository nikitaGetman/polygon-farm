import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateByHash = () => {
  const navigate = useNavigate();

  const navigateByHash = useCallback(
    (to: string) => {
      const [path, hash] = to.split('#');

      const needRedirect = window.location.pathname !== path;

      if (needRedirect) {
        navigate(path);
      }

      if (hash) {
        setTimeout(
          () => {
            const el = window.document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          },
          needRedirect ? 700 : 150
        );
      }
    },
    [navigate]
  );

  return navigateByHash;
};
