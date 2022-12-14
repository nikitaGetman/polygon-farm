import { FC, useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

export type TicketProps = {
  isActive: boolean;
  isClaimed: boolean;
};
export const TicketFirst: FC<TicketProps> = ({ isActive, isClaimed }) => {
  const [hoverRef, isHover] = useHover();

  const icon = useMemo(() => getIcon(isClaimed, isActive, isHover), [isClaimed, isActive, isHover]);

  return (
    <Box width="225px" height="140px" ref={hoverRef} mt="-11px">
      {icon}
    </Box>
  );
};

const getIcon = (isClaimed: boolean, isActive: boolean, isHover: boolean) => {
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
