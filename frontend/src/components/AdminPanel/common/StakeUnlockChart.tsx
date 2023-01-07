import { FC } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type StakesData = {
  balance: number;
  timestamp: number;
};
type StakeUnlockChartProps = {
  data?: StakesData[] | null;
};
export const StakeUnlockChart: FC<StakeUnlockChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data || []}>
        <defs>
          <linearGradient id="colorToken1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(107, 201, 91)" stopOpacity={0.3186} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={[Date.now(), 'dataMax']}
          minTickGap={1}
          tickFormatter={(val) => new Date(val * 1000).toLocaleDateString()}
          name="Date"
          //   label="Date"
          scale="time"
        />
        <YAxis type="number" dataKey="balance" minTickGap={1} />
        {/* <ReferenceLine y={1000} label="Min" stroke="red" strokeDasharray="3 3" /> */}

        <Tooltip
          contentStyle={{ background: '#193524' }}
          labelFormatter={(val) => new Date(val * 1000).toLocaleString()}
        />

        <Area
          type="monotone"
          dataKey="balance"
          stroke="#6BC95B"
          strokeWidth={2}
          fillOpacity={1}
          dot={{ stroke: '#6BC95B', strokeWidth: 1 }}
          fill="url(#colorToken1)"
          unit=" SAV"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
