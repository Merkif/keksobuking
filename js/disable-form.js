import { adForm, filterForm } from './form.js';

const disableForm = (form, state = true) => {
  form.classList.toggle('ad-form--disabled', state);
  const formElements = form.querySelectorAll('select, fieldset');

  formElements.forEach((element) => {
    element.disabled = state;
  });
};

if(adForm && filterForm) {
  disableForm(adForm);
  disableForm(filterForm);
}

export default disableForm;
