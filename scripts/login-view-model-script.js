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

    if (this.#isUserDataValid) {
      const loggedInUser = {
        userName,
        userPassword,
      };
      this.#commitCurrentLoggedInUser(loggedInUser);
    }

    return {
      userNameIsValidMessage,
      userPasswordIsValidMessage,
    };
  }

  #login(userName) {
    return userName;
  }

  loginUser(user) {
    const { userName } = user;
    if (this.#isUserDataValid) {
      this.#isUserDataValid = false;
      return this.#login(userName);
    }
  }

  switchViewToTransactions(name) {
    new TransactionsController(
      new TransactionsModel(this.language, name),
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
    console.log('languageChange LoginController');
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
    this.initView();
  }

  initView() {
    this.refreshListeners();
    this.app = document.querySelector('#root');
    // If there is switch don't clear
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

    this.formContainer = this.createElement('div');
    this.formContainer.classList.add('form-container');

    this.formContainer.innerHTML = `
      <h1 class="form-title">${this.translation.loginTitle}</h1>
      <form class="form-style">
        <div class="single-input">
          <label for="user-name">${this.translation.userNameInputLabel}</label>
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
          <label for="user-password">${this.translation.userPasswordInputLabel}</label>
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

    // If there is switch don't append
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

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  #displayUserAfterAndSwitchToTransactions(
    handleLoginUser,
    user,
    handleSwitchViewToTransactions
  ) {
    const name = handleLoginUser(user);
    if (name) {
      handleSwitchViewToTransactions(name);
    }
  }

  bindLoginUser(handleLoginUser, handleSwitchViewToTransactions) {
    if (!this.autoLogin) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const user = {
          userName: this.#userName,
          userPassword: this.#userPassword,
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

  #validateUserData(handleValidateUserData) {
    const user = {
      userName: this.#userName,
      userPassword: this.#userPassword,
    };

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
  bindValidateUserData(handleValidateUserData) {
    if (!this.autoLogin) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.#validateUserData(handleValidateUserData);
      });
    } else {
      this.#validateUserData(handleValidateUserData);
    }
  }

  bindSwitchViewToRegister(handleSwitchViewToRegister) {
    const registerNavButton = document.querySelector('#register-nav-button');
    if (registerNavButton)
      registerNavButton.addEventListener('click', handleSwitchViewToRegister);
  }

  // bindLanguageChange() {
  //   document
  //     .querySelector('#change-language-button')
  //     .addEventListener('click', () => {
  //       this.changeLanguageButton.textContent =
  //         this.changeLanguageButton.textContent === 'en' ? 'pl' : 'en';

  //       this.language = this.language === 'pl' ? 'en' : 'pl';
  //       console.log('login view');
  //       new LoginController(
  //         new LoginModel(this.autoLogin, this.language),
  //         new LoginView(this.autoLogin, this.language)
  //       );
  //     });
  // }
}
