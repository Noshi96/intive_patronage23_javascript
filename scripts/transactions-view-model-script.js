'use strict';
/**
 * @class TransactionsModel
 *
 * Manages the data of the application.
 */
class TransactionsModel extends TranslationModel {
  #transactionsUrl = 'https://api.npoint.io/38edf0c5f3eb9ac768bd';
  #HTTPRequestMethod = 'GET';

  constructor(language, userName) {
    super(language);
    this.userName = userName;
  }

  async getTransactionsData() {
    try {
      // const transactionsResponse = await fetch(this.#transactionsUrl, {
      //   method: this.#HTTPRequestMethod,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (!transactionsResponse.ok) {
      //   const message = `An error has occurred: ${transactionsResponse.status}`;
      //   throw new Error(message);
      // }
      //const allTransactionData = await transactionsResponse.json();
      const allTransactionData = this.getSomeData();

      this.transactions = allTransactionData.transactions;
      this.transactionsTypes = allTransactionData.transacationTypes;

      if (this.language !== 'pl') {
        this.transactionsTypes = this.translation.transactionTypes;
      }

      const allTransactions = this.transactions;
      const transactionsTypes = this.transactionsTypes;

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

      return {
        doughnutChartConfig,
        allTransactions,
        transactionsTypes,
        percentageOfTransactionsByType,
        transactionsTypeSumData,
        barChartConfig,
      };
    } catch (err) {
      console.error(err);
    }
  }

  // #getSumOfExpensesAndReceiptsList() {
  //   this.amountSumList = [];
  //   for (const [index, transactionType] of Object.entries(
  //     this.transactionsTypes
  //   )) {
  //     const amountSum = this.transactions.reduce(
  //       (acc, { amount, type }) =>
  //         +index === +type ? acc + Math.abs(amount) : acc + 0,
  //       0
  //     );

  //     this.amountSumList.push({ transactionType, amountSum });
  //   }
  //   return this.amountSumList;
  // }

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

  #renderRandomRGBColor(min = 0, max = 255) {
    const randomChanelColor = () =>
      Math.floor(Math.random() * (max - min) + min);
    const red = randomChanelColor();
    const green = randomChanelColor();
    const blue = randomChanelColor();
    return `rgb(${red}, ${green}, ${blue})`;
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

  getSomeData() {
    return {
      transactions: [
        {
          date: '2022-11-12',
          type: 2,
          amount: -231.56,
          balance: -4337.25,
          description: 'Biedronka 13',
        },
        {
          date: '2022-11-12',
          type: 4,
          amount: -31.56,
          balance: 4572.18,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-12',
          type: 3,
          amount: 2137.69,
          balance: 2420.47,
          description: 'Wynagrodzenie z tytułu Umowy o Pracę',
        },
        {
          date: '2022-11-10',
          type: 2,
          amount: -136,
          // balance: 2555.55,
          balance: 0,
          description: 'Lidl',
        },
        {
          date: '2022-11-10',
          type: 1,
          amount: 25,
          balance: 2847.66,
          description: 'Zrzutka na prezent dla Grażyny',
        },
        {
          date: '2022-11-09',
          type: 2,
          amount: -111.11,
          balance: 3000,
          description: 'Biedronka 13',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
        {
          date: '2022-11-09',
          type: 4,
          amount: -78.33,
          balance: 3027.51,
          description: 'PayU Spółka Akcyjna',
        },
      ],
      transacationTypes: {
        '1': 'Wpływy - inne',
        '2': 'Wydatki - zakupy',
        '3': 'Wpływy - wynagrodzenie',
        '4': 'Wydatki - inne',
      },
    };
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
    new TransactionsController(
      new TransactionsModel(language, this.userName),
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
      ({ date, type, description, balance, amount }, index) => {
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

        // Hidden Row
        const hiddenTr = document.createElement('tr');
        hiddenTr.classList.add('hidden-row');
        const extendedInformation = document.createElement('td');
        extendedInformation.setAttribute('colspan', '3');
        extendedInformation.textContent = `${this.translation.date}: ${date}, ${this.translation.balance}: ${balance}zł`;
        hiddenTr.append(extendedInformation);
        this.tbody.append(hiddenTr);

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
      }
    );
  }

  createTableBody(allTransactions, transactionsTypes) {
    this.tbody.innerHTML = '';
    allTransactions.forEach(({ date, type, balance, description, amount }) => {
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

      this.tbody.append(tr);
    });
  }

  // #createTransactions(allTransactions, transactionsTypes) {
  //   this.styledTable = document.createElement('table');
  //   this.styledTable.classList.add('styled-table');
  //   this.styledTable.setAttribute('id', 'transactions-table');
  //   this.styledTable.innerHTML = `
  //       <thead>
  //         <tr>
  //           <th>${this.translation.date}</th>
  //           <th>${this.translation.type}<button id="sort-type-button">sort</button></th>
  //           <th>${this.translation.description}</th>
  //           <th>${this.translation.amount}</th>
  //           <th>${this.translation.balance}</th>
  //         </tr>
  //       </thead>
  //     `;

  //   this.tbody = document.createElement('tbody');

  //   this.styledTable
  //     .querySelector('#sort-type-button')
  //     .addEventListener('click', () => {
  //       this.#sortTransactionsByType(allTransactions);
  //     });

  //   allTransactions.forEach(({ date, type, balance, description, amount }) => {
  //     const tr = document.createElement('tr');
  //     const transactionDate = document.createElement('td');
  //     transactionDate.textContent = `${date}`;

  //     const transactionTypeIconSpan = document.createElement('span');
  //     transactionTypeIconSpan.classList.add('material-symbols-outlined');

  //     const transactionType = document.createElement('td');

  //     const transactionDescription = document.createElement('td');
  //     transactionDescription.innerHTML = `
  //       <p>${description}</p>
  //       <p class="small-text">(${transactionsTypes[type]})</p>
  //     `;

  //     const transactionAmount = document.createElement('td');
  //     transactionAmount.textContent = `${amount}zł`;
  //     if (+amount > 0) {
  //       transactionAmount.classList.add('green-font', 'font-size-bold');
  //     } else {
  //       transactionAmount.classList.add('red-font', 'font-size-bold');
  //     }

  //     const transactionBalance = document.createElement('td');
  //     transactionBalance.textContent = `${balance}zł`;

  //     if (+type === 1) {
  //       transactionTypeIconSpan.textContent = 'account_balance_wallet';
  //       transactionTypeIconSpan.classList.add('green-font');
  //     } else if (+type === 2) {
  //       transactionTypeIconSpan.textContent = 'shopping_cart';
  //       transactionTypeIconSpan.classList.add('red-font');
  //     } else if (+type === 3) {
  //       transactionTypeIconSpan.textContent = 'payments';
  //       transactionTypeIconSpan.classList.add('green-font');
  //     } else if (+type === 4) {
  //       transactionTypeIconSpan.textContent = 'shopping_bag';
  //       transactionTypeIconSpan.classList.add('red-font');
  //     }

  //     transactionType.append(transactionTypeIconSpan);

  //     tr.append(transactionDate);
  //     tr.append(transactionType);
  //     tr.append(transactionDescription);
  //     tr.append(transactionAmount);
  //     tr.append(transactionBalance);

  //     this.tbody.append(tr);
  //   });

  //   this.styledTable.append(this.tbody);

  //   const filterInput = document.createElement('input');
  //   filterInput.setAttribute('type', 'text');
  //   filterInput.setAttribute('id', 'myInput');
  //   filterInput.setAttribute('placeholder', 'Search for transactions...');
  //   filterInput.setAttribute('title', 'Type in a description');
  //   this.transactionsSection.append(filterInput);

  //   filterInput.addEventListener('keyup', () => {
  //     this.#newFilter(allTransactions, transactionsTypes);
  //   });

  //   this.transactionsSection.append(this.styledTable);
  // }

  // #filterTransactions() {
  //   let input, filter, table, tr, td, i, txtValue, p;
  //   input = document.getElementById('myInput');
  //   filter = input.value.toLowerCase();
  //   table = document.getElementById('transactions-table');
  //   tr = table.getElementsByTagName('tr');
  //   for (i = 1; i < tr.length; i++) {
  //     td = tr[i].getElementsByTagName('td')[2];
  //     p = td.getElementsByTagName('p')[0];
  //     if (p) {
  //       txtValue = p.textContent || p.innerText;
  //       if (txtValue.toLowerCase().indexOf(filter) > -1) {
  //         tr[i].style.display = '';
  //       } else {
  //         tr[i].style.display = 'none';
  //       }
  //     }
  //   }
  // }

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
