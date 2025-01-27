export function synchronizeFields(source, target) {
  source.addEventListener('change', () => {
    target.value = source.value;
  });

  target.value = source.value;
}

export function fillTextContent(source, selector, value, formatter = (v) => v) {
  const element = source.querySelector(selector);
  if (element) {
    value ? (element.textContent = formatter(value)) : element.remove();
  }
}

export function fillContainer(source, selector, items, createItemCallback) {
  const container = source.querySelector(selector);
  if (container) {
    if (items.length > 0) {
      container.textContent = '';
      items.forEach((item) => container.appendChild(createItemCallback(item)));
    } else {
      container.remove();
    }
  }
}
