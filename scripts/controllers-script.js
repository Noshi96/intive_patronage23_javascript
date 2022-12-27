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

  handleLoginUser = (user) => {
    return this.registeredUser
      ? this.model.loginUser(this.registeredUser)
      : this.model.loginUser(user);
  };

  handleValidateUserData = (user) => {
    return this.registeredUser
      ? this.model.validateUserData(this.registeredUser)
      : this.model.validateUserData(user);
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

document.addEventListener('DOMContentLoaded', () => {
  const initialApp = new InitialView();
  console.log('initial');

  document
    .querySelector('#register-nav-button')
    .addEventListener('click', () => {
      globalRegisterController = new RegisterController(
        new RegisterModel(),
        new RegisterView()
      );
    });

  document.querySelector('#login-nav-button').addEventListener('click', () => {
    globalLoginController = new LoginController(
      new LoginModel(),
      new LoginView()
    );
  });
});
