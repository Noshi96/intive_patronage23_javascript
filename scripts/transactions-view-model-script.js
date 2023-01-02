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

  constructor(language, userName) {
    super(language);
    this.userName = userName;
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

  #commitCurrentLoggedInUser(user) {
    localStorage.setItem('currentLoggedInUser', JSON.stringify(user));
  }

  #logout() {
    this.#commitCurrentLoggedInUser(null);
    new InitialController(
      new InitialModel(this.language),
      new InitialView(this.language)
    );
  }

  logoutUser() {
    this.#logout();
  }

  getLoggedInUserName() {
    return this.userName;
  }

  languageChange(language) {
    new TransactionsController(
      new TransactionsModel(language, this.userName),
      new TransactionsView(language)
    );
  }
}

/**
 * @class TransactionsView
 *
 * Visual representation of the model.
 */
class TransactionsView extends TranslationView {
  constructor(language) {
    super(language);
    this.initView();
  }

  initView() {
    this.refreshListeners();
    this.changeLanguageButton = document.querySelector(
      '#change-language-button'
    );
    this.app = document.querySelector('#root');
    this.app.innerHTML = '<h1>Hello</h1>';
  }

  async bindShowData(handleGetTransactionsData) {
    const transactionsData = await handleGetTransactionsData();
    console.log(transactionsData);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindLogoutUser(handleLogoutUser) {
    this.logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.navListLoggedIn.innerHTML = '';
      handleLogoutUser();
    });
  }

  bindLoadHeaderAndUserName(handleGetLoggedInUserName) {
    const userName = handleGetLoggedInUserName();
    this.headerNav = document.querySelector('.header-nav');
    this.languageButtonContainer = this.createElement(
      'div',
      'language-button-container'
    );
    this.languageButtonContainer.innerHTML = `
      <button id="change-language-button">
        ${this.language === 'en' ? 'pl' : 'en'}
      </button>
    `;

    this.navListLoggedIn = this.createElement('ul', 'nav-list-logged-in');

    this.loggedName = document.createElement('li');
    this.loggedName.setAttribute('id', 'logged-name');

    this.logoutButton = document.createElement('li');
    this.logoutButton.setAttribute('id', 'log-out');
    this.logoutButton.classList.add('button-style');

    this.logoutButton.textContent = this.translation.logoutText;

    this.loggedName.textContent = userName;
    this.navListLoggedIn.append(this.loggedName);
    this.navListLoggedIn.append(this.logoutButton);
    this.headerNav.innerHTML = '';
    this.headerNav.append(this.navListLoggedIn);
    this.headerNav.append(this.languageButtonContainer);

    console.log('init transactions');
  }

  // bindLanguageChange() {
  //   document
  //     .querySelector('#change-language-button')
  //     .addEventListener('click', () => {
  //       this.language = this.language === 'pl' ? 'en' : 'pl';
  //       new TransactionsController(
  //         new TransactionsModel(this.language),
  //         new TransactionsView(this.userName, this.language)
  //       );
  //     });
  // }
}
