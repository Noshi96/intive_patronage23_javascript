'use strict';

/**
 * @class InitialModel
 *
 * Manages the data of the application.
 */
class InitialModel extends TranslationModel {
  constructor(language) {
    super(language);
  }

  initRegister() {
    new RegisterController(
      new RegisterModel(this.language),
      new RegisterView(this.language)
    );
  }

  initLogin() {
    new LoginController(
      new LoginModel(false, this.language),
      new LoginView(false, this.language)
    );
  }

  languageChange(language) {
    new InitialController(
      new InitialModel(language),
      new InitialView(language)
    );
  }
}

/**
 * @class InitialView
 *
 * Visual representation of the model.
 */
class InitialView extends TranslationView {
  constructor(language) {
    super(language);
    this.#initView();
  }

  #initView = () => {
    this.removeListeners();
    this.app = document.querySelector('#root');
    this.header = document.querySelector('.header');
    this.headerNav = this.#createElement('nav', 'header-nav');
    this.initialContainer = this.#createElement('div');
    this.initialContainer.classList.add('initial-container');
    this.app.innerHTML = '';
    this.header.innerHTML = '';
    this.headerNav.innerHTML = `
    <ul class="nav-list-non-logged">
      <li class="button-style" id="login-nav-button">
        ${this.translation.loginText}
      </li>
      <li class="button-style" id="register-nav-button">
        ${this.translation.registerText}
      </li>
    </ul>
  `;

    this.initialContainer.innerHTML = `
       <p>${this.translation.initialText}</p>
    `;

    this.header.append(this.headerNav);
    this.app.append(this.initialContainer);

    this.languageButtonContainer = this.#createElement(
      'div',
      'language-button-container'
    );
    this.languageButtonContainer.innerHTML = `
        <button id="change-language-button">${
          this.language === 'en' ? 'pl' : 'en'
        }</button>
    `;

    this.headerNav.append(this.languageButtonContainer);
    this.changeLanguageButton = this.languageButtonContainer.querySelector(
      '#change-language-button'
    );
  };

  #createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindInitRegister(handleInitRegister) {
    document
      .querySelector('#register-nav-button')
      .addEventListener('click', () => {
        handleInitRegister();
      });
  }

  bindInitLogin(handleInitLogin) {
    document
      .querySelector('#login-nav-button')
      .addEventListener('click', () => {
        handleInitLogin();
      });
  }
}
