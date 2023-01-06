'use strict';
/**
 * @class TransactionsModel
 *
 * Manages the data of the application.
 */
class TransactionsModel extends TranslationModel {
  #transactionsUrl = 'https://api.npoint.io/38edf0c5f3eb9ac768bd';
  #HTTPRequestMethod = 'GET';

  constructor(
    language,
    userName,
    refreshOnLanguageChange = false,
    user = {},
    isFirstLogin = false
  ) {
    super(language);
    this.userName = userName;
    this.refreshOnLanguageChange = refreshOnLanguageChange;
    this.user = user;
    this.usersTransactions =
      JSON.parse(localStorage.getItem('usersTransactions')) || [];
    this.isFirstLogin = isFirstLogin;
  }

  #getSingleUserTransactions() {
    console.log('getTransactionsData', this.usersTransactions);
    console.log(this.user);
    this.userTransactions = this.usersTransactions.filter(
      (userTransactionsDataObject) => {
        const id = Object.keys(userTransactionsDataObject);
        return id.toString() === this.user.id.toString();
      }
    )[0];
  }

  async getTransactionsData() {
    this.#getSingleUserTransactions();
    console.log('kto tu', this.userTransactions);
    console.log(this.user);

    if (this.refreshOnLanguageChange || this.userTransactions) {
      console.log('elo', this.userTransactions);
      const { allTransactions, transactionsTypes } = this.userTransactions[
        this.user.id
      ];
      const returnedData = this.#returnConfigObjectForChartsAndTransactions(
        allTransactions,
        transactionsTypes
      );
      return returnedData[this.user.id];
    }

    try {
      const transactionsResponse = await fetch(this.#transactionsUrl, {
        method: this.#HTTPRequestMethod,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!transactionsResponse.ok) {
        const message = `An error has occurred: ${transactionsResponse.status}`;
        throw new Error(message);
      }
      const allTransactionData = await transactionsResponse.json();

      console.log('Load daaaaata', allTransactionData);

      this.transactions = allTransactionData.transactions;
      this.transactionsTypes = allTransactionData.transacationTypes;

      if (this.language !== 'pl') {
        this.transactionsTypes = this.translation.transactionTypes;
      }

      // Add external data
      const allTransactionsWithAdditionalLocation = this.transactions.map(
        (transaction) => ({
          location: `${this.translation.location}`,
          ...transaction,
        })
      );

      const transactionsTypes = this.transactionsTypes;

      const allTransactions = this.#mergeAllDataTransactionsWithRandomDataset(
        allTransactionsWithAdditionalLocation
      );

      const returnedData = this.#returnConfigObjectForChartsAndTransactions(
        allTransactions,
        transactionsTypes
      );
      if (!this.userTransactions) {
        this.usersTransactions.push(returnedData);
        localStorage.setItem(
          'usersTransactions',
          JSON.stringify(this.usersTransactions)
        );
      }

      return returnedData[this.user.id];
    } catch (err) {
      console.error(err);
    }
  }

  #returnConfigObjectForChartsAndTransactions(
    allTransactions,
    transactionsTypes
  ) {
    transactionsTypes = this.translation.transactionTypes;

    const percentageOfTransactionsByType = this.#getPercentageOfTransactionsByType(
      transactionsTypes,
      allTransactions
    );
    const transactionsTypeSumData = this.#transactionsTypeSumDataConfig(
      percentageOfTransactionsByType
    );
    const doughnutChartConfig = this.#doughnutChartConfig(
      transactionsTypeSumData
    );

    const endOfDayBalance = this.#getEndOfDayBalance(allTransactions);

    const endOfDayBalanceData = this.#endOfDayBalanceDataConfig(
      endOfDayBalance
    );

    const barChartConfig = this.#barChartConfig(endOfDayBalanceData);

    const key = `${this.user.id}`;
    const returnedData = {};

    returnedData[key] = {
      doughnutChartConfig,
      allTransactions,
      transactionsTypes,
      percentageOfTransactionsByType,
      transactionsTypeSumData,
      barChartConfig,
    };
    return returnedData;
  }

  #mergeAllDataTransactionsWithRandomDataset(allTransactions) {
    if (this.isFirstLogin) {
      return [...this.#getOneRandomDataset(), ...allTransactions];
    }
    return allTransactions;
  }

  #getPercentageOfTransactionsByType(transactionsTypes, allTransactions) {
    const transactionsTypeSumList = [];
    for (const [index, transactionType] of Object.entries(transactionsTypes)) {
      let typeSum = allTransactions.reduce(
        (acc, { type }) => (+index === +type ? acc + 1 : acc + 0),
        0
      );
      transactionsTypeSumList.push({ transactionType, typeSum });
    }
    return transactionsTypeSumList;
  }

  #getEndOfDayBalance(allTransactions) {
    const endOfDayBalanceList = [];
    let visitedDate = 'empty';
    for (const [_, { date, balance }] of Object.entries(allTransactions)) {
      if (visitedDate !== date) {
        endOfDayBalanceList.push({ date, balance });
        visitedDate = date;
      }
    }
    return endOfDayBalanceList;
  }

  #transactionsTypeSumDataConfig(transactionsTypeSumList) {
    const transactionsTypeSumData = {
      labels: [],
      datasets: [
        {
          label: this.translation.doughnutChartTitle,
          data: [],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 33, 221)',
          ],
          hoverOffset: 4,
        },
      ],
    };

    transactionsTypeSumList.forEach(({ transactionType, typeSum }) => {
      transactionsTypeSumData.labels.push(transactionType);
      transactionsTypeSumData.datasets[0].data.push(typeSum);
    });

    return transactionsTypeSumData;
  }

  #endOfDayBalanceDataConfig(endOfDayBalanceList) {
    const endOfDayBalanceData = {
      labels: [],
      datasets: [
        {
          label: this.translation.balanceLabelTitle,
          data: [],
          backgroundColor: [],
          hoverOffset: 4,
          minBarLength: 7,
        },
      ],
    };

    endOfDayBalanceList.forEach(({ date, balance }) => {
      endOfDayBalanceData.labels.push(date);
      endOfDayBalanceData.datasets[0].data.push(balance);
      const color =
        +balance < 0
          ? this.#renderRedColor()
          : +balance === 0
          ? this.#renderGrayColor()
          : this.#renderGreenColor();
      endOfDayBalanceData.datasets[0].backgroundColor.push(color);
    });

    return endOfDayBalanceData;
  }

  #doughnutChartConfig(data) {
    const chartConfig = {
      type: 'doughnut',
      data: data,
      options: {
        animation: {
          delay: 1000,
          duration: 1000,
        },
        plugins: {
          title: {
            display: true,
            text: this.translation.doughnutChartTitle,
          },
        },
      },
    };
    return chartConfig;
  }

  #barChartConfig(data) {
    const chartConfig = {
      type: 'bar',
      data: data,
      options: {
        animation: {
          delay: 1000,
          duration: 1000,
        },
        plugins: {
          title: {
            display: true,
            text: this.translation.barChartTitle,
          },
        },
      },
    };
    return chartConfig;
  }

  #renderRedColor() {
    return 'rgb(204,51,51)';
  }

  #renderGreenColor() {
    return 'rgb(69,139,0)';
  }

  #renderGrayColor() {
    return 'rgb(89,89,89)';
  }

  #getOneRandomDataset() {
    const datasets = [
      [
        {
          date: '2022-11-14',
          type: 2,
          amount: -100,
          balance: 0,
          description: 'Zakupy w sklepie spożywczym',
          location: `${this.translation.location}`,
        },
        {
          date: '2022-11-15',
          type: 1,
          amount: 1000,
          balance: -2747.66,
          description: 'Wpłata przez bankomat',
          location: `${this.translation.location}`,
        },
      ],
      [
        {
          date: '2022-11-14',
          type: 4,
          amount: -200,
          balance: -3547.66,
          description: 'Opłata za rachunki',
          location: `${this.translation.location}`,
        },
        {
          date: '2022-11-15',
          type: 1,
          amount: 50,
          balance: 0,
          description: 'Prezent dla brata',
          location: `${this.translation.location}`,
        },
      ],
      [
        {
          date: '2022-11-14',
          type: 2,
          amount: -109.99,
          balance: 0,
          description: 'Sklep internetowy',
          location: `${this.translation.location}`,
        },
        {
          date: '2022-11-15',
          type: 4,
          amount: -39.99,
          balance: -3333.22,
          description: 'Abonament telefoniczny',
          location: `${this.translation.location}`,
        },
      ],
      [
        {
          date: '2022-11-14',
          type: 4,
          amount: -59.99,
          balance: -2817.54,
          description: 'Usługi streamingowe',
          location: `${this.translation.location}`,
        },
        {
          date: '2022-11-15',
          type: 2,
          amount: -149.99,
          balance: 0,
          description: 'Zakup sprzętu elektronicznego',
          location: `${this.translation.location}`,
        },
      ],
    ];
    const max = datasets.length - 1;
    const randomIndex = Math.floor(Math.random() * max);
    return datasets[randomIndex];
  }

  #commitCurrentLoggedInUser(user) {
    localStorage.setItem('currentLoggedInUser', JSON.stringify(user));
  }

  logoutUser() {
    this.#commitCurrentLoggedInUser(null);
  }

  getLoggedInUserName() {
    return this.userName;
  }

  switchViewToInitial() {
    new InitialController(
      new InitialModel(this.language),
      new InitialView(this.language)
    );
  }

  languageChange(language) {
    // To prevent requesting api on every refresh
    const refreshOnLanguageChange = true;
    new TransactionsController(
      new TransactionsModel(
        language,
        this.userName,
        refreshOnLanguageChange,
        this.user
      ),
      new TransactionsView(language)
    );
  }
}

/**
 * @class TransactionsView
 *
 * Visual representation of the model.
 */
class TransactionsView extends TranslationView {
  #isOpen = false;
  constructor(language) {
    super(language);
    this.initView();
  }

  async initView() {
    this.refreshListeners();
    this.changeLanguageButton = document.querySelector(
      '#change-language-button'
    );
    this.app = document.querySelector('#root');
    this.app.innerHTML = '';

    this.transactionsContainer = this.createElement(
      'div',
      'transactions-container'
    );
    this.transactionsContainer.innerHTML = `
      <section class="chart-section">
        <canvas id="doughnut-chart"></canvas>
        <canvas id="bar-chart"></canvas>
      </section>
      <section class="transactions-section">

      </section>
    `;
    this.app.append(this.transactionsContainer);

    this.transactionsSection = this.transactionsContainer.querySelector(
      '.transactions-section'
    );
    this.doughnutCtx = document.getElementById('doughnut-chart');
    this.barCtx = document.getElementById('bar-chart');
  }

  drawChart(ctx, config) {
    new Chart(ctx, config);
  }

  async bindShowTransactionsData(handleGetTransactionsData) {
    // const {
    //   doughnutChartConfig,
    //   dataForDisplayOnChart,
    //   allTransactions,
    //   transactionsTypes,
    //   percentageOfTransactionsByType,
    //   transactionsTypeSumData
    // } = await handleGetTransactionsData();
    const data = await handleGetTransactionsData();
    console.log(data);
    this.drawChart(this.doughnutCtx, data.doughnutChartConfig);
    this.drawChart(this.barCtx, data.barChartConfig);

    // Mobile Transaction table view
    if (window.innerWidth < 769) {
      this.createFilterTableInput(
        data.allTransactions,
        data.transactionsTypes,
        true
      );
      this.createMobileTransactionsTableHeader(
        data.allTransactions,
        data.transactionsTypes
      );
      this.createMobileTableBody(data.allTransactions, data.transactionsTypes);
    } else {
      this.createFilterTableInput(
        data.allTransactions,
        data.transactionsTypes,
        false
      );
      this.createTransactionsTableHeader(
        data.allTransactions,
        data.transactionsTypes
      );
      this.createTableBody(data.allTransactions, data.transactionsTypes);
    }

    console.log('no elo elo');
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  bindLogoutUser(handleLogoutUser, handleSwitchViewToInitial) {
    this.logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.navListLoggedIn.innerHTML = '';
      handleLogoutUser();
      handleSwitchViewToInitial();
    });
  }

  bindLoadHeaderAndUserName(handleGetLoggedInUserName) {
    const userName = handleGetLoggedInUserName();
    this.headerNav = document.querySelector('.header-nav');
    this.languageButtonContainer = this.createElement(
      'div',
      'language-button-container'
    );
    this.languageButtonContainer.innerHTML = `
      <button id="change-language-button">
        ${this.language === 'en' ? 'pl' : 'en'}
      </button>
    `;

    this.navListLoggedIn = this.createElement('ul', 'nav-list-logged-in');

    this.loggedName = document.createElement('li');
    this.loggedName.setAttribute('id', 'logged-name');

    this.logoutButton = document.createElement('li');
    this.logoutButton.setAttribute('id', 'log-out');
    this.logoutButton.classList.add('button-style');

    this.logoutButton.textContent = this.translation.logoutText;

    this.loggedName.textContent = userName;
    this.navListLoggedIn.append(this.loggedName);
    this.navListLoggedIn.append(this.logoutButton);
    this.headerNav.innerHTML = '';
    this.headerNav.append(this.navListLoggedIn);
    this.headerNav.append(this.languageButtonContainer);

    console.log('init transactions');
  }

  createTransactionsTableHeader(allTransactions, transactionsTypes) {
    this.styledTable = document.createElement('table');
    this.styledTable.classList.add('styled-table');
    this.styledTable.setAttribute('id', 'transactions-table');
    this.styledTable.innerHTML = `
        <thead>
          <tr>
            <th>${this.translation.date}</th>
            <th><button id="sort-type-button">${this.translation.type}</button></th>
            <th>${this.translation.description}</th>
            <th>${this.translation.amount}</th>
            <th>${this.translation.balance}</th>
            <th>${this.translation.localization}</th>
          </tr>
        </thead>
      `;

    this.tbody = document.createElement('tbody');
    this.styledTable.append(this.tbody);
    this.transactionsSection.append(this.styledTable);

    const sortTypeButton = this.styledTable.querySelector('#sort-type-button');
    sortTypeButton.addEventListener('click', () => {
      if (sortTypeButton.getAttribute('data-dir') == 'desc') {
        sortTypeButton.setAttribute('data-dir', 'asc');
        const sortedTransactions = this.#sortTransactionsByType(
          allTransactions,
          'asc'
        );
        this.createTableBody(sortedTransactions, transactionsTypes);
      } else {
        sortTypeButton.setAttribute('data-dir', 'desc');
        const sortedTransactions = this.#sortTransactionsByType(
          allTransactions,
          'desc'
        );
        this.createTableBody(sortedTransactions, transactionsTypes);
      }
    });
  }

  createFilterTableInput(allTransactions, transactionsTypes, isMobile) {
    const filterInput = document.createElement('input');
    filterInput.setAttribute('type', 'text');
    filterInput.setAttribute('id', 'myInput');
    filterInput.setAttribute(
      'placeholder',
      `${this.translation.searchForTransactions}`
    );
    filterInput.setAttribute('title', 'Type in a description');

    this.transactionsSection.append(filterInput);

    filterInput.addEventListener('keyup', () => {
      const filteredTransactions = this.#filterTransactionsByDescription(
        allTransactions
      );
      if (isMobile) {
        this.createMobileTableBody(filteredTransactions, transactionsTypes);
      } else {
        this.createTableBody(filteredTransactions, transactionsTypes);
      }
    });
  }

  createMobileTransactionsTableHeader(allTransactions, transactionsTypes) {
    this.styledTable = document.createElement('table');
    this.styledTable.classList.add('styled-table');
    this.styledTable.setAttribute('id', 'transactions-table');
    this.styledTable.innerHTML = `
        <thead>
          <tr>
            <th><button id="sort-type-button">${this.translation.type}</button></th>
            <th>${this.translation.description}</th>
            <th>${this.translation.amount}</th>
          </tr>
        </thead>
      `;

    this.tbody = document.createElement('tbody');
    this.styledTable.append(this.tbody);
    this.transactionsSection.append(this.styledTable);

    const sortTypeButton = this.styledTable.querySelector('#sort-type-button');
    sortTypeButton.addEventListener('click', () => {
      if (sortTypeButton.getAttribute('data-dir') == 'desc') {
        sortTypeButton.setAttribute('data-dir', 'asc');
        const sortedTransactions = this.#sortTransactionsByType(
          allTransactions,
          'asc'
        );
        this.createMobileTableBody(sortedTransactions, transactionsTypes);
      } else {
        sortTypeButton.setAttribute('data-dir', 'desc');
        const sortedTransactions = this.#sortTransactionsByType(
          allTransactions,
          'desc'
        );
        this.createMobileTableBody(sortedTransactions, transactionsTypes);
      }
    });
  }

  createMobileTableBody(allTransactions, transactionsTypes) {
    this.tbody.innerHTML = '';
    let visited = 'empty';
    allTransactions.forEach(
      ({ date, type, description, balance, amount, location }, index) => {
        if (visited !== date) {
          const tr = document.createElement('tr');
          const transactionDate = document.createElement('td');
          transactionDate.setAttribute('id', 'mobile-date-td');
          transactionDate.setAttribute('colspan', '3');
          transactionDate.textContent = `${this.#getDayName(
            date,
            this.translation.locale
          )}`;
          tr.append(transactionDate);
          this.tbody.append(tr);
          visited = date;
        }
        const tr = document.createElement('tr');
        tr.classList.add(`hidden-id-${index}`, 'show-color-row');

        const transactionTypeIconSpan = document.createElement('span');
        transactionTypeIconSpan.classList.add('material-symbols-outlined');

        const transactionType = document.createElement('td');

        const transactionDescription = document.createElement('td');
        transactionDescription.innerHTML = `
        <p>${description}</p>
        <p class="small-text">(${transactionsTypes[type]})</p>
      `;

        const transactionAmount = document.createElement('td');
        transactionAmount.textContent = `${amount}zł`;
        if (+amount > 0) {
          transactionAmount.classList.add('green-font', 'font-size-bold');
        } else {
          transactionAmount.classList.add('red-font', 'font-size-bold');
        }

        if (+type === 1) {
          transactionTypeIconSpan.textContent = 'account_balance_wallet';
          transactionTypeIconSpan.classList.add('green-font');
        } else if (+type === 2) {
          transactionTypeIconSpan.textContent = 'shopping_cart';
          transactionTypeIconSpan.classList.add('red-font');
        } else if (+type === 3) {
          transactionTypeIconSpan.textContent = 'payments';
          transactionTypeIconSpan.classList.add('green-font');
        } else if (+type === 4) {
          transactionTypeIconSpan.textContent = 'shopping_bag';
          transactionTypeIconSpan.classList.add('red-font');
        }

        transactionType.append(transactionTypeIconSpan);

        tr.append(transactionType);
        tr.append(transactionDescription);
        tr.append(transactionAmount);

        this.tbody.append(tr);

        // Hidden Row
        const hiddenTr = document.createElement('tr');
        hiddenTr.classList.add('hidden-row');
        const extendedInformation = document.createElement('td');
        extendedInformation.setAttribute('colspan', '3');
        extendedInformation.textContent = `${this.translation.date}: ${date}, ${this.translation.balance}: ${balance}zł, ${this.translation.localization}: ${location}`;
        hiddenTr.append(extendedInformation);
        this.tbody.append(hiddenTr);

        tr.addEventListener('click', () => {
          if (hiddenTr.classList.contains('hidden-row') && !this.isOpen) {
            hiddenTr.classList.remove('hidden-row');
            tr.classList.add('active-row');
            this.isOpen = true;
          } else if (!hiddenTr.classList.contains('hidden-row')) {
            hiddenTr.classList.add('hidden-row');
            tr.classList.remove('active-row');
            this.isOpen = false;
          }
        });
      }
    );
  }

  createTableBody(allTransactions, transactionsTypes) {
    this.tbody.innerHTML = '';
    allTransactions.forEach(
      ({ date, type, balance, description, amount, location }) => {
        const tr = document.createElement('tr');
        const transactionDate = document.createElement('td');
        transactionDate.textContent = `${date}`;

        const transactionTypeIconSpan = document.createElement('span');
        transactionTypeIconSpan.classList.add('material-symbols-outlined');

        const transactionType = document.createElement('td');

        const transactionDescription = document.createElement('td');
        transactionDescription.innerHTML = `
        <p>${description}</p>
        <p class="small-text">(${transactionsTypes[type]})</p>
      `;

        const transactionAmount = document.createElement('td');
        transactionAmount.textContent = `${amount}zł`;
        if (+amount > 0) {
          transactionAmount.classList.add('green-font', 'font-size-bold');
        } else {
          transactionAmount.classList.add('red-font', 'font-size-bold');
        }

        const transactionBalance = document.createElement('td');
        transactionBalance.textContent = `${balance}zł`;

        const transactionLocation = document.createElement('td');
        transactionLocation.textContent = `${location}`;

        if (+type === 1) {
          transactionTypeIconSpan.textContent = 'account_balance_wallet';
          transactionTypeIconSpan.classList.add('green-font');
        } else if (+type === 2) {
          transactionTypeIconSpan.textContent = 'shopping_cart';
          transactionTypeIconSpan.classList.add('red-font');
        } else if (+type === 3) {
          transactionTypeIconSpan.textContent = 'payments';
          transactionTypeIconSpan.classList.add('green-font');
        } else if (+type === 4) {
          transactionTypeIconSpan.textContent = 'shopping_bag';
          transactionTypeIconSpan.classList.add('red-font');
        }

        transactionType.append(transactionTypeIconSpan);

        tr.append(transactionDate);
        tr.append(transactionType);
        tr.append(transactionDescription);
        tr.append(transactionAmount);
        tr.append(transactionBalance);
        tr.append(transactionLocation);

        this.tbody.append(tr);
      }
    );
  }

  #filterTransactionsByDescription(allTransactionData) {
    const input = document.getElementById('myInput');
    const filter = input.value.toLowerCase();
    const filteredTransactions = allTransactionData.filter(
      ({ description }) => {
        return description.toLowerCase().includes(filter.toLowerCase());
      }
    );
    return filteredTransactions;
  }

  #sortTransactionsByType(allTransactionData, sortType) {
    const sorted = allTransactionData.sort((a, b) => {
      if (sortType === 'asc') {
        return a.type > b.type ? 1 : -1;
      } else {
        return a.type > b.type ? -1 : 1;
      }
    });
    console.log(sorted);
    return sorted;
  }

  #getDayName(dateStr, locale) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
}
