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

  isUserNameValidText:
    'The user name can only consist of letters, numbers and the given characters: - _ [ ]  /',
  isUserNameDuplicatedText: 'Duplicated user name.',
  isEnoughLettersText: 'The user name must consist of at least 5 letters.',
  isEnoughDigitsText: 'The user name must consist of at least 1 digit.',

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
    'We?? udzia?? i zarejestruj si?? ju?? teraz, ??eby nie straci?? okazji. Promocja z ograniczonym czasem. ??piesz si??! B??d?? pierwszy! Zarejestruj si??!',

  registerText: 'Rejestracja',
  loginText: 'Logowanie',

  loginTitle: 'Zaloguj',
  loginButtonText: 'Zaloguj',

  incentiveToOpenAccountText:
    'Za?????? konto na tego maila klikaj??c w Rejestracja.',
  incorrectPasswordOrUsername: 'Nieprawid??owe has??o lub nazwa u??ytkownika',

  userNameInputLabel: 'Nazwa u??ytkownika',
  userPasswordInputLabel: 'Has??o',

  userNameInputLoginText: 'Podaj nazw?? u??ytkownika',
  userPasswordInputLoginText: 'Podaj has??o',

  logoutText: 'Wyloguj',

  registerTitle: 'Zarejestruj si??',
  registerButtonText: 'Zarejestruj',

  userEmailInputLabel: 'Email',
  userEmailConfirmationInputLabel: 'Potwierd?? email',

  userNameInputText: 'Utw??rz nazw?? u??ytkownika',
  userPasswordInputText: 'Utw??rz has??o',
  userEmailInputText: 'Podaj adres e-mail',
  userEmailConfirmationInputText: 'Wpisz e-mail ponownie',

  isUserNameValidText:
    'Nazwa u??ytkownika mo??e sk??ada?? si?? tylko z liter, cyfr i podanych znak??w: - _ [ ]  /',
  isUserNameDuplicatedText: 'Taki u??ytkownik ju?? istnieje',
  isEnoughLettersText:
    'Nazwa u??ytkownika musi sk??ada?? si?? z conajmniej 5 liter.',
  isEnoughDigitsText:
    'Nazwa u??ytkownika musi sk??ada?? si?? z conajmniej 1 cyfry.',

  isEmailValidText: 'Nieprawid??owy format emaila.',
  isDuplicatedEmailWithAliasText: 'Ten email posiada alias i ju?? istnieje',
  isDuplicatedEmailText: 'Taki email ju?? istnieje',
  isEmailAndConfirmEmailValidText:
    'Email w polach Email i Potwierd?? email musz?? si?? zgadza??.',

  date: 'Data',
  type: 'Typ',
  amount: 'Kwota',
  balance: 'Saldo',
  description: 'Opis',

  transactionTypes: {
    '1': 'Wp??ywy - inne',
    '2': 'Wydatki - zakupy',
    '3': 'Wp??ywy - wynagrodzenie',
    '4': 'Wydatki - inne',
  },

  balanceLabelTitle: 'Saldo',
  barChartTitle: 'Saldo konta na koniec ka??dego dnia',
  doughnutChartTitle: 'Podzia?? procentowy transakcji',
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
