export default class Avatar {
  constructor(options = {}) {
    this.config = this.createConfig(options);
    this.inputElement = document.querySelector(this.config.inputSelector);
    this.previewElement = document.querySelector(this.config.previewSelector);
    this.dropAreaElement = document.querySelector(this.config.dropAreaSelector);

    if (!this.inputElement || !this.previewElement) {
      throw new Error('Не найдены элементы для загрузки файла.');
    }

    this.init();
  }

  createConfig(options) {
    const defaultConfig = {
      inputSelector: '.preview-input',
      previewSelector: '.preview-photo',
      dropAreaSelector: '.drop-area',
      types: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
      maxFileSizeMB: 1,
      get maxFileSizeBytes() {
        if (this.maxFileSizeMB <= 0) {
          throw new Error('Размер файла должен быть положительным числом.');
        }
        return this.maxFileSizeMB * 1024 * 1024;
      },
      setMaxFileSizeMB(newSizeMB) {
        if (newSizeMB <= 0) {
          throw new Error('Размер в мегабайтах должен быть положительным числом.');
        }
        this.maxFileSizeMB = newSizeMB;
      },
      previewOptions: {
        alt: 'preview',
        width: 70,
        height: 70,
      },
      dragAndDropEnabled: false,
    };

    return { ...defaultConfig, ...options };
  }

  init() {
    this.inputElement.accept = this.config.types.join(', ');
    this.inputElement.addEventListener('change', (evt) => this.handleFileChange(evt));

    if (this.config.dragAndDropEnabled && this.dropAreaElement) {
      this.dropAreaElement.addEventListener('dragover', (evt) => this.handleDragOver(evt));
      this.dropAreaElement.addEventListener('dragleave', (evt) => this.handleDragLeave(evt));
      this.dropAreaElement.addEventListener('drop', (evt) => this.handleDrop(evt));
    }
  }

  handleDragOver(evt) {
    evt.preventDefault();
    this.dropAreaElement.classList.add('drag-over');
  }

  handleDragLeave(evt) {
    evt.preventDefault();
    this.dropAreaElement.classList.remove('drag-over');
  }

  handleDrop(evt) {
    evt.preventDefault();
    this.dropAreaElement.classList.remove('drag-over');

    const file = evt.dataTransfer.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  handleFileChange(evt) {
    const file = evt.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  async processFile(file) {
    const error = this.validateFile(file);
    if (error) {
      this.showError(error);
      return;
    }

    try {
      const url = await this.readFile(file);
      this.clearPreview();
      this.displayPreview(url);
    } catch (err) {
      this.showError(`Ошибка чтения файла: ${err.message}`);
    }
  }

  validateFile(file) {
    if (!this.isValidFileType(file)) {
      return `Некорректное расширение файла. Поддерживаются: ${this.config.types.join(', ')}`;
    }
    if (!this.isValidFileSize(file)) {
      return `Размер файла превышает ${this.config.maxFileSizeMB} МБ.`;
    }
    return null;
  }

  isValidFileType(file) {
    return this.config.types.includes(file.type);
  }

  isValidFileSize(file) {
    return file.size <= this.config.maxFileSizeBytes;
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  clearPreview() {
    this.previewElement.textContent = '';
  }

  displayPreview(url) {
    const { alt, width, height } = this.config.previewOptions;

    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.width = width;
    img.height = height;
    img.loading = 'lazy';
    this.previewElement.appendChild(img);
  }

  showError(message) {
    alert(message);
  }
}
