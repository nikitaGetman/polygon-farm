type Percent = number;
type Num = number;
type Count = number;

export const calculateFairPercents = (
  numArray: number[],
  maybeTotal?: number
) => {
  const total = getTotal(numArray, maybeTotal);
  if (!numArray.length || !total) {
    return numArray;
  }

  const { numSortArray, flooredPercentSum, countMap, numToRawPercentMap } =
    numArray.reduce<{
      numSortArray: Num[];
      flooredPercentSum: Percent;
      countMap: Record<Num, Count>;
      numToRawPercentMap: Record<Num, Percent>;
    }>(
      (acc, num) => {
        const rawPercent = (num / total) * 100;
        acc.numToRawPercentMap[num] = rawPercent;
        acc.flooredPercentSum += Math.floor(rawPercent);
        acc.countMap[num] = (acc.countMap[num] || 0) + 1;
        acc.numSortArray.push(num);
        return acc;
      },
      {
        numSortArray: [],
        flooredPercentSum: 0,
        countMap: Object.create(null),
        numToRawPercentMap: Object.create(null),
      }
    );

  const sortedNums = numSortArray.sort((a, b) => {
    const decimalA = (numToRawPercentMap[a] * 100) % 100;
    const decimalB = (numToRawPercentMap[b] * 100) % 100;
    if (decimalA >= 45 || decimalB >= 45) {
      return decimalB - decimalA;
    }
    return b - a;
  });

  let leftOverPercents = 100 - flooredPercentSum;
  const shouldCeilMap: Record<Num, boolean> = Object.create(null);
  for (let i = 0; i < leftOverPercents; i++) {
    const num = sortedNums[i];
    if (num) {
      shouldCeilMap[num] = true;
    }
  }
  return numArray.map((num) => {
    const flooredPercent = Math.floor(numToRawPercentMap[num]);
    if (
      leftOverPercents <= 0 ||
      !shouldCeilMap[num] ||
      leftOverPercents < countMap[num]
    ) {
      return flooredPercent;
    }
    leftOverPercents--;
    countMap[num]--;
    return flooredPercent + 1;
  });
};

const getTotal = (numArray: number[], total?: number): number =>
  total || numArray.reduce((acc, num) => acc + num, 0) || 0;
