'use strict';

const initialText =
  'Weź udział i zarejestruj się już teraz, żeby nie stracić okazji. Promocja z ograniczonym czasem. Śpiesz się! Bądź pierwszy! Zarejestruj się!';

const registerText = 'Rejestracja';
const loginText = 'Logowanie';

/**
 * @class InitialModel
 *
 * Manages the data of the application.
 */
class InitialModel {
  constructor() {}

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
class InitialView {
  constructor() {
    this.app = document.querySelector('#root');
    this.header = document.querySelector('.header');
    this.headerNav = this.createElement('nav', 'header-nav');
    this.app.innerHTML = '';
    this.header.innerHTML = '';

    this.initialContainer = this.createElement('div');
    this.initialContainer.classList.add('initial-container');
    this.headerNav.innerHTML = `
      <ul class="nav-list-non-logged">
        <li class="button-style" id="register-nav-button">
          ${registerText}
        </li>
        <li class="button-style" id="login-nav-button">
          ${loginText}
        </li>
      </ul>
    `;

    this.initialContainer.innerHTML = `
      <div class="initial-container">
       <p>${initialText}</p>
      </div>
    `;

    this.header.append(this.headerNav);
    this.app.append(this.initialContainer);
  }

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
}
