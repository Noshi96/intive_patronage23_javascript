'use strict';

const registerTitle = 'Zarejestruj się';
const registerButtonText = 'Zarejestruj';

const userNameInputLabel = 'Nazwa użytkownika';
const userPasswordInputLabel = 'Hasło';
const userEmailInputLabel = 'Email';
const userEmailConfirmationInputLabel = 'Potwierdź email';

const userNameInputText = 'Utwórz nazwę użytkownika';
const userPasswordInputText = 'Utwórz hasło';
const userEmailInputText = 'Podaj adres e-mail';
const userEmailConfirmationInputText = 'Wpisz e-mail ponownie';

/**
 * @class Model
 *
 * Manages the data of the application.
 */
class RegisterModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  #commit(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  addUser(userProp) {
    const user = {
      ...userProp,
      id: self.crypto.randomUUID(),
    };
    console.log({ user });
    //this.users.push(user);
    //this.#commit(this.users);
  }

  validateUserName(name) {
    const userRegExp = /^[a-zA-Z0-9 \/\\[\]_-]+$/;
    const isUserNameValid = name.match(userRegExp);
    const countLetters = str.replace(/[^[a-zA-Z]/g, '').length;
    const countDigits = str.replace(/[^0-9]/g, '').length;
    const isDuplicated = this.users.some(({ userName }) => userName === name);

    if (!isUserNameValid) {
      return 'User name is not valid.';
    }
    if (isDuplicated) {
      return 'Duplicated user name.';
    }
    if (countLetters < 5) {
      return 'Not enough characters.';
    }
    if (countDigits < 1) {
      return 'Not enough digits.';
    }
  }

  validateUserEmail(email) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = email.match(emailRegExp);

    if (!isEmailValid) {
      return 'Wrong email format.';
    }

    const isPlusInEmail = email.split('').some((char) => char === '+');
    const firstPartOfEmail = email.split('+').at(0);

    if (isPlusInEmail) {
      const userWithDuplicatedEmailFirstPart = this.users.filter(
        ({ userEmail }) => userEmail.split('+').at(0) === firstPartOfEmail
      );
      // myEmail+elo@gmail.com and myEmail+elo@wp.pl are not the same
      if (userWithDuplicatedEmailFirstPart) {
        const domain = userWithDuplicatedEmailFirstPart.email.split('@').at(1);
        const duplicatedEmailWithAlias = email.split('@').at(1) === domain;
        if (duplicatedEmailWithAlias) {
          return 'Duplicated email with alias.';
        }
      }
    }

    const isDuplicated = this.users.some(
      ({ userEmail }) => userEmail === email
    );
    if (isDuplicated) {
      return 'Duplicated email.';
    }
  }

  #hashUserPassword(password) {
    let hash = 0;
    for (let i = 0, len = password.length; i < len; i++) {
      let chr = password.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class RegisterView {
  constructor() {
    this.app = document.querySelector('#root');
    this.formContainer = this.createElement('div');
    this.formContainer.classList.add('register-form-container');

    this.formContainer.innerHTML = `
      <h1 class="register-form-title">${registerTitle}</h1>
      <form class="register-form">
        <div class="single-input">
          <label for="user-name">${userNameInputLabel}</label>
          <input
            id="username"
            type="text"
            placeholder="${userNameInputText}"
            name="user-name"
            required 
            minlength="6"
            maxlength="16"
          />
          <span class="error-user-name" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-password">${userPasswordInputLabel}</label>
          <input
            id="password"
            type="password"
            placeholder="${userPasswordInputText}"
            name="user-password"
            required 
            minlength="6"
          />
          <span class="error-user-password" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-email">${userEmailInputLabel}</label>
          <input
            id="email"
            type="email"
            placeholder="${userEmailInputText}"
            name="user-email"
            required
          />
          <span class="error-user-email" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-confirm-email">${userEmailConfirmationInputLabel}</label>
          <input
            id="confirmemail"
            type="email"
            placeholder="${userEmailConfirmationInputText}"
            name="user-confirm-email"
            required
          />
          <span class="error-user--confirm-email" aria-live="polite"></span>
        </div>
        <button class="register-button">${registerButtonText}</button>
      </form>
    `;

    this.form = this.formContainer.querySelector('.register-form');
    this.userName = this.formContainer.querySelector('#username');
    this.userPassword = this.formContainer.querySelector('#password');
    this.userEmail = this.formContainer.querySelector('#email');
    this.userConfirmEmail = this.formContainer.querySelector('#confirmemail');
    this.app.append(this.formContainer);
  }

  get #userName() {
    return this.userName.value;
  }
  get #userPassword() {
    return this.userPassword.value;
  }
  get #userEmail() {
    return this.userEmail.value;
  }
  get #userConfirmEmail() {
    return this.userConfirmEmail.value;
  }

  #resetInputs() {
    this.userName.value = '';
    this.userPassword.value = '';
    this.userEmail.value = '';
    this.userConfirmEmail.value = '';
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindAddUser(handler) {
    // this.form.addEventListener('submit', (event) => {
    //   event.preventDefault();
    //   const user = {
    //     userName: this.#userName,
    //     userPassword: this.#userPassword,
    //     userEmail: this.#userEmail,
    //     userConfirmEmail: this.#userConfirmEmail,
    //   };
    //   if (
    //     this.#userName &&
    //     this.#userPassword &&
    //     this.#userEmail &&
    //     this.#userConfirmEmail
    //   ) {
    //     handler(user);
    //     this.#resetInputs();
    //   }
    // });
  }

  bindValidateUserData(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = {
        userName: this.#userName,
        userPassword: this.#userPassword,
        userEmail: this.#userEmail,
        userConfirmEmail: this.#userConfirmEmail,
      };
      handler(user);
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
class RegisterController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddUser(this.handleAddUser);
    this.view.bindValidateUserData(this.handleValidateUserData);
  }

  handleAddUser = (userProp) => {
    this.model.addUser(userProp);
  };

  handleValidateUserData = (user) => {
    this.model.validateUserData(user);
  };
}

const registerInitApp = new RegisterController(
  new RegisterModel(),
  new RegisterView()
);
