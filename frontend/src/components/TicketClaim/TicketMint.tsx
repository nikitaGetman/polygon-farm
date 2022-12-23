import { ReactElement, useMemo } from 'react';
import { Box, useBreakpoint } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

export const TicketMint = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: ReactElement;
  onClick?: () => void;
}) => {
  const [hoverRef, isHover] = useHover();
  const bp = useBreakpoint({ ssr: false });

  const icon = useMemo(() => {
    if (bp === 'xl') return getIconXl(isActive, isHover);
    if (bp === '2xl') return getIcon2Xl(isActive, isHover);
    return getIconSm(isActive, isHover);
  }, [isActive, isHover, bp]);

  return (
    <Box
      width={{ sm: '220px', lg: '190px', xl: '170px', '2xl': '240px' }}
      position="relative"
      display="inline-block"
      _hover={isActive ? { cursor: 'pointer' } : undefined}
      onClick={onClick}
      ref={hoverRef}
    >
      <Box
        width={{ sm: '220px', lg: '190px', xl: '170px', '2xl': '260px' }}
        height={{ sm: '160px', lg: '140px', xl: '151px' }}
        mt={{ lg: '-11px' }}
        ml={{ lg: '0', xl: '-10px' }}
      >
        {icon}
      </Box>

      <Box
        pointerEvents="none"
        position="absolute"
        transform="translate(-50%, -50%)"
        top={{ sm: '50%', lg: '54%', xl: '50%' }}
        left={{ sm: '50%', lg: '57%', xl: '52%', '2xl': '50%' }}
      >
        {children}
      </Box>
    </Box>
  );
};

const getIconSm = (isActive: boolean, isHover: boolean) => {
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="220"
          height="170"
          viewBox="0 0 220 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_1141)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 16C15 13.2386 17.2386 11 20 11H200C202.761 11 205 13.2386 205 16V54.3118C205 56.9651 202.746 59 200.092 59C187.054 59 176.484 69.0736 176.484 81.5C176.484 93.9264 187.054 104 200.092 104C202.731 104 205 105.99 205 108.628V146C205 148.761 202.761 151 200 151H20C17.2386 151 15 148.761 15 146V106.788C15 105.215 16.3346 104 17.9078 104C30.9461 104 41.5158 93.9264 41.5158 81.5C41.5158 69.0736 30.9461 59 17.9078 59C16.3275 59 15 57.7659 15 56.1856V16Z"
              fill="#1ADCE2"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_1141"
              x="0"
              y="0"
              width="220"
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
                values="0 0 0 0 0.101961 0 0 0 0 0.862745 0 0 0 0 0.886275 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2455_1141"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_1141"
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
        height="170"
        viewBox="0 0 220 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_1134)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 16C15 13.2386 17.2386 11 20 11H200C202.761 11 205 13.2386 205 16V54.3118C205 56.9651 202.746 59 200.092 59V59C187.054 59 176.484 69.0736 176.484 81.5C176.484 93.9264 187.054 104 200.092 104V104C202.731 104 205 105.99 205 108.628V146C205 148.761 202.761 151 200 151H20C17.2386 151 15 148.761 15 146V106.788C15 105.215 16.3346 104 17.9078 104V104C30.9461 104 41.5158 93.9264 41.5158 81.5C41.5158 69.0736 30.9461 59 17.9078 59V59C16.3275 59 15 57.7659 15 56.1856V16Z"
            fill="#1ADCE2"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_1134"
            x="0"
            y="0"
            width="220"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_1134" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_1134"
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
      height="170"
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_1127)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 16C15 13.2386 17.2386 11 20 11H200C202.761 11 205 13.2386 205 16V54.3118C205 56.9651 202.746 59 200.092 59V59C187.054 59 176.484 69.0736 176.484 81.5C176.484 93.9264 187.054 104 200.092 104V104C202.731 104 205 105.99 205 108.628V146C205 148.761 202.761 151 200 151H20C17.2386 151 15 148.761 15 146V106.788C15 105.215 16.3346 104 17.9078 104V104C30.9461 104 41.5158 93.9264 41.5158 81.5C41.5158 69.0736 30.9461 59 17.9078 59V59C16.3275 59 15 57.7659 15 56.1856V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_1127"
          x="0"
          y="0"
          width="220"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_1127" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_1127"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

const getIconXl = (isActive: boolean, isHover: boolean) => {
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="200"
          height="170"
          viewBox="0 0 200 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_573)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 16C15 13.2386 17.2386 11 20 11H180C182.761 11 185 13.2386 185 16V53.9237C185 56.854 182.492 59.1173 179.564 59.0229C179.092 59.0077 178.663 59 178.278 59C165.271 59 154.727 69.0736 154.727 81.5C154.727 93.9264 165.271 104 178.278 104C178.63 104 179.019 103.992 179.444 103.975C182.418 103.86 185 106.124 185 109.1V146C185 148.761 182.761 151 180 151H20C17.2386 151 15 148.761 15 146V106.615C15 105.141 16.2484 104 17.7221 104C30.7293 104 41.2737 93.9264 41.2737 81.5C41.2737 69.0736 30.7293 59 17.7221 59C16.2419 59 15 57.842 15 56.3618V16Z"
              fill="#1ADCE2"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_573"
              x="0"
              y="0"
              width="200"
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
                values="0 0 0 0 0.101961 0 0 0 0 0.862745 0 0 0 0 0.886275 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2455_573"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_573"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="200"
        height="170"
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_566)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 16C15 13.2386 17.2386 11 20 11H180C182.761 11 185 13.2386 185 16V53.9237C185 56.854 182.492 59.1173 179.564 59.0229C179.092 59.0077 178.663 59 178.278 59C165.271 59 154.727 69.0736 154.727 81.5C154.727 93.9264 165.271 104 178.278 104C178.63 104 179.019 103.992 179.444 103.975C182.418 103.86 185 106.124 185 109.1V146C185 148.761 182.761 151 180 151H20C17.2386 151 15 148.761 15 146V106.615C15 105.141 16.2484 104 17.7221 104V104C30.7293 104 41.2737 93.9264 41.2737 81.5C41.2737 69.0736 30.7293 59 17.7221 59V59C16.2419 59 15 57.842 15 56.3618V16Z"
            fill="#1ADCE2"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_566"
            x="0"
            y="0"
            width="200"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_566" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_566"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      width="200"
      height="170"
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_552)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 16C15 13.2386 17.2386 11 20 11H180C182.761 11 185 13.2386 185 16V53.9237C185 56.854 182.492 59.1173 179.564 59.0229C179.092 59.0077 178.663 59 178.278 59C165.271 59 154.727 69.0736 154.727 81.5C154.727 93.9264 165.271 104 178.278 104C178.63 104 179.019 103.992 179.444 103.975C182.418 103.86 185 106.124 185 109.1V146C185 148.761 182.761 151 180 151H20C17.2386 151 15 148.761 15 146V106.615C15 105.141 16.2484 104 17.7221 104V104C30.7293 104 41.2737 93.9264 41.2737 81.5C41.2737 69.0736 30.7293 59 17.7221 59V59C16.2419 59 15 57.842 15 56.3618V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_552"
          x="0"
          y="0"
          width="200"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_552" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_552"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

const getIcon2Xl = (isActive: boolean, isHover: boolean) => {
  if (isActive) {
    if (isHover) {
      return (
        <svg
          width="260"
          height="170"
          viewBox="0 0 260 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2420_445)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 16C15 13.2386 17.2386 11 20 11H240C242.761 11 245 13.2386 245 16V57.3555C245 58.2736 244.236 59 243.318 59V59C230.44 59 220 69.0736 220 81.5C220 93.9264 230.44 104 243.318 104V104C244.233 104 245 104.719 245 105.634V146C245 148.761 242.761 151 240 151H20C17.2386 151 15 148.761 15 146V104.672C15 104.299 15.308 104 15.6816 104V104C28.56 104 39 93.9264 39 81.5C39 69.0736 28.56 59 15.6816 59V59C15.3074 59 15 58.6998 15 58.3255V16Z"
              fill="#1ADCE2"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2420_445"
              x="0"
              y="0"
              width="260"
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
                values="0 0 0 0 0.101961 0 0 0 0 0.862745 0 0 0 0 0.886275 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2420_445"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2420_445"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="260"
        height="170"
        viewBox="0 0 260 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2420_444)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 16C15 13.2386 17.2386 11 20 11H240C242.761 11 245 13.2386 245 16V57.3555C245 58.2736 244.236 59 243.318 59C230.44 59 220 69.0736 220 81.5C220 93.9264 230.44 104 243.318 104C244.233 104 245 104.719 245 105.634V146C245 148.761 242.761 151 240 151H20C17.2386 151 15 148.761 15 146V104.672C15 104.299 15.308 104 15.6816 104C28.56 104 39 93.9264 39 81.5C39 69.0736 28.56 59 15.6816 59C15.3074 59 15 58.6998 15 58.3255V16Z"
            fill="#1ADCE2"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2420_444"
            x="0"
            y="0"
            width="260"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_444" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2420_444"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      width="260"
      height="170"
      viewBox="0 0 260 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2420_443)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 16C15 13.2386 17.2386 11 20 11H240C242.761 11 245 13.2386 245 16V57.3555C245 58.2736 244.236 59 243.318 59C230.44 59 220 69.0736 220 81.5C220 93.9264 230.44 104 243.318 104C244.233 104 245 104.719 245 105.634V146C245 148.761 242.761 151 240 151H20C17.2386 151 15 148.761 15 146V104.672C15 104.299 15.308 104 15.6816 104C28.56 104 39 93.9264 39 81.5C39 69.0736 28.56 59 15.6816 59C15.3074 59 15 58.6998 15 58.3255V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2420_443"
          x="0"
          y="0"
          width="260"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_443" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2420_443"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
