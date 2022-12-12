import { FC } from 'react';

type TicketMiddleProps = {
  isActive: boolean;
  isClaimed: boolean;
};
export const TicketMiddle: FC<TicketMiddleProps> = ({ isActive, isClaimed }) => {
  // if (isClaimed) {
  //   return;
  // }
  // if (isActive) {
  //   return;
  // }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="247" height="162" fill="none">
      <g filter="url(#a)">
        <path
          fill="#264737"
          fill-opacity=".5"
          fill-rule="evenodd"
          d="M11 10c0-2.76142 2.2386-5 5-5h180c2.761 0 5 2.23858 5 5v35.4529c0 3.7458 4.081 6.2551 7.794 5.7594 1.049-.14 2.119-.2123 3.206-.2123 13.255 0 24 10.7452 24 24s-10.745 24-24 24c-1.087 0-2.157-.0723-3.206-.2123-3.713-.4957-7.794 2.0133-7.794 5.7593V140c0 2.761-2.239 5-5 5H16c-2.7614 0-5-2.239-5-5v-33.979c0-2.997 2.616-5.283 5.6067-5.1.8536.052 1.6051.079 2.2431.079C33.016 101 44.5 89.3594 44.5 75S33.016 49 18.8498 49c-.6701 0-1.4655.0227-2.3729.0674C13.534 49.2126 11 46.9325 11 43.986V10Z"
          clip-rule="evenodd"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="a"
          width="247"
          height="162"
          x="0"
          y="0"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="5.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_546_1213" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_546_1213" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
