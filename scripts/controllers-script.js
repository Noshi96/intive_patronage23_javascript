'use strict';

let globalLoginController = null;
let globalRegisterController = null;
let globalStateLanguage = 'pl';
/**
 * @class LoginController
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 * @param registeredUser Optional parameter if you want to log in right after registration
 */
class LoginController {
  constructor(model, view, registeredUser) {
    this.model = model;
    this.view = view;
    this.registeredUser = registeredUser;

    this.view.bindLanguageChange();
    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindLoginUser(
      this.handleLoginUser,
      this.handleSwitchViewToTransactions
    );
    this.view.bindSwitchViewToRegister(this.handleSwitchViewToRegister);
  }

  handleValidateUserData = (user) => {
    return this.registeredUser
      ? this.model.validateUserData(this.registeredUser)
      : this.model.validateUserData(user);
  };

  handleLoginUser = (user) => {
    return this.registeredUser
      ? this.model.loginUser(this.registeredUser)
      : this.model.loginUser(user);
  };

  handleSwitchViewToTransactions = (userName) => {
    this.model.switchViewToTransactions(userName);
  };

  handleSwitchViewToRegister = () => {
    this.model.switchViewToRegister();
  };
}

/**
 * @class RegisterController
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

    this.view.bindLanguageChange();
    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindAddUser(this.handleAddUser);
    this.view.bindSwitchViewToLogin(this.handleSwitchViewToLogin);
  }

  handleAddUser = (user) => {
    this.model.addUser(user);
  };

  handleValidateUserData = (user) => {
    return this.model.validateUserData(user);
  };

  handleSwitchViewToLogin = (autoLogin, language) => {
    this.model.switchViewToLogin(autoLogin, language);
  };
}

/**
 * @class TransactionsController
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class TransactionsController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindLanguageChange();
    this.view.bindLogoutUser(this.handleLogoutUser);
    // this.view.bindShowData(this.handlerGetTransactionsData);
  }

  // handlerGetTransactionsData = () => {
  //   return this.model.getTransactionsData();
  // };
  handleLogoutUser = () => {
    this.model.logoutUser();
  };
}

/**
 * @class InitialController
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class InitialController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindLanguageChange(this.handleLanguageChange);
    this.view.bindInitRegister(this.handlerInitRegister);
    this.view.bindInitLogin(this.handlerInitLogin);
    this.currentLoggedInUser =
      JSON.parse(localStorage.getItem('currentLoggedInUser')) || null;
  }
  handlerInitRegister = () => {
    this.model.initRegister();
  };
  handlerInitLogin = () => {
    this.model.initLogin();
  };
}

// initialization
document.addEventListener('DOMContentLoaded', () => {
  const initialController = new InitialController(
    new InitialModel(),
    new InitialView()
  );

  // Automatic login if u are logged in
  if (initialController.currentLoggedInUser) {
    const { currentLoggedInUser } = initialController;
    new LoginController(
      new LoginModel(true),
      new LoginView(true, currentLoggedInUser),
      currentLoggedInUser
    );
  }
});
