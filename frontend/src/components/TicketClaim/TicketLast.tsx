import { FC, useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

import { TicketProps } from './TicketFirst';

export const TicketLast: FC<TicketProps> = ({ isActive, isClaimed }) => {
  const [hoverRef, isHover] = useHover();

  const icon = useMemo(() => getIcon(isClaimed, isActive, isHover), [isClaimed, isActive, isHover]);

  return (
    <Box width="212px" height="140px" ref={hoverRef} ml="-11px" mt="-5px">
      {icon}
    </Box>
  );
};

const getIcon = (isClaimed: boolean, isActive: boolean, isHover: boolean) => {
  if (isClaimed) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="212" height="162" fill="none">
        <g filter="url(#ticket-last)">
          <path
            fill="#6BC95B"
            fillRule="evenodd"
            d="M201 10c0-2.76142-2.239-5-5-5H16c-2.7614 0-5 2.23857-5 4.99999V43.986c0 2.9465 2.534 5.2266 5.4769 5.0814.9074-.0447 1.7028-.0674 2.3729-.0674C33.016 49 44.5 60.6406 44.5 75s-11.484 26-25.6502 26c-.638 0-1.3895-.027-2.2431-.079-2.9907-.183-5.6067 2.103-5.6067 5.1V140c0 2.761 2.2386 5 5 5h180c2.761 0 5-2.239 5-5V10Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <filter
            id="ticket-last"
            width="212"
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
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2381_425" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2381_425" result="shape" />
          </filter>
        </defs>
      </svg>
    );
  }
  if (isActive) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="212" height="162" fill="none">
        <g filter="url(#ticket-last-a)">
          <mask id="ticket-last-b" fill="#fff">
            <path
              fillRule="evenodd"
              d="M201 10c0-2.76142-2.239-5-5-5H16c-2.7614 0-5 2.23857-5 4.99999V43.986c0 2.9465 2.534 5.2266 5.4769 5.0814.9074-.0447 1.7028-.0674 2.3729-.0674C33.016 49 44.5 60.6406 44.5 75s-11.484 26-25.6502 26c-.638 0-1.3895-.027-2.2431-.079-2.9907-.183-5.6067 2.103-5.6067 5.1V140c0 2.761 2.2386 5 5 5h180c2.761 0 5-2.239 5-5V10Z"
              clipRule="evenodd"
            />
          </mask>
          <path
            fill={isHover ? '#6BC95B' : '#1F3E2E'}
            fillRule="evenodd"
            d="M201 10c0-2.76142-2.239-5-5-5H16c-2.7614 0-5 2.23857-5 4.99999V43.986c0 2.9465 2.534 5.2266 5.4769 5.0814.9074-.0447 1.7028-.0674 2.3729-.0674C33.016 49 44.5 60.6406 44.5 75s-11.484 26-25.6502 26c-.638 0-1.3895-.027-2.2431-.079-2.9907-.183-5.6067 2.103-5.6067 5.1V140c0 2.761 2.2386 5 5 5h180c2.761 0 5-2.239 5-5V10Z"
            clipRule="evenodd"
          />
          <path
            fill="#6BC95B"
            d="m16.4769 49.0674-.0985-1.9975.0985 1.9975Zm.1298 51.8536.1221-1.9961-.1221 1.9961ZM16 7h180V3H16v4Zm-3 36.986V9.99999H9V43.986h4Zm3.5754 7.079c.8855-.0437 1.6465-.065 2.2744-.065v-4c-.7123 0-1.5421.024-2.4714.0699l.197 3.9951ZM18.8498 51C31.886 51 42.5 61.7195 42.5 75h4c0-15.4384-12.354-28-27.6502-28v4ZM42.5 75c0 13.2805-10.614 24-23.6502 24v4C34.146 103 46.5 90.4383 46.5 75h-4ZM18.8498 99c-.5857 0-1.2947-.0246-2.121-.0751l-.2442 3.9921c.8809.054 1.675.083 2.3652.083v-4ZM13 140v-33.979H9V140h4Zm183 3H16v4h180v-4Zm3-133v130h4V10h-4Zm-3 137c3.866 0 7-3.134 7-7h-4c0 1.657-1.343 3-3 3v4ZM9 140c0 3.866 3.134 7 7 7v-4c-1.6569 0-3-1.343-3-3H9Zm0-96.014c0 4.1572 3.5592 7.2771 7.5754 7.079l-.197-3.9951C14.5089 47.1621 13 45.7218 13 43.986H9Zm7.7288 54.9389C12.6781 98.6771 9 101.783 9 106.021h4c0-1.755 1.5539-3.222 3.4846-3.104l.2442-3.9921ZM196 7c1.657 0 3 1.34315 3 3h4c0-3.86599-3.134-7-7-7v4ZM16 3c-3.866 0-7 3.134-7 6.99999h4C13 8.34314 14.3431 7 16 7V3Z"
            mask="url(#ticket-last-b)"
          />
        </g>
        <defs>
          <filter
            id="ticket-last-a"
            width="212"
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
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2381_424" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2381_424" result="shape" />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="212" height="162" fill="none">
      <g filter="url(#ticket-last)">
        <path
          fill="#1F3E2E"
          fillRule="evenodd"
          d="M201 10c0-2.76142-2.239-5-5-5H16c-2.7614 0-5 2.23857-5 4.99999V43.986c0 2.9465 2.534 5.2266 5.4769 5.0814.9074-.0447 1.7028-.0674 2.3729-.0674C33.016 49 44.5 60.6406 44.5 75s-11.484 26-25.6502 26c-.638 0-1.3895-.027-2.2431-.079-2.9907-.183-5.6067 2.103-5.6067 5.1V140c0 2.761 2.2386 5 5 5h180c2.761 0 5-2.239 5-5V10Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="ticket-last"
          width="212"
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
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2379_392" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2379_392" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
