'use strict';

/**
 * @class TransactionsModel
 *
 * Manages the data of the application.
 */
class TransactionsModel extends TranslationModel {
  #transactionsUrl = 'https://api.jsonbin.io/v3/b/63a092ab15ab31599e2045be';
  #transactionsAccessToken = '$2b$10$5pBRUbFRKdKft/b8qSQ3IeyPQgQ8CLXlvgoQA6GdpYvdWva.pOfGS';
  #HTTPRequestMethod = 'GET';

  constructor() {
    super();
  }

  async getTransactionsData() {
    const transactionsResponse = await fetch(this.#transactionsUrl, {
      method: this.#HTTPRequestMethod,
      headers: {
        'Content-Type': 'application/json',
        'x-access-key': this.#transactionsAccessToken,
      },
    });
    return await transactionsResponse.json();
  }
}

/**
 * @class TransactionsView
 *
 * Visual representation of the model.
 */
class TransactionsView extends TranslationView {
  constructor() {
    super(globalStateLanguage);
    this.initView();
  }

  initView() {
    this.app = document.querySelector('#root');
    this.app.innerHTML = '<h1>Hello</h1>';

    this.headerNav = document.querySelector('.header-nav');
    this.languageDiv = this.createElement('div', 'language-div');
    this.languageDiv.innerHTML = `
        <button id="change-language">${this.language}</button>
    `;
    this.headerNav.append(this.languageDiv);
    this.changeLanguageButton = document.querySelector('#change-language');
    console.log('init transactions');
  }

  async bindShowData(handlerGetTransactionsData) {
    const transactionsData = await handlerGetTransactionsData();
    console.log(transactionsData);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindLanguageChange(handleLanguageChange) {
    document.querySelector('#change-language').addEventListener('click', () => {
      if (this.language === 'pl') {
        this.language = 'en';
        globalStateLanguage = 'en';
      } else {
        this.language = 'pl';
        globalStateLanguage = 'pl';
      }
      this.translation = handleLanguageChange(this.language);
      this.changeLanguageButton.textContent = this.language;
      console.log('transactions view');
      new TransactionsController(
        new TransactionsModel(),
        new TransactionsView()
      );
    });
  }
}
