import * as leaflet from 'https://unpkg.com/leaflet@1.7.0/dist/leaflet-src.esm.js';
import disableForm from './disable-form.js';
import { adForm, filterForm, addressInput, housingTypeSelect, housingPriceSelect, housingRoomsSelect, housingGuestsSelect } from './form.js';
import { createPopupLayout } from './offer.js';
import { showErrorMessage } from './message.js';
import { getData } from './create-fetch.js';
import debounce from './debounce.js';

//map config
const MAP_CONFIG = {
  mapContainer: 'map-canvas',
  center: { lat: 35.69034, lng: 139.75175 },
  zoom: 12,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mainPinMarker: null,
  maxPinCount: 10,
  mainPinIcon: {
    iconUrl: '/img/main-pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  },
  markerIcon: {
    iconUrl: '/img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  },
}

const DEBOUNCE_DELAY = 500;

//initializeMap
const initializeMap = (config) => {
  return new Promise((resolve) => {
    const map = leaflet.map(config.mapContainer).setView(config.center, config.zoom);
    leaflet.tileLayer(config.tileLayer).addTo(map);

    map.whenReady(() => resolve(map));
  });
};

//set LatLng in to address input
const setAddress = (source, input) => {
  const latLng = source.target
    ? source.target.getLatLng()
    : source.getCenter();

  const lat = latLng.lat.toFixed(5);
  const lng = latLng.lng.toFixed(5);

  if (input) input.value = `${lat}, ${lng}`;
};

//create main pin icon
const createMainPin = (map, config, onMoveCallback) => {
  if (!config.mainPinMarker) {
    const mainPinIcon = leaflet.icon(config.mainPinIcon);
    config.mainPinMarker = leaflet.marker(config.center, {
      draggable: true,
      icon: mainPinIcon,
    });

    config.mainPinMarker.addTo(map);
  }

  if (onMoveCallback) config.mainPinMarker.on('moveend', onMoveCallback);

  return config.mainPinMarker;
};

//add markers and popups
const createMarkers = (map, points, config) => {
  points.forEach((point) => {
    const { lat, lng } = point.location;
    const icon = leaflet.icon(config.markerIcon);

    const marker = leaflet.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );

    marker
      .addTo(map)
      .bindPopup(() => createPopupLayout(point), { keepInView: true });
  });
};

//reset map center on form reset
const updateMapCenter = (map, config) => {
  const currentLatLng = config.mainPinMarker.getLatLng();
  const initialLatLng = config.center;

  if (currentLatLng.lat !== initialLatLng.lat || currentLatLng.lng !== initialLatLng.lng) {
    map.setView(initialLatLng, config.zoom);
    config.mainPinMarker.setLatLng(initialLatLng);
  }
};

//update address with debounce
const updateAddressWithDebounce = debounce((map, input) => {
  setAddress(map, input);
}, DEBOUNCE_DELAY);

//no points popup
const showNoResultsPopup = (map) => {
  leaflet.popup()
    .setLatLng(map.getCenter())
    .setContent('Нет результатов для выбранных фильтров')
    .openOn(map);
};

//filter
const applyFilters = (points, filters) => {
  return points.filter(({ offer }) => {
    if (!offer) return false;

    const { price, type, rooms, guests, features } = offer;

    const isPriceMatch = filters.price(price);
    const isTypeMatch = filters.type(type);
    const isRoomMatch = filters.rooms(rooms);
    const isGuestsMatch = filters.guests(guests);
    const isFeaturesMatch = filters.features(features);

    return isPriceMatch && isTypeMatch && isRoomMatch && isGuestsMatch && isFeaturesMatch;
  });
};

const filterPoints = (map, points) => {
  const priceValue = housingPriceSelect.value;
  const typeValue = housingTypeSelect.value;
  const roomsValue = housingRoomsSelect.value;
  const guestsValue = housingGuestsSelect.value;
  const selectedFeatures = [...filterForm.querySelectorAll('input[name="features"]:checked')].map(input => input.value);

  const filteredPoints = applyFilters(points, {
    price: (price) => {
      switch (priceValue) {
        case 'low': return price < 10000;
        case 'middle': return price >= 10000 && price < 50000;
        case 'high': return price >= 50000;
        default: return true;
      }
    },
    type: (type) => typeValue === 'any' || type === typeValue,
    rooms: (rooms) => roomsValue === 'any' || rooms === Number(roomsValue),
    guests: (guests) => guestsValue === 'any' || guests === Number(guestsValue),
    features: (features) => selectedFeatures.every((feature) => features ? features.includes(feature) : false),
  });

  //remove all markers except main pin
  map.eachLayer((layer) => {
    if (layer instanceof leaflet.Marker && layer !== MAP_CONFIG.mainPinMarker) {
      map.removeLayer(layer);
    }
  });

  //create new filtered markers
  filteredPoints.length === 0
    ? showNoResultsPopup(map)
    : (map.closePopup(), createMarkers(map, filteredPoints.slice(0, MAP_CONFIG.maxPinCount), MAP_CONFIG));
};

//wrapper for filter points with debounce
const filterPointsWithDebounce = debounce((map, points) => {
  filterPoints(map, points);
}, DEBOUNCE_DELAY);

const main = async () => {
  try {
    //init map
    const map = await initializeMap(MAP_CONFIG);

    //enable ad form after map ready
    disableForm(adForm, false);

    // create main pin
    createMainPin(map, MAP_CONFIG, (evt) => setAddress(evt, addressInput));

    //set main pin coordinates to address input
    setAddress(map, addressInput);

    //reset map center on form reset
    adForm.addEventListener('reset', () => {
      updateMapCenter(map, MAP_CONFIG);
      updateAddressWithDebounce(map, addressInput);
    });

    //get data and create markers
    const points = await getData();
    filterPoints(map, points);

    //enable filter form after data loaded
    disableForm(filterForm, false);

    // filter points with debounce
    filterForm.addEventListener('change', () => {
      filterPointsWithDebounce(map, points);
    });

  } catch (error) {
    showErrorMessage(`Ошибка: ${error}`);
  }
};

main();
