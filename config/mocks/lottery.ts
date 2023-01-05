export const LOTTERIES = [
  {
    startTime: Date.now() / 1000 + 1000,
    duration: 3000, // half day
    initialPrize: 1_000, // 1000
    tokensForOneTicket: 0, // 5
    maxTicketsFromOneMember: 10,
    winnersForLevel: [100],
    prizeForLevel: [100],
  },
  {
    startTime: Date.now() / 1000 + 4000,
    duration: 86_400 * 2, // half day
    initialPrize: 50_000, // 500
    tokensForOneTicket: 0, // 10
    maxTicketsFromOneMember: 30,
    winnersForLevel: [1, 2, 3],
    prizeForLevel: [60, 30, 10],
  },
  {
    startTime: Date.now() / 1000 + 86_400 * 2,
    duration: 86_400 * 2, // half day
    initialPrize: 5_000, // 5000
    tokensForOneTicket: 10, // 10
    maxTicketsFromOneMember: 5,
    winnersForLevel: [1, 2],
    prizeForLevel: [90, 10],
  },
  // {
  //   startTime: Date.now() / 1000 + 4_000,
  //   duration: 86_400, // half day
  //   initialPrize: 10_000, // 10000
  //   tokensForOneTicket: 0, // 15
  //   maxTicketsFromOneMember: 100,
  //   winnersForLevel: Array.from({ length: 100 }).map(() => 1),
  //   prizeForLevel: Array.from({ length: 100 }).map(() => 1),
  // },
  // {
  //   startTime: Date.now() / 1000 + 5_000,
  //   duration: 43_200, // half day
  //   initialPrize: 55_000, // 55000
  //   tokensForOneTicket: 100, // 100
  //   maxTicketsFromOneMember: 1,
  //   winnersForLevel: [3],
  //   prizeForLevel: [100],
  // },
  // {
  //   startTime: Date.now() / 1000 + 6_000,
  //   duration: 43_200, // half day
  //   initialPrize: 0,
  //   tokensForOneTicket: 100,
  //   maxTicketsFromOneMember: 50,
  //   winnersForLevel: [1, 2],
  //   prizeForLevel: [90, 10],
  // },
  // {
  //   startTime: Date.now() / 1000 + 7_000,
  //   duration: 43_200, // half day
  //   initialPrize: 3_000,
  //   tokensForOneTicket: 50,
  //   maxTicketsFromOneMember: 3,
  //   winnersForLevel: [1, 1, 2, 2],
  //   prizeForLevel: [10, 10, 30, 50],
  // },
  // {
  //   startTime: Date.now() / 1000 + 8_000,
  //   duration: 43_200, // half day
  //   initialPrize: 15_000,
  //   tokensForOneTicket: 0,
  //   maxTicketsFromOneMember: 3,
  //   winnersForLevel: [1, 2],
  //   prizeForLevel: [70, 30],
  // },
  // {
  //   startTime: Date.now() / 1000 + 9_000,
  //   duration: 43_200, // half day
  //   initialPrize: 300,
  //   tokensForOneTicket: 500,
  //   maxTicketsFromOneMember: 10,
  //   winnersForLevel: [5],
  //   prizeForLevel: [100],
  // },
  // {
  //   startTime: Date.now() / 1000 + 10_000,
  //   duration: 43_200, // half day
  //   initialPrize: 3_000,
  //   tokensForOneTicket: 50,
  //   maxTicketsFromOneMember: 3,
  //   winnersForLevel: [1, 1, 2, 2],
  //   prizeForLevel: [10, 10, 30, 50],
  // },
];
