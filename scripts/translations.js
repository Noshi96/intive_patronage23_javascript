'use strict';

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

  date: 'Date',
  type: 'Type',
  amount: 'Amount',
  balance: 'Balance',
  description: 'Description',

  transactionTypes: {
    '1': 'Receipts - other',
    '2': 'Expenses - purchases',
    '3': 'Receipts - salary',
    '4': 'Expenses - other',
  },

  balanceLabelTitle: 'Balance',
  barChartTitle: 'Account balance at the end of each day',
  doughnutChartTitle: 'Percentage breakdown of transactions',
  searchForTransactions: 'Search for transactions...',
  locale: 'en-GB',
  location: 'Warsaw',
  localization: 'Localization',
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

  date: 'Data',
  type: 'Typ',
  amount: 'Kwota',
  balance: 'Saldo',
  description: 'Opis',

  transactionTypes: {
    '1': 'Wpływy - inne',
    '2': 'Wydatki - zakupy',
    '3': 'Wpływy - wynagrodzenie',
    '4': 'Wydatki - inne',
  },

  balanceLabelTitle: 'Saldo',
  barChartTitle: 'Saldo konta na koniec każdego dnia',
  doughnutChartTitle: 'Podział procentowy transakcji',
  searchForTransactions: 'Szukaj transakcji...',
  locale: 'pl-PL',
  location: 'Warszawa',
  localization: 'Lokalizacja',
};

const translationsJson = {
  en,
  pl,
};

class TranslationController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  handleLanguageChange = (language) => {
    this.model.languageChange(language);
  };
}
class TranslationModel {
  constructor(language = 'pl') {
    this.language = language;
    this.translation = translationsJson[this.language] || {};
  }
}

class TranslationView {
  constructor(language = 'pl') {
    this.language = language;
    this.translation = translationsJson[this.language] || {};
  }

  bindLanguageChange(handleLanguageChange) {
    document
      .querySelector('#change-language-button')
      .addEventListener('click', () => {
        this.language = this.language === 'pl' ? 'en' : 'pl';
        this.changeLanguageButton.textContent =
          this.changeLanguageButton.textContent === 'en' ? 'pl' : 'en';
        handleLanguageChange(this.language);
      });
  }

  removeListeners() {
    const changeLanguageButton = document.getElementById(
      'change-language-button'
    );
    if (changeLanguageButton) {
      changeLanguageButton.replaceWith(changeLanguageButton.cloneNode(true));
    }
    const registerNavButton = document.getElementById('register-nav-button');
    if (registerNavButton) {
      registerNavButton.replaceWith(registerNavButton.cloneNode(true));
    }
    const loginNavButton = document.getElementById('login-nav-button');
    if (loginNavButton) {
      loginNavButton.replaceWith(loginNavButton.cloneNode(true));
    }
  }
}
