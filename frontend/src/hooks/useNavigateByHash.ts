import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateByHash = () => {
  const navigate = useNavigate();

  const navigateByHash = useCallback(
    (to: string, offset?: number) => {
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
              // el.scrollIntoView({ block: 'center', behavior: 'smooth' });

              const resOffset = offset || window.innerWidth > 1599 ? 140 : 100;
              const y = el.getBoundingClientRect().top + window.scrollY - resOffset;
              window.scroll({
                top: y,
                behavior: 'smooth',
              });
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
