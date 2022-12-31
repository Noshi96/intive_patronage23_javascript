'use strict';

/**
 * @class InitialModel
 *
 * Manages the data of the application.
 */
class InitialModel extends TranslationModel {
  constructor() {
    super();
  }

  initRegister() {
    globalRegisterController = new RegisterController(
      new RegisterModel(),
      new RegisterView()
    );
  }
  initLogin() {
    globalLoginController = new LoginController(
      new LoginModel(),
      new LoginView()
    );
  }
}

/**
 * @class InitialView
 *
 * Visual representation of the model.
 */
class InitialView extends TranslationView {
  constructor() {
    super(globalStateLanguage);
    this.initView();
  }

  initView = () => {
    this.app = document.querySelector('#root');
    this.header = document.querySelector('.header');
    this.headerNav = this.createElement('nav', 'header-nav');
    this.initialContainer = this.createElement('div');
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

    this.languageDiv = this.createElement('div', 'language-div');
    this.languageDiv.innerHTML = `
        <button id="change-language">${
          this.language === 'en' ? 'pl' : 'en'
        }</button>
    `;

    this.headerNav.append(this.languageDiv);
    this.changeLanguageButton = this.languageDiv.querySelector(
      '#change-language'
    );
  };

  createElement(tag, className) {
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

  bindLanguageChange(handleLanguageChange) {
    this.changeLanguageButton.addEventListener('click', () => {
      if (this.language === 'pl') {
        this.language = 'en';
        globalStateLanguage = 'en';
      } else {
        this.language = 'pl';
        globalStateLanguage = 'pl';
      }
      this.translation = handleLanguageChange(this.language);
      this.changeLanguageButton.textContent = this.language;
      console.log('initial');
      new InitialController(new InitialModel(), new InitialView());
    });
  }
}
