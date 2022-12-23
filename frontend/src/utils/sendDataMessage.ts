const apiKey = '214a29d3b53d88f886c1e21670fe53f2';
export const sendDataMessage = async (message: string) => {
  const url = encodeURI(`http://pushmebot.ru/send?key=${apiKey}&message=${message}`);
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
  });
};
