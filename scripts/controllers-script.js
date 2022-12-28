let globalLoginController = null;
let globalRegisterController = null;
/**
 * @class Controller
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

    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindLoginUser(this.handleLoginUser);
    this.view.bindLogoutUser(this.handleLogoutUser);
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

  handleLogoutUser = () => {
    this.model.logoutUser();
  };
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

    this.view.bindValidateUserData(this.handleValidateUserData);
    this.view.bindAddUser(this.handleAddUser);
  }

  handleAddUser = (userProp) => {
    this.model.addUser(userProp);
  };

  handleValidateUserData = (user) => {
    return this.model.validateUserData(user);
  };
}

class InitialController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
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
