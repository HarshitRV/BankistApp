'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [5000, 1202, 1303, 200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-04-12T08:25:47.653Z',
    '2022-04-17T08:25:47.653Z',
    '2022-04-16T08:25:47.653Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// console.log(new Intl.DateTimeFormat('en-US', options).format(new Date()))
const getTodayDate = function (format = 'en-US') {
  const today = new Intl.DateTimeFormat(format, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date())
  // const date = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hours = `${now.getHours()}`.padStart(2, 0);
  // const minutes = `${now.getMinutes()}`.padStart(2, 0);
  // const seconds = `${now.getSeconds()}`.padStart(2, 0);
  // labelDate.textContent = `${date}/${month}/${year}, ${hours}:${minutes}:${seconds}`

  labelDate.textContent = today
}

// Days passed functon
const calcDaysPassed = function (time) {
  const daysPassed = Math.abs(Math.round((new Date() - time) / (1000 * 60 * 60 * 24)));
  return daysPassed;
}

// Format movements dates
const formatMovementDates = function (time, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(time);
}

const formatDaysMessage = function (numDays, locale = 'en-US') {
  if (numDays === 0) {
    return 'Today';
  } else if (numDays === 1) {
    return 'Yesterday';
  } else if (numDays <= 7) {
    return `${numDays} ago`
  } else {
    return formatMovementDates(numDays * 1000 * 60 * 60 * 24, locale)
  }
}

// Format movements currency and seperators
const formatMovementAmounts = function (locale, value, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

// Display movements.
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const move = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements
  move.forEach(function (mov, index) {

    // Getting number of days passed since last movements
    const daysPassed = calcDaysPassed(new Date(acc.movementsDates[index]));

    // Formating dates.
    const time = new Date(acc.movementsDates[index]);

    // Setting the display time message.
    let displayDate;
    if (daysPassed === 0) {
      displayDate = 'Today';
    } else if (daysPassed === 1) {
      displayDate = 'Yesterday';
    } else if (daysPassed <= 7) {
      displayDate = `${daysPassed} ago`
    } else {
      displayDate = formatMovementDates(time, acc.locale);
    }



    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatMovementAmounts(acc.locale, mov, acc.currency)}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html)

  });
}
// displayMovements(account1.movements);

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('')
  });
}
createUserName(accounts);

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${formatMovementAmounts(account.locale, income, account.currency)}`;


  const expense = Math.abs(account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov)
  );

  labelSumOut.textContent = `${formatMovementAmounts(account.locale, expense, account.currency)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = `${formatMovementAmounts(account.locale, interest, account.currency)} €`

}
// calcDisplaySummary(account1.movements)

const calcCurrentBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0)
  labelBalance.textContent = `${formatMovementAmounts(account.locale, account.balance, account.currency)}`
}
// calcCurrentBalance(account1.movements)

const updateUI = function (currentUser) {
  // Display movements.
  displayMovements(currentUser);

  // Display balance.
  calcCurrentBalance(currentUser);

  // Display summary.
  calcDisplaySummary(currentUser);
}

let currentUser, timer;
// Event handlers

const logOutTimer = function () {
  var time = 30;
  const tick = () => {

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  }

  tick();
  timer = setInterval(tick, 1000);
  return timer;
}

// Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {

    // Set session
    if(timer){
      clearInterval(timer);
    }
    logOutTimer();

    // Display UI and message.
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur(); // blur function removes focus from an element.

    updateUI(currentUser);
  }

});

// Transfer amount.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(acc => acc.username === inputTransferTo.value);

  if (transferTo && transferAmount > 0 && transferTo !== currentUser.username && transferAmount <= currentUser.balance) {
    // console.log('Valid Transfer');
    transferTo.movements.push(transferAmount);
    currentUser.movements.push(-transferAmount);
    currentUser.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    updateUI(currentUser);
  }

  inputTransferAmount.value = inputTransferTo.value = '';

})

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();



  if (currentUser.username === inputCloseUsername.value && currentUser.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === inputCloseUsername.value);
    // console.log(index)

    // Delete accound
    accounts.splice(index, 1);
    // console.log(accounts)

    // Hide UI
    containerApp.style.opacity = 0;
  }
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(+inputLoanAmount.value);
  setTimeout(() => {
    if (loanAmount > 0 && currentUser.movements.some(mov => mov >= loanAmount * 0.1)) {
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(new Date().toISOString());
      updateUI(currentUser);
      console.log('Amount deposited.')
    } else {
      console.log('Loan denied.')
    }

    inputLoanAmount.value = '';
  }, 3000)
  console.log('Processing request....')
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentUser, !sorted);
  sorted = !sorted;

  btnSort.innerHTML = btnSort.innerHTML === '↓ SORT' ? '⇫ UNSORT' : '↓ SORT';

})

// FAKE ALWAYS LOGGED IN
currentUser = account1;
updateUI(currentUser);
containerApp.style.opacity = 100;


setInterval(() => getTodayDate(currentUser?.locale), 1000);

///
///
/// LESSONS

const max = account1.movements.reduce((acc, curr) => {
  if (acc > curr) return acc;
  else return curr;
}, account1.movements[0])

// console.log(Math.min(...account1.movements))


// Create a array with 100 readom dice rolls.
const diceRolls = Array.from({
  length: 100
}, () => Math.trunc((Math.random() * 100)) + 1);
// console.log(diceRolls)

labelBalance.addEventListener('click', function () {
  const movementFromUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // console.log(movementFromUI)
});


// Array methods practice
// 1
// Overall balance
const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, curr) => acc + curr, 0);

// console.log(overallBalance)

// 2
// Number of deposits in the bank with atleast 1000$
const numDeposits = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, acc) => acc >= 1000 ? ++count : count, 0)
// .filter(acc => acc >= 1000)
// .length
// console.log(numDeposits);

// 3
// Create and object with total deposits and total withdrawls property
const {
  totalDeposits,
  totalWithdrawls
} = accounts
  .flatMap((acc) => acc.movements)
  .reduce((obj, current) => {
    obj[current >= 0 ? 'totalDeposits' : 'totalWithdrawls'] += Math.abs(current);
    return obj;
  }, {
    totalDeposits: 0,
    totalWithdrawls: 0
  });
// console.log(totalDeposits, totalWithdrawls);

// 4
// Convert any string to title case.
const strOne = 'This is a NOICE nice string but .'
const strTwo = 'another example the or with of title case O.'

const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase();

const exceptions = ['a', 'in', 'but', 'the', 'or', 'with']
// Titlcase : This Is a Nice String.
const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => exceptions.includes(word) ? word : capitalize(word))
    .join(' ')
}
// console.log(titleCase(strOne), titleCase(strTwo))

// Working with dates.
const now = new Date();
// console.log(now)