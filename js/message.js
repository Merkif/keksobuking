const errorTemplate = document.querySelector('#error').content;
const successTemplate = document.querySelector('#success').content;

const removeHandler = (button, element) => {
  if(button) {
    button.addEventListener('click', () => {
      element.remove();
    }, { once: true });
  }

  document.addEventListener('keydown', (evt) => {
    if(evt.key === 'Escape' && document.contains(element)) {
      element.remove();
    }
  });

  document.addEventListener('click', () => {
    if(document.contains(element)) {
      element.remove();
    }
  });
};

const createErrorMessage = (message) => {
  const element = errorTemplate.cloneNode(true).querySelector('.error');
  const closeButton = element.querySelector('.error__button');
  let messageContent = element.querySelector('.error__message');

  if(message) {
    messageContent.textContent = message || 'Произошла ошибка';
  }

  if(closeButton) {
    removeHandler(closeButton, element);
  }

  return element;
};


const createSuccessMessage = (message) => {
  const element = successTemplate.cloneNode(true).querySelector('.success');
  let messageContent = element.querySelector('.success__message');

  if(message) {
    messageContent.textContent = message || 'Данные успешно отправлены';
  }

  removeHandler(null, element);

  return element;
};

const appendMessage = (element) => {
  document.body.appendChild(element);
};

const showErrorMessage = (message) => {
  const element = createErrorMessage(message);

  appendMessage(element);
};

const showSuccessMessage = (message) => {
  const element = createSuccessMessage(message);

  appendMessage(element);
};


export { showErrorMessage, showSuccessMessage };
