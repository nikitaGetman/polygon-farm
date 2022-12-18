import { FC, ReactElement, useMemo } from 'react';
import { Box, useBreakpoint } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

export type TicketProps = {
  isActive: boolean;
  isClaimed: boolean;
  hasTimer: boolean;
  children: ReactElement;
  onClick?: () => void;
};
export const TicketFirst: FC<TicketProps> = ({
  isActive,
  isClaimed,
  hasTimer,
  children,
  onClick,
}) => {
  const [hoverRef, isHover] = useHover();
  const bp = useBreakpoint({ ssr: false });

  const icon = useMemo(() => {
    if (bp === 'sm' || bp === 'md') return getIconSm({ isClaimed, isActive, isHover });
    if (bp === 'lg' || bp === '2xl') return getIconLg({ isClaimed, isActive, isHover });
    return getIconXl({ isClaimed, isActive, isHover });
  }, [isClaimed, isActive, isHover, bp]);

  const contentStyles = useMemo(() => {
    if (isActive || isClaimed) {
      return {
        top: { sm: '45%', lg: '54%' },
        left: '50%',
      };
    }
    if (hasTimer) {
      return {
        top: { sm: '45%', lg: '54%' },
        left: { sm: '53%', xl: '60%', '2xl': '52%' },
      };
    }
    return {
      top: { sm: '45%', lg: '54%' },
      left: '50%',
    };
  }, [isActive, isClaimed, hasTimer]);

  return (
    <Box
      position="relative"
      zIndex={isActive && isHover ? 10 : 0}
      display="inline-block"
      _hover={isActive ? { cursor: 'pointer' } : undefined}
      onClick={onClick}
    >
      <Box
        width={{ sm: '220px', lg: '225px', xl: '173px', '2xl': '225px' }}
        height={{ sm: '135px', lg: '140px' }}
        ref={hoverRef}
        mt={{ lg: '-11px' }}
      >
        {icon}
      </Box>

      <Box
        pointerEvents="none"
        position="absolute"
        transform="translate(-50%, -50%)"
        {...contentStyles}
      >
        {children}
      </Box>
    </Box>
  );
};

type IconProps = {
  isClaimed: boolean;
  isActive: boolean;
  isHover: boolean;
};
const getIconSm = ({ isClaimed, isActive, isHover }: IconProps) => {
  if (isClaimed) {
    return (
      <svg
        width="220"
        height="165"
        viewBox="0 0 220 165"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_948)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_948"
            x="0"
            y="0"
            width="220"
            height="165"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_948" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_948"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="220"
          height="165"
          viewBox="0 0 220 165"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_993)">
            <mask id="path-1-inside-1_2455_993" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
              fill="#1F3E2E"
            />
            <path
              d="M86.2123 118.794L84.2299 118.529L86.2123 118.794ZM133.788 118.794L135.77 118.529L133.788 118.794ZM20 13H200V9H20V13ZM17 106V16H13V106H17ZM80.4529 109H20V113H80.4529V109ZM88 122C88 121.002 88.0664 120.02 88.1947 119.058L84.2299 118.529C84.0782 119.665 84 120.824 84 122H88ZM110 144C97.8497 144 88 134.15 88 122H84C84 136.359 95.6406 148 110 148V144ZM132 122C132 134.15 122.15 144 110 144V148C124.359 148 136 136.359 136 122H132ZM131.805 119.058C131.934 120.02 132 121.002 132 122H136C136 120.824 135.922 119.665 135.77 118.529L131.805 119.058ZM200 109H139.547V113H200V109ZM203 16V106H207V16H203ZM200 113C203.866 113 207 109.866 207 106H203C203 107.657 201.657 109 200 109V113ZM80.4529 113C81.5353 113 82.537 113.578 83.2818 114.647C84.0381 115.734 84.4097 117.182 84.2299 118.529L88.1947 119.058C88.5106 116.693 87.8753 114.244 86.5644 112.362C85.2421 110.463 83.1163 109 80.4529 109V113ZM135.77 118.529C135.59 117.182 135.962 115.734 136.718 114.647C137.463 113.578 138.465 113 139.547 113V109C136.884 109 134.758 110.463 133.436 112.362C132.125 114.244 131.489 116.693 131.805 119.058L135.77 118.529ZM13 106C13 109.866 16.134 113 20 113V109C18.3431 109 17 107.657 17 106H13ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2455_993)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_993"
              x="0"
              y="0"
              width="220"
              height="165"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.647596 0 0 0 0 0.930368 0 0 0 0 0.364825 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2455_993"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_993"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="220"
        height="165"
        viewBox="0 0 220 165"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_936)">
          <mask id="path-1-inside-1_2455_936" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
            fill="#1F3E2E"
          />
          <path
            d="M86.2123 118.794L84.2299 118.529L86.2123 118.794ZM133.788 118.794L135.77 118.529L133.788 118.794ZM20 13H200V9H20V13ZM17 106V16H13V106H17ZM80.4529 109H20V113H80.4529V109ZM88 122C88 121.002 88.0664 120.02 88.1947 119.058L84.2299 118.529C84.0782 119.665 84 120.824 84 122H88ZM110 144C97.8497 144 88 134.15 88 122H84C84 136.359 95.6406 148 110 148V144ZM132 122C132 134.15 122.15 144 110 144V148C124.359 148 136 136.359 136 122H132ZM131.805 119.058C131.934 120.02 132 121.002 132 122H136C136 120.824 135.922 119.665 135.77 118.529L131.805 119.058ZM200 109H139.547V113H200V109ZM203 16V106H207V16H203ZM200 113C203.866 113 207 109.866 207 106H203C203 107.657 201.657 109 200 109V113ZM80.4529 113C81.5353 113 82.537 113.578 83.2818 114.647C84.0381 115.734 84.4097 117.182 84.2299 118.529L88.1947 119.058C88.5106 116.693 87.8753 114.244 86.5644 112.362C85.2421 110.463 83.1163 109 80.4529 109V113ZM135.77 118.529C135.59 117.182 135.962 115.734 136.718 114.647C137.463 113.578 138.465 113 139.547 113V109C136.884 109 134.758 110.463 133.436 112.362C132.125 114.244 131.489 116.693 131.805 119.058L135.77 118.529ZM13 106C13 109.866 16.134 113 20 113V109C18.3431 109 17 107.657 17 106H13ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2455_936)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_936"
            x="0"
            y="0"
            width="220"
            height="165"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_936" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_936"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="220"
      height="165"
      viewBox="0 0 220 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_919)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V106C15 108.761 17.2386 111 20 111H80.4529C84.1987 111 86.708 115.081 86.2123 118.794C86.0723 119.843 86 120.913 86 122C86 135.255 96.7452 146 110 146C123.255 146 134 135.255 134 122C134 120.913 133.928 119.843 133.788 118.794C133.292 115.081 135.801 111 139.547 111H200C202.761 111 205 108.761 205 106V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_919"
          x="0"
          y="0"
          width="220"
          height="165"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_919" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_919"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

const getIconLg = ({ isClaimed, isActive, isHover }: IconProps) => {
  if (isClaimed) {
    return (
      <svg
        width="255"
        height="170"
        viewBox="0 0 255 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2420_494)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2420_494"
            x="0"
            y="0"
            width="255"
            height="170"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_494" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2420_494"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="255"
          height="170"
          viewBox="0 0 255 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2420_491)">
            <mask id="path-1-inside-1_2420_491" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
              fill="#1F3E2E"
            />
            <path
              d="M212.794 57.2123L213.058 59.1947L212.794 57.2123ZM212.794 104.788L212.529 106.77L212.794 104.788ZM20 13H200V9H20V13ZM17 146V16H13V146H17ZM200 149H20V153H200V149ZM203 110.547V146H207V110.547H203ZM216 103C215.002 103 214.02 102.934 213.058 102.805L212.529 106.77C213.665 106.922 214.824 107 216 107V103ZM238 81C238 93.1503 228.15 103 216 103V107C230.359 107 242 95.3594 242 81H238ZM216 59C228.15 59 238 68.8497 238 81H242C242 66.6406 230.359 55 216 55V59ZM213.058 59.1947C214.02 59.0664 215.002 59 216 59V55C214.824 55 213.665 55.0782 212.529 55.2299L213.058 59.1947ZM203 16V51.4529H207V16H203ZM212.529 55.2299C211.182 55.4097 209.734 55.0381 208.647 54.2818C207.578 53.537 207 52.5353 207 51.4529H203C203 54.1163 204.463 56.2421 206.362 57.5644C208.244 58.8753 210.693 59.5106 213.058 59.1947L212.529 55.2299ZM207 110.547C207 109.465 207.578 108.463 208.647 107.718C209.734 106.962 211.182 106.59 212.529 106.77L213.058 102.805C210.693 102.489 208.244 103.125 206.362 104.436C204.463 105.758 203 107.884 203 110.547H207ZM200 153C203.866 153 207 149.866 207 146H203C203 147.657 201.657 149 200 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2420_491)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2420_491"
              x="0"
              y="0"
              width="255"
              height="170"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.647596 0 0 0 0 0.930368 0 0 0 0 0.364825 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2420_491"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2420_491"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="255"
        height="170"
        viewBox="0 0 255 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2420_488)">
          <mask id="path-1-inside-1_2420_488" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
            fill="#1F3E2E"
          />
          <path
            d="M212.794 57.2123L213.058 59.1947L212.794 57.2123ZM212.794 104.788L212.529 106.77L212.794 104.788ZM20 13H200V9H20V13ZM17 146V16H13V146H17ZM200 149H20V153H200V149ZM203 110.547V146H207V110.547H203ZM216 103C215.002 103 214.02 102.934 213.058 102.805L212.529 106.77C213.665 106.922 214.824 107 216 107V103ZM238 81C238 93.1503 228.15 103 216 103V107C230.359 107 242 95.3594 242 81H238ZM216 59C228.15 59 238 68.8497 238 81H242C242 66.6406 230.359 55 216 55V59ZM213.058 59.1947C214.02 59.0664 215.002 59 216 59V55C214.824 55 213.665 55.0782 212.529 55.2299L213.058 59.1947ZM203 16V51.4529H207V16H203ZM212.529 55.2299C211.182 55.4097 209.734 55.0381 208.647 54.2818C207.578 53.537 207 52.5353 207 51.4529H203C203 54.1163 204.463 56.2421 206.362 57.5644C208.244 58.8753 210.693 59.5106 213.058 59.1947L212.529 55.2299ZM207 110.547C207 109.465 207.578 108.463 208.647 107.718C209.734 106.962 211.182 106.59 212.529 106.77L213.058 102.805C210.693 102.489 208.244 103.125 206.362 104.436C204.463 105.758 203 107.884 203 110.547H207ZM200 153C203.866 153 207 149.866 207 146H203C203 147.657 201.657 149 200 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2420_488)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2420_488"
            x="0"
            y="0"
            width="255"
            height="170"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_488" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2420_488"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="255"
      height="170"
      viewBox="0 0 255 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2420_485)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V110.547C205 106.801 209.081 104.292 212.794 104.788C213.843 104.928 214.913 105 216 105C229.255 105 240 94.2548 240 81C240 67.7452 229.255 57 216 57C214.913 57 213.843 57.0723 212.794 57.2123C209.081 57.708 205 55.1986 205 51.4529V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2420_485"
          x="0"
          y="0"
          width="255"
          height="170"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_485" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2420_485"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

const getIconXl = ({ isClaimed, isActive, isHover }: IconProps) => {
  if (isClaimed) {
    return (
      <svg
        width="203"
        height="170"
        viewBox="0 0 203 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_630)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.674C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_630"
            x="0"
            y="0"
            width="203"
            height="170"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_630" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_630"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="203"
          height="170"
          viewBox="0 0 203 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_619)">
            <mask id="path-1-inside-1_2455_619" fill="white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.673C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
              />
            </mask>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.673C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
              fill="#1F3E2E"
            />
            <path
              d="M162.195 104.933L162.047 106.928L162.195 104.933ZM20 13H150V9H20V13ZM17 146V16H13V146H17ZM150 149H20V153H150V149ZM153 110.674V146H157V110.674H153ZM164 103C163.442 103 162.89 102.979 162.344 102.939L162.047 106.928C162.692 106.976 163.343 107 164 107V103ZM186 81C186 93.1503 176.15 103 164 103V107C178.359 107 190 95.3594 190 81H186ZM164 59C176.15 59 186 68.8497 186 81H190C190 66.6406 178.359 55 164 55V59ZM162.344 59.0613C162.89 59.0207 163.442 59 164 59V55C163.343 55 162.692 55.0244 162.047 55.0723L162.344 59.0613ZM153 16V51.3265H157V16H153ZM162.047 55.0723C160.768 55.1674 159.449 54.7635 158.477 54.0291C157.521 53.3069 157 52.3569 157 51.3265H153C153 53.8422 154.309 55.8939 156.066 57.221C157.807 58.536 160.086 59.2291 162.344 59.0613L162.047 55.0723ZM157 110.674C157 109.643 157.521 108.693 158.477 107.971C159.449 107.236 160.768 106.833 162.047 106.928L162.344 102.939C160.086 102.771 157.807 103.464 156.066 104.779C154.309 106.106 153 108.158 153 110.674H157ZM150 153C153.866 153 157 149.866 157 146H153C153 147.657 151.657 149 150 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM150 13C151.657 13 153 14.3431 153 16H157C157 12.134 153.866 9 150 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2455_619)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_619"
              x="0"
              y="0"
              width="203"
              height="170"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.647596 0 0 0 0 0.930368 0 0 0 0 0.364825 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2455_619"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_619"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="203"
        height="170"
        viewBox="0 0 203 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_618)">
          <mask id="path-1-inside-1_2455_618" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.674C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.674C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
            fill="#1F3E2E"
          />
          <path
            d="M162.195 104.933L162.047 106.928L162.195 104.933ZM20 13H150V9H20V13ZM17 146V16H13V146H17ZM150 149H20V153H150V149ZM153 110.674V146H157V110.674H153ZM164 103C163.442 103 162.89 102.979 162.344 102.939L162.047 106.928C162.692 106.976 163.343 107 164 107V103ZM186 81C186 93.1503 176.15 103 164 103V107C178.359 107 190 95.3594 190 81H186ZM164 59C176.15 59 186 68.8497 186 81H190C190 66.6406 178.359 55 164 55V59ZM162.344 59.0613C162.89 59.0207 163.442 59 164 59V55C163.343 55 162.692 55.0244 162.047 55.0723L162.344 59.0613ZM153 16V51.3265H157V16H153ZM162.047 55.0723C160.768 55.1674 159.449 54.7635 158.477 54.0291C157.521 53.3069 157 52.3569 157 51.3265H153C153 53.8422 154.309 55.8939 156.066 57.221C157.807 58.536 160.086 59.2291 162.344 59.0613L162.047 55.0723ZM157 110.674C157 109.643 157.521 108.693 158.477 107.971C159.449 107.236 160.768 106.833 162.047 106.928L162.344 102.939C160.086 102.771 157.807 103.464 156.066 104.779C154.309 106.106 153 108.158 153 110.674H157ZM150 153C153.866 153 157 149.866 157 146H153C153 147.657 151.657 149 150 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM150 13C151.657 13 153 14.3431 153 16H157C157 12.134 153.866 9 150 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2455_618)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_618"
            x="0"
            y="0"
            width="203"
            height="170"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_618" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_618"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="203"
      height="170"
      viewBox="0 0 203 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_596)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V110.674C155 107.127 158.659 104.67 162.195 104.933C162.791 104.977 163.393 105 164 105C177.255 105 188 94.2548 188 81C188 67.7452 177.255 57 164 57C163.393 57 162.791 57.0225 162.195 57.0668C158.659 57.3297 155 54.8726 155 51.3265V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_596"
          x="0"
          y="0"
          width="203"
          height="170"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_596" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_596"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
