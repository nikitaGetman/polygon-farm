import React, { FC } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';

type BalanceData = {
  token1: number;
  token2: number;
  block: number;
};
type BalanceHistoryChartProps = {
  data?: BalanceData[] | null;
};
export const BalanceHistoryChart: FC<BalanceHistoryChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data || []}>
        <defs>
          <linearGradient id="colorToken1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(107, 201, 91)" stopOpacity={0.3186} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorToken2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(26, 211, 216)" stopOpacity={0.59} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis type="number" dataKey="block" hide domain={['dataMin', 'dataMax']} />
        <Area
          type="monotone"
          dataKey="token1"
          stroke="#6BC95B"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorToken1)"
          unit="SAV"
        />
        <Area
          type="monotone"
          dataKey="token2"
          stroke="#1ADCE2"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorToken2)"
          unit="SAVR"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
