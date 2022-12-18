import { FC, useMemo } from 'react';
import { Box, useBreakpoint } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

import { TicketProps } from './TicketFirst';

export const TicketLast: FC<TicketProps> = ({
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
        top: { sm: '66%', lg: '54%' },
        left: { sm: '50%', lg: '53%', xl: '70%', '2xl': '62%' },
      };
    }
    if (hasTimer) {
      return {
        top: { sm: '64%', lg: '54%' },
        left: { sm: '53%', lg: '56%', xl: '84%', '2xl': '70%' },
      };
    }
    return {
      top: { sm: '60%', lg: '54%' },
      left: { sm: '50%', lg: '54%', xl: '68%', '2xl': '62%' },
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
        width={{ sm: '220px', xl: '140px', '2xl': '190px' }}
        height={{ sm: '120px', lg: '140px' }}
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
        height="140"
        viewBox="0 0 220 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_1078)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_1078"
            x="0"
            y="0"
            width="220"
            height="140"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_1078" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_1078"
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
          height="140"
          viewBox="0 0 220 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_1066)">
            <mask id="path-1-inside-1_2455_1066" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
              fill="#1F3E2E"
            />
            <path
              d="M84.1105 16.6219L82.1153 16.4838L84.1105 16.6219ZM135.907 16.4901L133.91 16.6008L135.907 16.4901ZM110 43C96.7195 43 86 32.386 86 19.3498H82C82 34.646 94.5617 47 110 47V43ZM134 19.3498C134 32.386 123.28 43 110 43V47C125.438 47 138 34.646 138 19.3498H134ZM133.91 16.6008C133.97 17.6898 134 18.6111 134 19.3498H138C138 18.5137 137.967 17.5141 137.904 16.3794L133.91 16.6008ZM140.981 13H200V9H140.981V13ZM203 16V116H207V16H203ZM200 119H20V123H200V119ZM17 116V16H13V116H17ZM20 13H79.0219V9H20V13ZM86 19.3498C86 18.6544 86.0346 17.7875 86.1057 16.7599L82.1153 16.4838C82.0402 17.5684 82 18.5329 82 19.3498H86ZM79.0219 13C80.7849 13 82.2482 14.5625 82.1153 16.4838L86.1057 16.7599C86.3873 12.6903 83.2641 9 79.0219 9V13ZM17 16C17 14.3431 18.3431 13 20 13V9C16.134 9 13 12.134 13 16H17ZM20 119C18.3431 119 17 117.657 17 116H13C13 119.866 16.134 123 20 123V119ZM203 116C203 117.657 201.657 119 200 119V123C203.866 123 207 119.866 207 116H203ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM137.904 16.3794C137.801 14.5159 139.239 13 140.981 13V9C136.819 9 133.687 12.5701 133.91 16.6008L137.904 16.3794Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2455_1066)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_1066"
              x="0"
              y="0"
              width="220"
              height="140"
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
                result="effect1_dropShadow_2455_1066"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_1066"
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
        height="140"
        viewBox="0 0 220 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_1065)">
          <mask id="path-1-inside-1_2455_1065" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
            fill="#1F3E2E"
          />
          <path
            d="M84.1105 16.6219L82.1153 16.4838L84.1105 16.6219ZM135.907 16.4901L133.91 16.6008L135.907 16.4901ZM110 43C96.7195 43 86 32.386 86 19.3498H82C82 34.646 94.5617 47 110 47V43ZM134 19.3498C134 32.386 123.28 43 110 43V47C125.438 47 138 34.646 138 19.3498H134ZM133.91 16.6008C133.97 17.6898 134 18.6111 134 19.3498H138C138 18.5137 137.967 17.5141 137.904 16.3794L133.91 16.6008ZM140.981 13H200V9H140.981V13ZM203 16V116H207V16H203ZM200 119H20V123H200V119ZM17 116V16H13V116H17ZM20 13H79.0219V9H20V13ZM86 19.3498C86 18.6544 86.0346 17.7875 86.1057 16.7599L82.1153 16.4838C82.0402 17.5684 82 18.5329 82 19.3498H86ZM79.0219 13C80.7849 13 82.2482 14.5625 82.1153 16.4838L86.1057 16.7599C86.3873 12.6903 83.2641 9 79.0219 9V13ZM17 16C17 14.3431 18.3431 13 20 13V9C16.134 9 13 12.134 13 16H17ZM20 119C18.3431 119 17 117.657 17 116H13C13 119.866 16.134 123 20 123V119ZM203 116C203 117.657 201.657 119 200 119V123C203.866 123 207 119.866 207 116H203ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13ZM137.904 16.3794C137.801 14.5159 139.239 13 140.981 13V9C136.819 9 133.687 12.5701 133.91 16.6008L137.904 16.3794Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2455_1065)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_1065"
            x="0"
            y="0"
            width="220"
            height="140"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_1065" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_1065"
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
      height="140"
      viewBox="0 0 220 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_1031)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M84 19.3498C84 33.516 95.6406 45 110 45C124.359 45 136 33.516 136 19.3498C136 18.5624 135.969 17.6019 135.907 16.4901C135.744 13.543 138.029 11 140.981 11H200C202.761 11 205 13.2386 205 16V116C205 118.761 202.761 121 200 121H20C17.2386 121 15 118.761 15 116V16C15 13.2386 17.2386 11 20 11H79.0219C82.0245 11 84.3177 13.6264 84.1105 16.6219C84.0374 17.678 84 18.5937 84 19.3498Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_1031"
          x="0"
          y="0"
          width="220"
          height="140"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_1031" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_1031"
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
        width="220"
        height="170"
        viewBox="0 0 220 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2420_496)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2420_496"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_496" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2420_496"
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
          height="170"
          viewBox="0 0 220 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2420_493)">
            <mask id="path-1-inside-1_2420_493" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
              fill="#1F3E2E"
            />
            <path
              d="M20.4769 55.0674L20.3784 53.0699L20.4769 55.0674ZM20.6067 106.921L20.7288 104.925L20.6067 106.921ZM200 9H20V13H200V9ZM13 16V49.986H17V16H13ZM20.5754 57.065C21.4609 57.0213 22.2219 57 22.8498 57V53C22.1375 53 21.3077 53.024 20.3784 53.0699L20.5754 57.065ZM22.8498 57C35.886 57 46.5 67.7195 46.5 81H50.5C50.5 65.5616 38.146 53 22.8498 53V57ZM46.5 81C46.5 94.2805 35.886 105 22.8498 105V109C38.146 109 50.5 96.4383 50.5 81H46.5ZM22.8498 105C22.2641 105 21.5551 104.975 20.7288 104.925L20.4846 108.917C21.3655 108.971 22.1596 109 22.8498 109V105ZM13 112.021V146H17V112.021H13ZM20 153H200V149H20V153ZM207 146V16H203V146H207ZM200 153C203.866 153 207 149.866 207 146H203C203 147.657 201.657 149 200 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM13 49.986C13 54.1432 16.5592 57.2631 20.5754 57.065L20.3784 53.0699C18.5089 53.1621 17 51.7218 17 49.986H13ZM20.7288 104.925C16.6781 104.677 13 107.783 13 112.021H17C17 110.266 18.5539 108.799 20.4846 108.917L20.7288 104.925ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2420_493)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2420_493"
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
                values="0 0 0 0 0.647596 0 0 0 0 0.930368 0 0 0 0 0.364825 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2420_493"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2420_493"
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
        <g filter="url(#filter0_d_2420_490)">
          <mask id="path-1-inside-1_2420_490" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
            fill="#1F3E2E"
          />
          <path
            d="M20.4769 55.0674L20.3784 53.0699L20.4769 55.0674ZM20.6067 106.921L20.7288 104.925L20.6067 106.921ZM200 9H20V13H200V9ZM13 16V49.986H17V16H13ZM20.5754 57.065C21.4609 57.0213 22.2219 57 22.8498 57V53C22.1375 53 21.3077 53.024 20.3784 53.0699L20.5754 57.065ZM22.8498 57C35.886 57 46.5 67.7195 46.5 81H50.5C50.5 65.5616 38.146 53 22.8498 53V57ZM46.5 81C46.5 94.2805 35.886 105 22.8498 105V109C38.146 109 50.5 96.4383 50.5 81H46.5ZM22.8498 105C22.2641 105 21.5551 104.975 20.7288 104.925L20.4846 108.917C21.3655 108.971 22.1596 109 22.8498 109V105ZM13 112.021V146H17V112.021H13ZM20 153H200V149H20V153ZM207 146V16H203V146H207ZM200 153C203.866 153 207 149.866 207 146H203C203 147.657 201.657 149 200 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM13 49.986C13 54.1432 16.5592 57.2631 20.5754 57.065L20.3784 53.0699C18.5089 53.1621 17 51.7218 17 49.986H13ZM20.7288 104.925C16.6781 104.677 13 107.783 13 112.021H17C17 110.266 18.5539 108.799 20.4846 108.917L20.7288 104.925ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9ZM200 13C201.657 13 203 14.3431 203 16H207C207 12.134 203.866 9 200 9V13Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2420_490)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2420_490"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_490" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2420_490"
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
      <g filter="url(#filter0_d_2420_487)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M205 16C205 13.2386 202.761 11 200 11H20C17.2386 11 15 13.2386 15 16V49.986C15 52.9325 17.534 55.2126 20.4769 55.0674C21.3843 55.0227 22.1797 55 22.8498 55C37.016 55 48.5 66.6406 48.5 81C48.5 95.3594 37.016 107 22.8498 107C22.2118 107 21.4603 106.973 20.6067 106.921C17.616 106.738 15 109.024 15 112.021V146C15 148.761 17.2386 151 20 151H200C202.761 151 205 148.761 205 146V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2420_487"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2420_487" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2420_487"
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
        width="170"
        height="170"
        viewBox="0 0 170 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_754)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
            fill="#6BC95B"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_754"
            x="0"
            y="0"
            width="170"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_754" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_754"
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
          width="170"
          height="170"
          viewBox="0 0 170 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2455_743)">
            <mask id="path-1-inside-1_2455_743" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
              fill="#1F3E2E"
            />
            <path
              d="M20.508 55.0499L20.4145 53.0521L20.508 55.0499ZM20.6463 106.944L20.7604 104.947L20.6463 106.944ZM20 13H150V9H20V13ZM17 49.9538V16H13V49.9538H17ZM20.6014 57.0477C21.2879 57.0156 21.885 57 22.388 57V53C21.8068 53 21.1451 53.0179 20.4145 53.0521L20.6014 57.0477ZM22.388 57C34.4793 57 44.5294 67.6029 44.5294 81H48.5294C48.5294 65.6783 36.9626 53 22.388 53V57ZM44.5294 81C44.5294 94.3971 34.4793 105 22.388 105V109C36.9626 109 48.5294 96.3217 48.5294 81H44.5294ZM22.388 105C21.9289 105 21.3856 104.983 20.7604 104.947L20.5321 108.94C21.2117 108.979 21.8338 109 22.388 109V105ZM17 146V112.063H13V146H17ZM150 149H20V153H150V149ZM153 16V146H157V16H153ZM150 153C153.866 153 157 149.866 157 146H153C153 147.657 151.657 149 150 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM13 49.9538C13 54.1342 16.5893 57.2354 20.6014 57.0477L20.4145 53.0521C18.517 53.1408 17 51.6894 17 49.9538H13ZM20.7604 104.947C16.7167 104.716 13 107.795 13 112.063H17C17 110.308 18.5636 108.828 20.5321 108.94L20.7604 104.947ZM150 13C151.657 13 153 14.3431 153 16H157C157 12.134 153.866 9 150 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
              fill="#6BC95B"
              mask="url(#path-1-inside-1_2455_743)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2455_743"
              x="0"
              y="0"
              width="170"
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
                result="effect1_dropShadow_2455_743"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2455_743"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        width="170"
        height="170"
        viewBox="0 0 170 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2455_742)">
          <mask id="path-1-inside-1_2455_742" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
            />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
            fill="#1F3E2E"
          />
          <path
            d="M20.508 55.0499L20.4145 53.0521L20.508 55.0499ZM20.6463 106.944L20.7604 104.947L20.6463 106.944ZM20 13H150V9H20V13ZM17 49.9538V16H13V49.9538H17ZM20.6014 57.0477C21.2879 57.0156 21.885 57 22.388 57V53C21.8068 53 21.1451 53.0179 20.4145 53.0521L20.6014 57.0477ZM22.388 57C34.4793 57 44.5294 67.6029 44.5294 81H48.5294C48.5294 65.6783 36.9626 53 22.388 53V57ZM44.5294 81C44.5294 94.3971 34.4793 105 22.388 105V109C36.9626 109 48.5294 96.3217 48.5294 81H44.5294ZM22.388 105C21.9289 105 21.3856 104.983 20.7604 104.947L20.5321 108.94C21.2117 108.979 21.8338 109 22.388 109V105ZM17 146V112.063H13V146H17ZM150 149H20V153H150V149ZM153 16V146H157V16H153ZM150 153C153.866 153 157 149.866 157 146H153C153 147.657 151.657 149 150 149V153ZM13 146C13 149.866 16.134 153 20 153V149C18.3431 149 17 147.657 17 146H13ZM13 49.9538C13 54.1342 16.5893 57.2354 20.6014 57.0477L20.4145 53.0521C18.517 53.1408 17 51.6894 17 49.9538H13ZM20.7604 104.947C16.7167 104.716 13 107.795 13 112.063H17C17 110.308 18.5636 108.828 20.5321 108.94L20.7604 104.947ZM150 13C151.657 13 153 14.3431 153 16H157C157 12.134 153.866 9 150 9V13ZM20 9C16.134 9 13 12.134 13 16H17C17 14.3431 18.3431 13 20 13V9Z"
            fill="#6BC95B"
            mask="url(#path-1-inside-1_2455_742)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2455_742"
            x="0"
            y="0"
            width="170"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_742" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2455_742"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="170"
      height="170"
      viewBox="0 0 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2455_717)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M155 16C155 13.2386 152.761 11 150 11H20C17.2386 11 15 13.2386 15 16V49.9538C15 52.9118 17.5531 55.1881 20.508 55.0499C21.2165 55.0168 21.8459 55 22.388 55C35.7209 55 46.5294 66.6406 46.5294 81C46.5294 95.3594 35.7209 107 22.388 107C21.8814 107 21.2986 106.981 20.6463 106.944C17.6401 106.772 15 109.051 15 112.063V146C15 148.761 17.2386 151 20 151H150C152.761 151 155 148.761 155 146V16Z"
          fill="#1F3E2E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2455_717"
          x="0"
          y="0"
          width="170"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2455_717" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2455_717"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
