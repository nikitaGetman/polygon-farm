import { FC, useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { useHover } from '@/hooks/useHover';

import { TicketProps } from './TicketFirst';

export const TicketLast: FC<TicketProps> = ({ isActive, isClaimed }) => {
  const [hoverRef, isHover] = useHover();

  const icon = useMemo(() => getIcon(isClaimed, isActive, isHover), [isClaimed, isActive, isHover]);

  return (
    <Box width="212px" height="140px" ref={hoverRef} mt="-11px">
      {icon}
    </Box>
  );
};

const getIcon = (isClaimed: boolean, isActive: boolean, isHover: boolean) => {
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
