import { useCallback, useEffect } from 'react';
import { useLocation, useOutlet, useSearchParams } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Box } from '@chakra-ui/react';

import { REFERRER_SEARCH_PARAMS_KEY, useLocalReferrer } from '@/hooks/useLocalReferrer';
import { isLanding, LANDING_PATH, routes } from '@/router';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

export const Layout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { nodeRef } =
    routes.find((route) =>
      // TODO: Hack for '/raffles/:id' route
      route.path.includes(location.pathname.split('/')[1])
    ) ?? {};

  const scrollToTop = useCallback(() => {
    window?.scroll(0, 0);
  }, []);

  const { localReferrer, setLocalReferrer } = useLocalReferrer();
  const [searchParams] = useSearchParams();
  const queryRef = searchParams.get(REFERRER_SEARCH_PARAMS_KEY);
  useEffect(() => {
    if (queryRef && localReferrer !== queryRef) {
      setLocalReferrer(queryRef);
    }
  }, [queryRef, localReferrer, setLocalReferrer]);

  const isLandingPath = Boolean(isLanding && location.pathname === LANDING_PATH);

  return (
    <>
      <Header isLandingView={isLandingPath} />
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef as any}
          timeout={250}
          classNames="route-transition"
          onEntering={scrollToTop}
          unmountOnExit
          in
          appear
        >
          {(state) => (
            <Box ref={nodeRef as any}>
              {currentOutlet}
              <Footer />
            </Box>
          )}
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
