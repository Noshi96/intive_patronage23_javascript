// const initialText =
//   'Weź udział i zarejestruj się już teraz, żeby nie stracić okazji. Promocja z ograniczonym czasem. Śpiesz się! Bądź pierwszy! Zarejestruj się!';

// const registerText = 'Rejestracja';
// const loginText = 'Logowanie';

// const loginTitle = 'Zaloguj się';
// const loginButtonText = 'Zaloguj';

// const incentiveToOpenAccountText =
//   'Załóż konto na tego maila klikając w Rejestracja.';
//const incorrectPasswordOrUsername = 'Incorrect password or user name.';

// const userNameInputLabel = 'Nazwa użytkownika';
// const userPasswordInputLabel = 'Hasło';

// const userNameInputLoginText = 'Podaj nazwę użytkownika';
// const userPasswordInputLoginText = 'Podaj hasło';

// const logoutText = 'Wyloguj';

// const registerTitle = 'Zarejestruj się';
// const registerButtonText = 'Zarejestruj';

// const userEmailInputLabel = 'Email';
// const userEmailConfirmationInputLabel = 'Potwierdź email';

// const userNameInputText = 'Utwórz nazwę użytkownika';
// const userPasswordInputText = 'Utwórz hasło';
// const userEmailInputText = 'Podaj adres e-mail';
// const userEmailConfirmationInputText = 'Wpisz e-mail ponownie';

// const isUserNameValidText =
//   'The user name must not contain forbidden characters.';
// const isUserNameDuplicatedText = 'Duplicated user name.';
// const isEnoughLettersText = 'Not enough characters.';
// const isEnoughDigitsText = 'Not enough digits.';

// const isEmailValidText = 'Wrong email format.';
// const isDuplicatedEmailWithAliasText = 'Duplicated email with alias.';
// const isDuplicatedEmailText = 'Duplicated email.';
// const isEmailAndConfirmEmailValidText = 'Confirm email is different then email';

const en = {
  initialText: `Take part and register now so you don't miss the opportunity. Promotion with limited time. Hurry up! Be the first! Register!`,
  registerText: 'Sign up',
  loginText: 'Sign in',

  loginTitle: 'Log in',
  loginButtonText: 'Log in',

  incentiveToOpenAccountText:
    'Create an account for this email by clicking on Sign up.',
  incorrectPasswordOrUsername: 'Incorrect password or user name.',

  userNameInputLabel: 'Username',
  userPasswordInputLabel: 'Password',

  userNameInputLoginText: 'Enter your username',
  userPasswordInputLoginText: 'Enter your password',

  logoutText: 'Logout',

  registerTitle: 'Sign up',
  registerButtonText: 'Sign up',

  userEmailInputLabel: 'Email',
  userEmailConfirmationInputLabel: 'Confirm email',

  userNameInputText: 'Create a username',
  userPasswordInputText: 'Create a password',
  userEmailInputText: 'Enter email address',
  userEmailConfirmationInputText: 'Enter email again',

  isUserNameValidText: 'The user name must not contain forbidden characters.',
  isUserNameDuplicatedText: 'Duplicated user name.',
  isEnoughLettersText: 'Not enough characters.',
  isEnoughDigitsText: 'Not enough digits.',

  isEmailValidText: 'Wrong email format.',
  isDuplicatedEmailWithAliasText: 'Duplicated email with alias.',
  isDuplicatedEmailText: 'Duplicated email.',
  isEmailAndConfirmEmailValidText: 'Confirm email is different then email',
};

const pl = {
  initialText:
    'Weź udział i zarejestruj się już teraz, żeby nie stracić okazji. Promocja z ograniczonym czasem. Śpiesz się! Bądź pierwszy! Zarejestruj się!',

  registerText: 'Rejestracja',
  loginText: 'Logowanie',

  loginTitle: 'Zaloguj',
  loginButtonText: 'Zaloguj',

  incentiveToOpenAccountText:
    'Załóż konto na tego maila klikając w Rejestracja.',
  incorrectPasswordOrUsername: 'Nieprawidłowe hasło lub nazwa użytkownika',

  userNameInputLabel: 'Nazwa użytkownika',
  userPasswordInputLabel: 'Hasło',

  userNameInputLoginText: 'Podaj nazwę użytkownika',
  userPasswordInputLoginText: 'Podaj hasło',

  logoutText: 'Wyloguj',

  registerTitle: 'Zarejestruj się',
  registerButtonText: 'Zarejestruj',

  userEmailInputLabel: 'Email',
  userEmailConfirmationInputLabel: 'Potwierdź email',

  userNameInputText: 'Utwórz nazwę użytkownika',
  userPasswordInputText: 'Utwórz hasło',
  userEmailInputText: 'Podaj adres e-mail',
  userEmailConfirmationInputText: 'Wpisz e-mail ponownie',

  isUserNameValidText:
    'Nazwa użytkownika nie może zawierać zabronionych znaków',
  isUserNameDuplicatedText: 'Taki użytkownik już istnieje',
  isEnoughLettersText: 'Za mało znaków.',
  isEnoughDigitsText: 'Za mało cyfr.',

  isEmailValidText: 'Nieprawidłowy format emaila.',
  isDuplicatedEmailWithAliasText: 'Ten email posiada alias i już istnieje',
  isDuplicatedEmailText: 'Taki email już istnieje',
  isEmailAndConfirmEmailValidText:
    'Email w polach Email i Potwierdź email muszą się zgadzać.',
};

const translationsJson = {
  en,
  pl,
};

// const translation = translateTo('pl');

class TranslationController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  handleLanguageChange = (language) => {
    return this.model.changeLanguage(language);
  };
}

class TranslationModel {
  constructor() {}

  changeLanguage = (language) => {
    return translationsJson[language] || {};
  };
}

class TranslationView {
  constructor(language) {
    this.language = language;
    this.translation = translationsJson[this.language] || {};
  }
  // bindLanguageChange(handleLanguageChange) {
  //   this.changeLanguageButtons.addEventListener('click', () => {
  //     this.language === 'pl' ? (this.language = 'en') : (this.language = 'pl');
  //     this.translation = handleLanguageChange(this.language);
  //     this.changeLanguageButtons.textContent = this.language;
  //     console.log('translation');
  //     new InitialController(new InitialModel(), new InitialView(this.language));
  //   });
  // }
}
