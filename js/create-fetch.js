const Url = {
  GET_DATA: 'https://23.javascript.htmlacademy.pro/keksobooking/data',
  SEND_DATA: 'https://23.javascript.htmlacademy.pro/keksobooking',
}

const getData = () => {
  return fetch(Url.GET_DATA)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(`Ошибка ${error.message}`);
    });
};

const sendData = (onSuccess, onError, body) => {
  return fetch(Url.SEND_DATA, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if(!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      onSuccess();
    })
    .catch((error) => onError(error.message));
};



export { getData, sendData };
