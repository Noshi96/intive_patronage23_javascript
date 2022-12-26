'use strict';

const loginTitle = 'Zaloguj się';
const loginButtonText = 'Zaloguj';

const incentiveToOpenAccountText =
  'Załóż konto na tego maila klikając w Zarejestruj.';
const incorrectPasswordOrUsername = 'Incorrect password or user name.';

const userNameInputLabel = 'Nazwa użytkownika';
const userPasswordInputLabel = 'Hasło';

const userNameInputLoginText = 'Podaj nazwę użytkownika';
const userPasswordInputLoginText = 'Podaj hasło';

/**
 * @class Model
 *
 * Manages the data of the application.
 */
class LoginModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  #login(userName) {
    console.log(userName);
  }

  #isUserDataValid = false;

  loginUser({ userName }) {
    if (this.#isUserDataValid) {
      this.#login(userName);
    }
  }

  #validateUserName(name) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = name.match(emailRegExp);

    const existingUser = this.users.filter(
      ({ userName, userEmail }) => userName === name || userEmail === name
    );

    if (existingUser.length !== 1 && isEmailValid) {
      return incentiveToOpenAccountText;
    }
    if (existingUser.length !== 1) {
      return incorrectPasswordOrUsername;
    }

    return 'valid';
  }

  #validateUserPassword(name, password) {
    const existingUser = this.users.filter(
      ({ userName, userEmail }) => userName === name || userEmail === name
    );

    if (existingUser.length !== 1) {
      return incorrectPasswordOrUsername;
    }

    const incomingUserHashPassword = this.#hashUserPassword(password);

    const isPasswordValid =
      existingUser[0].userPassword.toString() ===
      incomingUserHashPassword.toString();

    if (!isPasswordValid) {
      return incorrectPasswordOrUsername;
    }

    return 'valid';
  }

  #hashUserPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      let chr = password.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  validateUserData(user) {
    const { userName, userPassword } = user;

    if (!userName && !userPassword) {
      this.#isUserDataValid = false;
    }

    const userNameIsValidMessage = this.#validateUserName(userName);
    const userPasswordIsValidMessage = this.#validateUserPassword(
      userName,
      userPassword
    );

    this.#isUserDataValid =
      userNameIsValidMessage === 'valid' &&
      userPasswordIsValidMessage === 'valid';

    return {
      userNameIsValidMessage,
      userPasswordIsValidMessage,
    };
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class LoginView {
  constructor() {
    this.app = document.querySelector('#root');
    this.app.innerHTML = '';

    this.formContainer = this.createElement('div');
    this.formContainer.classList.add('form-container');

    this.formContainer.innerHTML = `
      <h1 class="form-title">${loginTitle}</h1>
      <form class="form-style">
        <div class="single-input">
          <label for="user-name">${userNameInputLabel}</label>
          <input
            id="username"
            type="text"
            placeholder="${userNameInputLoginText}"
            name="user-name"
            required 
            minlength="6"
            maxlength="16"
          />
          <span class="error-user-name error" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-password">${userPasswordInputLabel}</label>
          <input
            id="password"
            type="password"
            placeholder="${userPasswordInputLoginText}"
            name="user-password"
            required 
            minlength="6"
          />
          <span class="error-user-password error" aria-live="polite"></span>
        </div>
        <button class="form-button">${loginButtonText}</button>
      </form>
    `;

    this.form = this.formContainer.querySelector('.form-style');
    this.userName = this.formContainer.querySelector('#username');
    this.userNameError = this.formContainer.querySelector('.error-user-name');
    this.userPassword = this.formContainer.querySelector('#password');
    this.userPasswordError = this.formContainer.querySelector(
      '.error-user-password'
    );

    this.app.append(this.formContainer);
  }

  get #userName() {
    return this.userName.value;
  }
  get #userPassword() {
    return this.userPassword.value;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindLoginUser(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = {
        userName: this.#userName,
        userPassword: this.#userPassword,
      };
      handler(user);
    });
  }

  bindValidateUserData(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = {
        userName: this.#userName,
        userPassword: this.#userPassword,
      };

      const { userNameIsValidMessage, userPasswordIsValidMessage } = handler(
        user
      );

      // If the error notifications are the same, the error is displayed only after password input
      if (userNameIsValidMessage === userPasswordIsValidMessage) {
        this.userPasswordError.textContent =
          userPasswordIsValidMessage !== 'valid'
            ? userPasswordIsValidMessage
            : '';
      } else {
        this.userNameError.textContent =
          userNameIsValidMessage !== 'valid' ? userNameIsValidMessage : '';
        this.userPasswordError.textContent =
          userPasswordIsValidMessage !== 'valid'
            ? userPasswordIsValidMessage
            : '';
      }
    });
  }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class LoginController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindLoginUser(this.handleLoginUser);
  }

  handleLoginUser = (userProp) => {
    this.model.loginUser(userProp);
  };

  handleValidateUserData = (user) => {
    return this.model.validateUserData(user);
  };
}

const loginInitApp = new LoginController(new LoginModel(), new LoginView());
