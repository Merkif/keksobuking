import { fillContainer, fillTextContent } from './util.js';

const offerTemplate = document.querySelector('#card').content;

const createPopupLayout = (data) => {
  const { offer, author } = data;
  const {
    title,
    address,
    price,
    type,
    rooms,
    guests,
    checkin,
    checkout,
    features = [],
    description,
    photos = [],
  } = offer;

  const typeMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalow: 'Бунгало',
    hotel: 'Отель',
  }

  const card = offerTemplate.cloneNode(true);

  // Заполнение текстовых полей
  fillTextContent(card, '.popup__title', title);
  fillTextContent(card, '.popup__text--address', address);
  fillTextContent(card, '.popup__text--price', price, (val) => `${val} ₽/ночь`);
  fillTextContent(card, '.popup__type', type, (val) => typeMap[val]);
  fillTextContent(card, '.popup__text--capacity', rooms && guests ? `${rooms} комнаты для ${guests} гостей` : null);
  fillTextContent(card, '.popup__text--time', checkin && checkout ? `Заезд после ${checkin}, выезд до ${checkout}` : null);
  fillTextContent(card, '.popup__description', description);

  // Заполнение списка удобств
  fillContainer(card, '.popup__features', features, (item) => {
    const feature = document.createElement('li');
    feature.classList.add('popup__feature', `popup__feature--${item}`);
    return feature;
  });

  // Заполнение фотографий
  fillContainer(card, '.popup__photos', photos, (src) => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('popup__photo');
    img.alt = 'Фотография жилья';
    img.width = 40;
    img.height = 40;
    img.loading = 'lazy';
    return img;
  });

  // Установка аватара автора
  const authorAvatar = card.querySelector('.popup__avatar');
  if (authorAvatar) {
    authorAvatar.src = author.avatar || 'img/avatars/default.png';
    authorAvatar.loading = 'lazy';

    authorAvatar.addEventListener('error', () => {
      authorAvatar.src = 'img/avatars/default.png';
    }, { once: true });
  }

  return card;
};

export { createPopupLayout };
