document.addEventListener('DOMContentLoaded', () => {
  let defaultPairs = 4; // card * 2
  let defaultDelayOpen = 600; // ms

  // images for cards. Taken by id
  let amazingImagesForCards = [
    'img/bird1.jpg',
    'img/bird5.png',
    'img/bird2.jpg',
    'img/bird3.jpg',
    'img/bird4.jpg',
  ]
  let amazingCardCounter = 0;
  let _emptyImagesNotification = 0;

  // Create usual card
  class Card {
    constructor(number, startStatus) {
      if (isNaN(number)) {
        throw new TypeError('ID не является числом!');
      }
      this.id = number;
      this.success = false;
      this.open = false;
      // status 0 - close, 1 - open , 2 - success
      switch (startStatus) {
        case 2:
          this.success = true;
          this.open = true;
          break;
        case 1:
          this.open = true;
          break;
        default:
          break;
      }
    };
    createCard() {
      this.elemWrap = document.createElement('div');
      this.elemWrap.classList.add('card-field__card-wrap');
      this.elem = document.createElement('div');
      this.elem.classList.add('card-field__card');
      let cardContent = document.createElement('span');
      cardContent.textContent = `${this.id}`;
      this.elem.append(cardContent);
      this.elemWrap.append(this.elem);
      return this.elemWrap;
    }

    get open() {
      return this._open;
    }

    set open(isOpen) {
      this._open = isOpen;
      if (!this._open) {
        return
      }
      if (this._open === true) {
        this.elem.classList.add('show');
      } else {
        this.elem.classList.remove('show');
      }
    }

    get success() {
      return this._success;
    }

    set success(isSuccess) {
      this._success = isSuccess;
      if (!this._success) {
        return
      }
      if (this._success === true) {
        this.elem.classList.add('success');
      } else {
        this.elem.classList.remove('success');
      }
    }
  }

  // Create picture card
  class AmazingCard extends Card {
    constructor(number, startStatus) {
      super(number, startStatus);
    }
    createAmazingCard() {
      this.elemWrap = document.createElement('div');
      this.elemWrap.classList.add('card-field__card-wrap');
      this.elem = document.createElement('div');
      this.elem.classList.add('card-field__card');
      if (this.id < amazingImagesForCards.length) {
        let cardContent = document.createElement('img');
        cardContent.src = `${amazingImagesForCards[this.id]}`;
        cardContent.alt = `${this.id}`;
        // On error
        cardContent.addEventListener('error', () => {
          let newElem =  document.createElement('span');
          newElem.textContent = `${this.id}`;
          cardContent.parentNode.append(newElem);
          cardContent.parentNode.removeChild(cardContent);
          throw new TypeError('Ошибка загрузки изображения');
        });
        this.elem.append(cardContent);
        this.elemWrap.append(this.elem);
        return this.elemWrap;
      } else {
        if (_emptyImagesNotification === 0) {
          _emptyImagesNotification = 1;
          console.log('Закончились доступные изображения!');
        }
        return this.createCard();
      }
    }
  }

  // Main constructor
  class createCardField {
    constructor(container) {
      // RAM
      this.checker = [];
      // Settings
      this.cardField = document.querySelector(`${container}`);
      this.id = 0;
      this.pairs = defaultPairs;
      this.cardArray = [];
      this.foundPairs = 0;
    }

    // Start
    start() {
      this.cardField.classList.remove('won');
      this.pairs = defaultPairs;

      this.clearField();
      this.createCards(this.id);
      this.cardArrayShuffle();
      this.renderOnPage(this.cardArray);
    }

    // Create cards
    createCards() {
      let _cardArrayRaw = [];

      // Get Cards
      for (let i = 0; i < this.pairs; i++) {
        let card = new AmazingCard(this.id);
        let cardClone = new AmazingCard(this.id);
        _cardArrayRaw.push(card);
        _cardArrayRaw.push(cardClone);
        this.id++;
      }
      // Place Events
      _cardArrayRaw.forEach(element => {
        let htmlElem = element.createAmazingCard();
        htmlElem.addEventListener('click', () => {
          if (element.success) {
            return;
          }
          if (element.open) {
            element.open = false;
            return;
          }
          element.open = true;
          // htmlElem.classList.add('show');
          this.checkCard(element);
        });
        this.cardArray.push(htmlElem);
      });
    }

    checkCard(element) {
      if (element.sussess) {
        throw new TypeError('Проверяется найденная карта');
      }
      if (!element.open) {
        throw new TypeError('Проверяется закрытая карта');
      }
      // Если нет второй карты
      if (this.checker.length < 1) {
        this.checker.push(element);
        return;
      }
      // Если тот же самый элемент
      if (this.checker[0].elem === element.elem) {
        return;
      }
      if (this.checker[0].id === element.id) {
        // this.checker[0].elem.classList.add('success');
        // element.elem.classList.add('success');
        this.checker[0].success = true;
        element.success = true;
        this.checker = [];
        this.foundPairs++;
        if (this.foundPairs == this.pairs) {
          this.win();
        }
      } else {
        this.checker.open = false;
        element.open = false;
        // Save for timeOut
        let timeoutSavedElem = this.checker[0].elem;
        let timeoutSavedElem2 = element.elem;
        // Clear
        this.checker = [];
        // Delayed flip
        setTimeout(() => {
          timeoutSavedElem.classList.remove('show');
          timeoutSavedElem2.classList.remove('show');
        }, defaultDelayOpen);
      }
    }

    // Shuffle
    cardArrayShuffle() {
      this.cardArray = this.cardArray.sort(function () {
        return Math.random() - 0.5;
      });
    }

    // Show two cards on page
    renderOnPage(array) {
      array.forEach(element => {
        this.cardField.append(element);
      });
    }

    // Clear container
    clearField() {
      this.cardField.innerHTML = '';
    }

    win() {
      this.cardField.classList.add('won');
    }
  }

  function checkRules() {
    const cardSettingsPairs = document.getElementById('cardSettingsPairs');
    const cardSettingsCardDelay = document.getElementById('cardSettingsCardDelay');

    cardSettingsPairs.addEventListener('blur', () => {
      if ((cardSettingsPairs.value >= 2) && (cardSettingsPairs.value <= 50)) {
        defaultPairs = cardSettingsPairs.value;
      } else {
        cardSettingsPairs.value = defaultPairs;
      }
    });

    cardSettingsCardDelay.addEventListener('blur', () => {
      if ((cardSettingsCardDelay.value >= 0) && (cardSettingsCardDelay.value <= 2000)) {
        defaultDelayOpen = cardSettingsCardDelay.value;
      } else {
        cardSettingsCardDelay.value = defaultDelayOpen;
      }
    });
  }

  // init
  function startGame() {
    _emptyImagesNotification = 0;
    new createCardField('#cardField').start();
  }
  let startButton = document.getElementById('cardStart');
  checkRules();
  startButton.addEventListener('click', () => {
    startGame();
  });
});
