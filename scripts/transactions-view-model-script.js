'use strict';

/**
 * @class TransactionsModel
 *
 * Manages the data of the application.
 */
class TransactionsModel {
  constructor() {}
}

/**
 * @class TransactionsView
 *
 * Visual representation of the model.
 */
class TransactionsView {
  constructor() {
    this.app = document.querySelector('#root');
    this.app.innerHTML = '<h1>Hello</h1>';
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }
}
