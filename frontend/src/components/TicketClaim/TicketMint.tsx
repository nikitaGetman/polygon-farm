import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';

export const TicketMint = ({ isActive }: { isActive: boolean }) => {
  const icon = useMemo(() => getIcon(isActive), [isActive]);

  return (
    <Box width="252px" height="140px" mt="-5px">
      {icon}
    </Box>
  );
};

const getIcon = (isActive: boolean) => {
  if (isActive) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="252"
        height="162"
        fill="none"
        pointerEvents="none"
      >
        <g filter="url(#ticket-mint)">
          <path
            fill="#1ADCE2"
            fillRule="evenodd"
            d="M11 10c0-2.76142 2.2386-5 5-5h220c2.761 0 5 2.23858 5 5v41.3555c0 .9181-.764 1.6445-1.682 1.6445C226.44 53 216 63.0736 216 75.5S226.44 98 239.318 98c.915 0 1.682.7189 1.682 1.6339V140c0 2.761-2.239 5-5 5H16c-2.7614 0-5-2.239-5-5V98.6724c0-.3736.308-.6724.6816-.6724C24.56 98 35 87.9264 35 75.5S24.56 53 11.6816 53c-.3742 0-.6816-.3002-.6816-.6745V10Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <filter
            id="ticket-mint"
            width="252"
            height="162"
            x="0"
            y="0"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="5.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2379_378" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2379_378" result="shape" />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="252" height="162" fill="none">
      <g filter="url(#ticket-mint)">
        <path
          fill="#1F3E2E"
          fillRule="evenodd"
          d="M11 10c0-2.76142 2.2386-5 5-5h220c2.761 0 5 2.23857 5 5v41.3555c0 .9181-.764 1.6445-1.682 1.6445C226.44 53 216 63.0736 216 75.5S226.44 98 239.318 98c.915 0 1.682.7189 1.682 1.6339V140c0 2.761-2.239 5-5 5H16c-2.7614 0-5-2.239-5-5V98.6724c0-.3736.308-.6724.6816-.6724C24.56 98 35 87.9264 35 75.5S24.56 53 11.6816 53c-.3742 0-.6816-.3002-.6816-.6745V10Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="ticket-mint"
          width="252"
          height="162"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="5.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2379_371" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2379_371" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
