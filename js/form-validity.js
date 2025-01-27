/**
 * Универсальная функция для проверки валидности ввода
 * @param {HTMLInputElement} input - Поле ввода
 * @param {Function} validateFn - Функция валидации, возвращающая сообщение об ошибке или пустую строку
 */
const validateInput = (input, validateFn) => {
  input.addEventListener('input', () => {
    const errorMessage = validateFn(input.value);
    input.setCustomValidity(errorMessage);
    input.reportValidity();
  });
};

/**
 * Функция для проверки длины значения
 * @param {number} min - Минимальная длина
 * @param {number} max - Максимальная длина
 */
const createLengthValidator = (min, max) => (value) => {
  const length = value.length;
  if (length < min) {
    return `Минимальная длина заголовка - ${min - length} симв.`;
  }
  if (length > max) {
    return `Максимальная длина заголовка - ${length - max} симв.`;
  }
  return ''; // Нет ошибок
};

/**
 * Функция для проверки цены
 * @param {number} min - Минимальная цена
 * @param {number} max - Максимальная цена
 */
const createPriceValidator = (min, max) => (value) => {
  const number = parseFloat(value);
  if (number < min) {
    return `Минимальная цена - ${min}`;
  }
  if (number > max) {
    return `Максимальная цена - ${max}`;
  }
  return ''; // Нет ошибок
};

/**
 * Функция для проверки цены
 * @param {Element} roomSelect - Селектор количества комнат
 * @param {Element} guestSelect - Селектор количества гостей
 * @param {Object} guestMap - Соответствие количества комнат количеству гостей
 */
const syncRoomsAndGuests = (roomSelect, guestMap, guestSelect) => {
  const selectedRoom = roomSelect.value;
  const validGuests = guestMap[selectedRoom];

  [...guestSelect.options].forEach(option => {
    option.hidden = !validGuests.includes(option.value);
  });

  if (validGuests.length === 1) {
    guestSelect.value = validGuests[0];
    guestSelect.setCustomValidity('');
  } else {
    if (!validGuests.includes(guestSelect.value)) {
      guestSelect.setCustomValidity('Выберите допустимое количество гостей');
      guestSelect.value = '';
    } else {
      guestSelect.setCustomValidity('');
    }
  }

  guestSelect.reportValidity();
};


export { validateInput, createLengthValidator, createPriceValidator, syncRoomsAndGuests };
