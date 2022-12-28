'use strict';

const loginTitle = 'Zaloguj się';
const loginButtonText = 'Zaloguj';

const incentiveToOpenAccountText =
  'Załóż konto na tego maila klikając w Rejestracja.';
const incorrectPasswordOrUsername = 'Incorrect password or user name.';

const userNameInputLabel = 'Nazwa użytkownika';
const userPasswordInputLabel = 'Hasło';

const userNameInputLoginText = 'Podaj nazwę użytkownika';
const userPasswordInputLoginText = 'Podaj hasło';

const logoutText = 'Wyloguj';

/**
 * @class LoginModel
 *
 * Manages the data of the application.
 */
class LoginModel {
  constructor(autoLogin = false) {
    this.autoLogin = autoLogin;
    this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  }

  #userLoggedIn = false;
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
    this.#userLoggedIn = true;
    return userName;
  }

  #logout() {
    this.#commitCurrentLoggedInUser(null);
    new InitialController(new InitialModel(), new InitialView());
    this.#userLoggedIn = false;
  }

  loginUser(user) {
    const { userName } = user;
    if (this.#isUserDataValid) {
      this.#isUserDataValid = false;
      return this.#login(userName);
    }
  }

  logoutUser() {
    if (this.#userLoggedIn) {
      this.#logout();
    }
  }
}

/**
 * @class LoginView
 *
 * Visual representation of the model.
 */
class LoginView {
  constructor(autoLogin = false) {
    this.autoLogin = autoLogin;

    this.app = document.querySelector('#root');
    this.headerNav = document.querySelector('.header-nav');
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

    this.logoutButton = document.createElement('li');
    this.logoutButton.setAttribute('id', 'log-out');
    this.logoutButton.classList.add('button-style');
    this.logoutButton.textContent = logoutText;

    this.navListLoggedIn = this.createElement('ul', 'nav-list-logged-in');

    this.loggedName = document.createElement('li');
    this.loggedName.setAttribute('id', 'logged-name');

    // If there is switch don't append
    if (!this.autoLogin) {
      this.app.append(this.formContainer);
    }
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

  #displayUserAfterLogin(handleLoginUser, user) {
    const name = handleLoginUser(user);
    if (name) {
      this.loggedName.textContent = name;
      this.navListLoggedIn.append(this.loggedName);
      this.navListLoggedIn.append(this.logoutButton);
      this.headerNav.innerHTML = '';
      this.headerNav.append(this.navListLoggedIn);
    }
  }

  bindLogoutUser(handleLogoutUser) {
    this.logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.navListLoggedIn.innerHTML = '';
      handleLogoutUser();
    });
  }

  bindLoginUser(handleLoginUser) {
    if (!this.autoLogin) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const user = {
          userName: this.#userName,
          userPassword: this.#userPassword,
        };
        this.#displayUserAfterLogin(handleLoginUser, user);
      });
    } else {
      this.#displayUserAfterLogin(handleLoginUser, {});
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
}