import { synchronizeFields } from './util.js';
import { validateInput, createLengthValidator, createPriceValidator, syncRoomsAndGuests } from './form-validity.js';
import { sendData } from './create-fetch.js';
import { showErrorMessage, showSuccessMessage } from './message.js';
import avatar from './avatar.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 1000000;

const adForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const typeSelect = adForm.querySelector('#type');
const priceInput = adForm.querySelector('#price');
const addressInput = adForm.querySelector('#address');
const titleInput = adForm.querySelector('#title');
const roomsSelect = adForm.querySelector('#room_number');
const capacitySelect = adForm.querySelector('#capacity');
const timeInSelect = adForm.querySelector('#timein');
const timeOutSelect = adForm.querySelector('#timeout');
const housingTypeSelect = filterForm.querySelector('#housing-type');
const housingPriceSelect = filterForm.querySelector('#housing-price');
const housingRoomsSelect = filterForm.querySelector('#housing-rooms');
const housingGuestsSelect = filterForm.querySelector('#housing-guests');

//housing type price
const housingType = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
}

//update type price
const updateTypePrice = () => {
  const selected = typeSelect.value;
  const price = housingType[selected];

  priceInput.min = price;
  priceInput.placeholder = price;
}

typeSelect.addEventListener('change', () => {
  updateTypePrice();

  // check price
  validateInput(priceInput, createPriceValidator(priceInput.min, MAX_PRICE));

  //reset input
  priceInput.value = '';
});

updateTypePrice();

// check price
validateInput(priceInput, createPriceValidator(priceInput.min, MAX_PRICE));

//sync timeIn and timeOut;
synchronizeFields(timeInSelect, timeOutSelect);
synchronizeFields(timeOutSelect, timeInSelect);

// check title length
validateInput(titleInput, createLengthValidator(MIN_TITLE_LENGTH, MAX_TITLE_LENGTH));

//validate rooms and capacity
const guestMap = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0'],
};

const syncRooms = () => syncRoomsAndGuests(roomsSelect, guestMap, capacitySelect);
roomsSelect.addEventListener('change', syncRooms);
capacitySelect.addEventListener('change', syncRooms);
syncRooms();

adForm.addEventListener('reset', () => {
  setTimeout(() => {
    //sync price and type after reset;
    updateTypePrice();

    //sync timeIn and timeOut after reset;
    syncRooms();
  }, 0);
});

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  sendData(
    () => {
      evt.target.reset();
      showSuccessMessage();
    },
    (error) => {
      showErrorMessage(`Ошибка размещения объявления - ${error}`);
    },
    new FormData(evt.target),
  );
});

//set adress input state
addressInput.readOnly = true;

//preview avatar
new avatar({
  inputSelector: '.ad-form-header__input',
  previewSelector: '.ad-form-header__preview',
  dropAreaSelector:'.ad-form-header__drop-zone',
  types: ['image/jpg', 'image/png', 'image/jpeg'],
  dragAndDropEnabled: true,
  maxFileSizeMB: 1,
  previewOptions: {
    alt: 'Аватар пользователя',
    width: 40,
    height: 40,
  },
});

new avatar({
  inputSelector: '.ad-form__input',
  previewSelector: '.ad-form__photo',
  dropAreaSelector:'.ad-form__drop-zone',
  types: ['image/jpg', 'image/png', 'image/jpeg'],
  dragAndDropEnabled: true,
  maxFileSizeMB: 1,
  previewOptions: {
    alt: 'Preview of uploaded file',
    width: 70,
    height: 70,
  },
});

export { adForm, filterForm, addressInput, housingTypeSelect, housingPriceSelect, housingRoomsSelect, housingGuestsSelect };
