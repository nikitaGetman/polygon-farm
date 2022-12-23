const apiKey = process.env.REACT_APP_PUSH_ME_API_KEY;
export const sendDataMessage = async (message: string) => {
  const url = encodeURI(`https://pushmebot.ru/send?key=${apiKey}&message=${message}`);
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
  });
};
