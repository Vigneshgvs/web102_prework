/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...restGames] = sortedGames;
console.log('Top Funded Game:', firstGame.name);
console.log('Second Top Funded Game:', secondGame.name);

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById('games-container');

// create a function that adds all data from the games array to the page
function addGamesToPage(gamesList) {
  // loop over each item in the data
  for (const game of gamesList) {
    // create a new div element, which will become the game card
    const gameCard = document.createElement('div');

    // add the class game-card to the list
    gameCard.classList.add('game-card');

    // set the inner HTML using a template literal to display some info
    // about each game
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")
    const medal =
      game.name === firstGame.name
        ? '🥇'
        : game.name === secondGame.name
        ? '🥈'
        : '';

    gameCard.innerHTML = `
      <img src="${game.img}" alt="${game.name}" width="300" height="200" />
      <h3>${medal} ${game.name} ${medal}</h3>
      <p>${game.description}</p>
      <p>Pledged: $${game.pledged.toLocaleString(
        'en-US'
      )} / Goal: $${game.goal.toLocaleString('en-US')}</p>
      <p>Backers: ${game.backers}</p>
    `;

    // Add a click event listener to each game card
    gameCard.addEventListener('click', () => {
      openGameModal(game);
    });

    // append the game to the games-container
    gamesContainer.appendChild(gameCard);
  }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById('num-contributions');
// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce(
  (total, game) => total + game.backers,
  0
);
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.textContent = `${totalContributions.toLocaleString('en-US')}`;
// contributionsCard.innerHTML = `Total Contributions: ${totalContributions}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById('total-raised');
const totalPledged = GAMES_JSON.reduce(
  (total, game) => total + game.pledged,
  0
);
// set inner HTML using template literal
raisedCard.textContent = `$${totalPledged.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById('num-games');
gamesCard.textContent = `${GAMES_JSON.length}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
  console.log(`Number of unfunded games: ${unfundedGames.length}`);

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);
  console.log(`Number of funded games: ${fundedGames.length}`);

  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  console.log(`Number of all games: ${GAMES_JSON.length}`);
  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById('unfunded-btn');
const fundedBtn = document.getElementById('funded-btn');
const allBtn = document.getElementById('all-btn');

// add event listeners with the correct functions to each button
// unfundedBtn.addEventListener('click', filterUnfundedOnly);
// fundedBtn.addEventListener('click', filterFundedOnly);
// allBtn.addEventListener('click', showAllGames);
allBtn.classList.add('selected');
unfundedBtn.addEventListener('click', function () {
  filterUnfundedOnly();
  changeSelectedButton(unfundedBtn);
});
fundedBtn.addEventListener('click', function () {
  filterFundedOnly();
  changeSelectedButton(fundedBtn);
});
allBtn.addEventListener('click', function () {
  showAllGames();
  changeSelectedButton(allBtn);
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById('description-container');

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(
  (game) => game.pledged < game.goal
).length;
console.log(`Number of unfunded games: ${unfundedGamesCount}`);

// create a string that explains the number of unfunded games using the ternary operator
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
const totalGames = GAMES_JSON.length;
const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
const numUnfundedGames = unfundedGames.length;
const displayStr = `
A total of $${totalRaised} has been raised for ${totalGames} games.
Currently, ${
  numUnfundedGames === 1 ? '1 game remains' : `${numUnfundedGames} games remain`
} unfunded.
We need your help to fund ${
  numUnfundedGames === 1 ? 'this amazing game!' : `these amazing games!`
}
`;
console.log(displayStr);

// create a new DOM element containing the template string and append it to the description container
const paragraphElement = document.createElement('p');
paragraphElement.textContent = displayStr;
descriptionContainer.appendChild(paragraphElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById('first-game');
const secondGameContainer = document.getElementById('second-game');

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement('p');
firstGameElement.textContent = `${firstGame.name}`;
firstGameContainer.appendChild(firstGameElement);
const secondGameElement = document.createElement('p');
secondGameElement.textContent = `${secondGame.name}`;
secondGameContainer.appendChild(secondGameElement);

// do the same for the runner up item
// 1. 'Our Games' in nav bar
// Scroll to the "Our Games" section when clicking "Our Games" button
document.getElementById('our-games-btn').addEventListener('click', function () {
  const section = document.getElementById('our-games');
  section.scrollIntoView({ behavior: 'smooth' });
});
// 2. Filter button colors
function changeSelectedButton(selectedButton) {
  const buttons = [unfundedBtn, fundedBtn, allBtn];
  buttons.forEach((button) => {
    if (button === selectedButton) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
}
// 3. Pop-up or Modal for each game card
// Function to open the game modal
function openGameModal(game) {
  const modal = document.getElementById('game-modal');
  const modalContent = document.getElementById('modal-game-details');

  const medal =
    game.name === firstGame.name
      ? '🥇'
      : game.name === secondGame.name
      ? '🥈'
      : '';

  modalContent.innerHTML = `
        <img src="${game.img}" alt="${game.name}" width="300" height="200" />
        <h3>${medal} ${game.name} ${medal}</h3>
        <p>${game.description}</p>
        <p>Pledged: $${game.pledged.toLocaleString(
          'en-US'
        )} / Goal: $${game.goal.toLocaleString('en-US')}</p>
        <p> ${
          game.pledged > game.goal
            ? '🥳 Goal Reached 🥳'
            : `Goal yet to reach 🫤`
        }</p>
        <p>Backers: ${game.backers}</p>
    `;

  modal.style.display = 'flex';

  const closeModal = document.getElementById('close-modal');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Event listener to close modal on overlay click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}
