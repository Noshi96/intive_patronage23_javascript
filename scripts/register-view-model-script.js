'use strict';

const registerTitle = 'Zarejestruj się';
const registerButtonText = 'Zarejestruj';

// const userNameInputLabel = 'Nazwa użytkownika';
// const userPasswordInputLabel = 'Hasło';
const userEmailInputLabel = 'Email';
const userEmailConfirmationInputLabel = 'Potwierdź email';

const userNameInputText = 'Utwórz nazwę użytkownika';
const userPasswordInputText = 'Utwórz hasło';
const userEmailInputText = 'Podaj adres e-mail';
const userEmailConfirmationInputText = 'Wpisz e-mail ponownie';

const isUserNameValidText =
  'The user name must not contain forbidden characters.';
const isUserNameDuplicatedText = 'Duplicated user name.';
const isEnoughLettersText = 'Not enough characters.';
const isEnoughDigitsText = 'Not enough digits.';

const isEmailValidText = 'Wrong email format.';
const isDuplicatedEmailWithAliasText = 'Duplicated email with alias.';
const isDuplicatedEmailText = 'Duplicated email.';
const isEmailAndConfirmEmailValidText = 'Confirm email is different then email';

/**
 * @class RegisterModel
 *
 * Manages the data of the application.
 */
class RegisterModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  #commit(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  #isUserDataValid = false;

  addUser({ userName, userEmail, userPassword }) {
    if (this.#isUserDataValid) {
      const user = {
        userName,
        userEmail,
        userPassword: this.#hashUserPassword(userPassword),
        id: self.crypto.randomUUID(),
      };

      this.users.push(user);
      this.#commit(this.users);

      const sameUserWithoutHash = {
        userName,
        userEmail,
        userPassword,
        id: user.id,
      };

      // automatic login as soon as registration is correct
      const accessForAutoLogin = true;
      const loginController = new LoginController(
        new LoginModel(accessForAutoLogin),
        new LoginView(accessForAutoLogin, sameUserWithoutHash),
        sameUserWithoutHash
      );
    }
  }

  #validateUserName(name) {
    const userRegExp = /^[a-zA-Z0-9 \/\\[\]_-]+$/;
    const isUserNameValid = name.match(userRegExp);
    const countLetters = name.replace(/[^[a-zA-Z]/g, '').length;
    const countDigits = name.replace(/[^0-9]/g, '').length;
    const isDuplicated = this.users.some(({ userName }) => userName === name);

    if (!isUserNameValid) {
      return isUserNameValidText;
    }
    if (isDuplicated) {
      return isUserNameDuplicatedText;
    }
    if (countLetters < 5) {
      return isEnoughLettersText;
    }
    if (countDigits < 1) {
      return isEnoughDigitsText;
    }
    return 'valid';
  }

  #validateUserEmail(email) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = email.match(emailRegExp);
    let isDuplicatedEmailWithAlias = false;

    if (!isEmailValid) {
      return isEmailValidText;
    }

    const isPlusInEmail = (checkEmail) => {
      return checkEmail.split('').some((char) => char === '+');
    };

    const firstPartOfEmailWithAlias = email.split('+').at(0);

    if (isPlusInEmail(email)) {
      const userWithDuplicatedEmailFirstPart = this.users.filter(
        ({ userEmail }) => {
          // myEmail+elo@gmail.com and myEmail@gmail.com
          if (isPlusInEmail(userEmail)) {
            return userEmail.split('+').at(0) === firstPartOfEmailWithAlias;
          } else {
            return userEmail.split('@').at(0) === email.split('+').at(0);
          }
        }
      );
      // myEmail+elo@gmail.com and myEmail+elo@wp.pl are not the same
      if (userWithDuplicatedEmailFirstPart) {
        userWithDuplicatedEmailFirstPart.forEach(({ userEmail }) => {
          const domain = userEmail.split('@').at(1);
          const duplicatedEmailWithAlias = email.split('@').at(1) === domain;

          if (duplicatedEmailWithAlias) {
            isDuplicatedEmailWithAlias = true;
          }
        });
      }
    }

    if (isDuplicatedEmailWithAlias) {
      return isDuplicatedEmailWithAliasText;
    }

    const isDuplicated = this.users.some(
      ({ userEmail }) => userEmail === email
    );

    if (isDuplicated) {
      return isDuplicatedEmailText;
    }
    return 'valid';
  }

  #validateUserConfirmEmail(email, confirmEmail) {
    return email !== confirmEmail ? isEmailAndConfirmEmailValidText : 'valid';
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
    const { userName, userPassword, userEmail, userConfirmEmail } = user;

    if (!userName && !userPassword && !userEmail && !userConfirmEmail) {
      this.#isUserDataValid = false;
    }

    const userNameIsValidMessage = this.#validateUserName(userName);
    const userEmailIsValidMessage = this.#validateUserEmail(userEmail);
    const userConfirmEmailIsValidMessage = this.#validateUserConfirmEmail(
      userEmail,
      userConfirmEmail
    );

    this.#isUserDataValid =
      userNameIsValidMessage === 'valid' &&
      userEmailIsValidMessage === 'valid' &&
      userConfirmEmailIsValidMessage === 'valid';

    return {
      userNameIsValidMessage,
      userEmailIsValidMessage,
      userConfirmEmailIsValidMessage,
    };
  }
}

/**
 * @class RegisterView
 *
 * Visual representation of the model.
 */
class RegisterView {
  constructor() {
    this.app = document.querySelector('#root');
    this.app.innerHTML = '';

    this.registerNavButton = document.getElementById('register-nav-button');
    this.loginNavButton = document.getElementById('login-nav-button');
    this.registerNavButton.style.visibility = 'hidden';
    this.loginNavButton.style.visibility = 'visible ';
    this.registerNavButton.classList.add('hide');
    this.loginNavButton.classList.remove('hide');

    this.formContainer = this.createElement('div');
    this.formContainer.classList.add('form-container');

    this.formContainer.innerHTML = `
      <h1 class="form-title">${registerTitle}</h1>
      <form class="form-style">
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
          <span class="error-user-name error" aria-live="polite"></span>
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
          <span class="error-user-password error" aria-live="polite"></span>
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
          <span class="error-user-email error" aria-live="polite"></span>
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
          <span class="error-user-confirm-email error" aria-live="polite"></span>
        </div>
        <button class="form-button">${registerButtonText}</button>
      </form>
    `;

    this.form = this.formContainer.querySelector('.form-style');
    this.userName = this.formContainer.querySelector('#username');
    this.userNameError = this.formContainer.querySelector('.error-user-name');
    this.userPassword = this.formContainer.querySelector('#password');
    this.userEmail = this.formContainer.querySelector('#email');
    this.userEmailError = this.formContainer.querySelector('.error-user-email');
    this.userConfirmEmail = this.formContainer.querySelector('#confirmemail');
    this.userConfirmEmailError = this.formContainer.querySelector(
      '.error-user-confirm-email'
    );
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

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindAddUser(handleAddUser) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = {
        userName: this.#userName,
        userPassword: this.#userPassword,
        userEmail: this.#userEmail,
        userConfirmEmail: this.#userConfirmEmail,
      };
      handleAddUser(user);
    });
  }

  bindValidateUserData(handleValidateUserData) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = {
        userName: this.#userName,
        userPassword: this.#userPassword,
        userEmail: this.#userEmail,
        userConfirmEmail: this.#userConfirmEmail,
      };

      const {
        userNameIsValidMessage,
        userEmailIsValidMessage,
        userConfirmEmailIsValidMessage,
      } = handleValidateUserData(user);

      this.userNameError.textContent =
        userNameIsValidMessage !== 'valid' ? userNameIsValidMessage : '';
      this.userEmailError.textContent =
        userEmailIsValidMessage !== 'valid' ? userEmailIsValidMessage : '';
      this.userConfirmEmailError.textContent =
        userConfirmEmailIsValidMessage !== 'valid'
          ? userConfirmEmailIsValidMessage
          : '';
    });
  }
}
