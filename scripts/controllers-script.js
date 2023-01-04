'use strict';

/**
 * @class LoginController
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 * @param registeredUser Optional parameter if you want to log in right after registration
 */
class LoginController extends TranslationController {
  constructor(model, view, registeredUser) {
    super(model, view);
    this.model = model;
    this.view = view;
    this.registeredUser = registeredUser;

    this.view.bindLanguageChange(this.handleLanguageChange);
    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindLoginUser(
      this.handleLoginUser,
      this.handleSwitchViewToTransactions
    );
    this.view.bindSwitchViewToRegister(this.handleSwitchViewToRegister);
  }

  handleValidateUserData = (user) => {
    return this.model.validateUserData(this.registeredUser || user);
  };

  handleLoginUser = (user) => {
    return this.model.loginUser(this.registeredUser || user);
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
class RegisterController extends TranslationController {
  constructor(model, view) {
    super(model, view);
    this.model = model;
    this.view = view;

    this.view.bindLanguageChange(this.handleLanguageChange);
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
class TransactionsController extends TranslationController {
  constructor(model, view) {
    super(model, view);
    this.model = model;
    this.view = view;

    this.view.bindLoadHeaderAndUserName(this.handleGetLoggedInUserName);
    this.view.bindLanguageChange(this.handleLanguageChange);
    this.view.bindLogoutUser(
      this.handleLogoutUser,
      this.handleSwitchViewToInitial
    );
    this.view.bindShowTransactionsData(this.handleGetTransactionsData);
  }

  // handleGetTransactionsData = () => {
  //   return this.model.getSomeData();
  // };

  handleGetTransactionsData = () => {
    return this.model.getTransactionsData();
  };

  handleLogoutUser = () => {
    this.model.logoutUser();
  };

  handleGetLoggedInUserName = () => {
    return this.model.getLoggedInUserName();
  };

  handleSwitchViewToInitial = () => {
    this.model.switchViewToInitial();
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
class InitialController extends TranslationController {
  constructor(model, view) {
    super(model, view);
    this.model = model;
    this.view = view;

    this.view.bindLanguageChange(this.handleLanguageChange);
    this.view.bindInitRegister(this.handleInitRegister);
    this.view.bindInitLogin(this.handleInitLogin);
    this.currentLoggedInUser =
      JSON.parse(localStorage.getItem('currentLoggedInUser')) || null;
  }
  handleInitRegister = () => {
    this.model.initRegister();
  };
  handleInitLogin = () => {
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
  const { currentLoggedInUser } = initialController;
  if (currentLoggedInUser) {
    const { currentLoggedInUser } = initialController;
    new LoginController(
      new LoginModel(true),
      new LoginView(true, this.language),
      currentLoggedInUser
    );
  }
});
