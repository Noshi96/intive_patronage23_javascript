'use strict';

/**
 * @class LoginModel
 *
 * Manages the data of the application.
 */
class LoginModel extends TranslationModel {
  constructor(autoLogin = false, language) {
    super(language);
    this.autoLogin = autoLogin;
    this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  #isUserDataValid = false;

  #commitCurrentLoggedInUser(user) {
    localStorage.setItem('currentLoggedInUser', JSON.stringify(user));
  }

  #validateUserName(name) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmailValid = name.match(emailRegExp);

    const existingUser = this.users.filter(
      ({ userName, userEmail }) => userName === name || userEmail === name
    );
    this.id = existingUser.id;

    if (existingUser.length !== 1 && isEmailValid) {
      return this.translation.incentiveToOpenAccountText;
    }
    if (existingUser.length !== 1) {
      return this.translation.incorrectPasswordOrUsername;
    }

    return 'valid';
  }

  #validateUserPassword(name, password) {
    const existingUser = this.users.filter(
      ({ userName, userEmail }) => userName === name || userEmail === name
    );

    if (existingUser.length !== 1) {
      return this.translation.incorrectPasswordOrUsername;
    }

    const incomingUserHashPassword = this.#hashUserPassword(password);

    const isPasswordValid =
      existingUser[0].userPassword.toString() ===
      incomingUserHashPassword.toString();

    if (!isPasswordValid) {
      return this.translation.incorrectPasswordOrUsername;
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
    const { userName, userPassword, id } = user;

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

    if (this.#isUserDataValid) {
      const loggedInUser = {
        userName,
        userPassword,
        id,
      };
      this.#commitCurrentLoggedInUser(loggedInUser);
    }

    return {
      userNameIsValidMessage,
      userPasswordIsValidMessage,
    };
  }

  loginUser(user) {
    if (this.#isUserDataValid) {
      this.#isUserDataValid = false;
      return user;
    }
  }

  getUserId(name) {
    if (name) {
      const existingUser = this.users.filter(
        ({ userName, userEmail }) => name === userName || name === userEmail
      );
      return existingUser[0]?.id;
    }
  }

  switchViewToTransactions(user, isFirstLogin = false) {
    new TransactionsController(
      new TransactionsModel(
        this.language,
        user.userName,
        false,
        user,
        isFirstLogin
      ),
      new TransactionsView(this.language)
    );
  }

  switchViewToRegister() {
    new RegisterController(
      new RegisterModel(this.language),
      new RegisterView(this.language)
    );
  }

  languageChange(language) {
    new LoginController(
      new LoginModel(this.autoLogin, language),
      new LoginView(this.autoLogin, language)
    );
  }
}

/**
 * @class LoginView
 *
 * Visual representation of the model.
 */
class LoginView extends TranslationView {
  constructor(autoLogin = false, language) {
    super(language);
    this.autoLogin = autoLogin;
    this.#initView();
  }

  #initView() {
    this.removeListeners();
    this.app = document.querySelector('#root');

    if (!this.autoLogin) {
      this.app.innerHTML = '';
    }

    this.registerNavButton = document.getElementById('register-nav-button');
    this.loginNavButton = document.getElementById('login-nav-button');
    this.registerNavButton.style.visibility = 'visible';
    this.loginNavButton.style.visibility = 'hidden ';
    this.registerNavButton.classList.remove('hide');
    this.loginNavButton.classList.add('hide');

    this.registerNavButton.textContent = this.translation.registerText;

    this.formContainer = this.#createElement('div');
    this.formContainer.classList.add('form-container');

    this.formContainer.innerHTML = `
      <h1 class="form-title">${this.translation.loginTitle}</h1>
      <form class="form-style">
        <div class="single-input">
          <label for="username">${this.translation.userNameInputLabel}</label>
          <input
            id="username"
            type="text"
            placeholder="${this.translation.userNameInputLoginText}"
            name="user-name"
            required 
            minlength="6"
            maxlength="50"
          />
          <span class="error-user-name error" aria-live="polite"></span>
        </div>
        <div class="single-input">
          <label for="password">${this.translation.userPasswordInputLabel}</label>
          <input
            id="password"
            type="password"
            placeholder="${this.translation.userPasswordInputLoginText}"
            name="user-password"
            required 
            minlength="6"
          />
          <span class="error-user-password error" aria-live="polite"></span>
        </div>
        <button class="form-button">${this.translation.loginButtonText}</button>
      </form>
    `;

    this.form = this.formContainer.querySelector('.form-style');
    this.userName = this.formContainer.querySelector('#username');
    this.userNameError = this.formContainer.querySelector('.error-user-name');
    this.userPassword = this.formContainer.querySelector('#password');
    this.userPasswordError = this.formContainer.querySelector(
      '.error-user-password'
    );

    if (!this.autoLogin) {
      this.app.append(this.formContainer);
    }

    this.changeLanguageButton = document.querySelector(
      '#change-language-button'
    );
  }

  get #userName() {
    return this.userName.value;
  }
  get #userPassword() {
    return this.userPassword.value;
  }

  #createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  #displayUserAfterAndSwitchToTransactions(
    handleLoginUser,
    user,
    handleSwitchViewToTransactions
  ) {
    const userToLogin = handleLoginUser(user);
    if (userToLogin?.userName) {
      handleSwitchViewToTransactions(userToLogin);
    }
  }

  bindLoginUser(
    handleLoginUser,
    handleSwitchViewToTransactions,
    handleGetUserId
  ) {
    if (!this.autoLogin) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = handleGetUserId(this.#userName);
        const user = {
          userName: this.#userName,
          userPassword: this.#userPassword,
          id,
        };
        this.#displayUserAfterAndSwitchToTransactions(
          handleLoginUser,
          user,
          handleSwitchViewToTransactions
        );
      });
    } else {
      this.#displayUserAfterAndSwitchToTransactions(
        handleLoginUser,
        {},
        handleSwitchViewToTransactions
      );
    }
  }

  #validateUserData(handleValidateUserData, handleGetUserId) {
    const id = handleGetUserId(this.#userName);
    const user = {
      userName: this.#userName,
      userPassword: this.#userPassword,
      id,
    };
    this.userPasswordError.innerHTML = '';
    this.userNameError.innerHTML = '';

    const {
      userNameIsValidMessage,
      userPasswordIsValidMessage,
    } = handleValidateUserData(user);
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
  }

  // If there is automatic logging then skip listening and run validation from the model
  bindValidateUserData(handleValidateUserData, handleGetUserId) {
    if (!this.autoLogin) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.#validateUserData(handleValidateUserData, handleGetUserId);
      });
    } else {
      this.#validateUserData(handleValidateUserData, handleGetUserId);
    }
  }

  bindSwitchViewToRegister(handleSwitchViewToRegister) {
    const registerNavButton = document.querySelector('#register-nav-button');
    if (registerNavButton)
      registerNavButton.addEventListener('click', handleSwitchViewToRegister);
  }
}
