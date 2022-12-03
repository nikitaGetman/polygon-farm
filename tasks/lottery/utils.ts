export const getRandom = (from: number, to: number) => {
  return Math.round(Math.random() * (to - from) + from);
};

export const wait = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), sec * 1000);
  });
};
