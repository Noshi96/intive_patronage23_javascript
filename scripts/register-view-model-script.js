'use strict';

/**
 * @class RegisterModel
 *
 * Manages the data of the application.
 */
class RegisterModel extends TranslationModel {
  constructor() {
    super();
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
class RegisterView extends TranslationView {
  constructor() {
    super('pl');
    this.initView();
  }

  initView() {
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
      <h1 class="form-title">${this.translation.registerTitle}</h1>
      <form class="form-style">
        <div class="single-input">
          <label for="user-name">${this.translation.userNameInputLabel}</label>
          <input
            id="username"
            type="text"
            placeholder="${this.translation.userNameInputText}"
            name="user-name"
            required 
            minlength="6"
            maxlength="16"
          />
          <span class="error-user-name error" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-password">${this.translation.userPasswordInputLabel}</label>
          <input
            id="password"
            type="password"
            placeholder="${this.translation.userPasswordInputText}"
            name="user-password"
            required 
            minlength="6"
          />
          <span class="error-user-password error" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-email">${this.translation.userEmailInputLabel}</label>
          <input
            id="email"
            type="email"
            placeholder="${this.translation.userEmailInputText}"
            name="user-email"
            required
          />
          <span class="error-user-email error" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="user-confirm-email">${this.translation.userEmailConfirmationInputLabel}</label>
          <input
            id="confirm-email"
            type="email"
            placeholder="${this.translation.userEmailConfirmationInputText}"
            name="user-confirm-email"
            required
          />
          <span class="error-user-confirm-email error" aria-live="polite"></span>
        </div>
        <button class="form-button">${this.translation.registerButtonText}</button>
      </form>
    `;

    this.form = this.formContainer.querySelector('.form-style');
    this.userName = this.formContainer.querySelector('#username');
    this.userNameError = this.formContainer.querySelector('.error-user-name');
    this.userPassword = this.formContainer.querySelector('#password');
    this.userEmail = this.formContainer.querySelector('#email');
    this.userEmailError = this.formContainer.querySelector('.error-user-email');
    this.userConfirmEmail = this.formContainer.querySelector('#confirm-email');
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
      new RegisterController(new RegisterModel(), new RegisterView());
    });
  }
}
