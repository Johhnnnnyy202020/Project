// this is the audio constructor, it holds all the audios sounds for the game//
class AudioController {
  constructor() {
    this.bgMusic = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FMusic_default_laning_01.mp3?v=1596906319218"
    );
    this.flipSound = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FRadiant_melee_mega_creep_impact2.mp3?v=1597076588477"
    );
    this.matchSound = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FCoins_big.mp3?v=1596558950550"
    );
    this.victorySound = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FDlc_lina_announcer_victory_rad_02.mp3?v=1597154447740"
    );
    this.gameOverSound = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FAnnouncer_capn_deny_tresureneverfeel.mp3?v=1597076626454"
    );
    this.gameStarted = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FAnnouncer_capn_begin_fight.mp3?v=1596558836530"
    );
    this.crowd = new Audio(
      "https://cdn.glitch.com/9d28654d-2aa5-43e8-b710-7c9f917e15b1%2FCrowd_2%20(1).mp3?v=1597154481392"
    );

    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
    this.gameStarted.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
    this.crowd.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}
// we call this everytime we start the game, it holds the cards,coins, time and it creates a new audio everytime//

class Heroes {
  constructor(totalTime, cards, coins) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.totalCoins = this.coins;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips");
    this.coins = document.getElementById("coins");
    this.audioController = new AudioController();
  }

  startGame() {
    this.totalClicks = 0;
    this.totalCoins = 10;
    this.timeRemaining = this.totalTime;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards(this.cardsArray);
      this.countdown = this.startCountdown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
    this.coins.innerText = this.totalCoins;
  }
  startCountdown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countdown);
    this.audioController.gameOver();
    document.getElementById("game-over-text").classList.add("visible");
  }
  victory() {
    clearInterval(this.countdown);
    this.audioController.victory();
    document.getElementById("victory-text").classList.add("visible");
  }
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove("flip");
      card.classList.remove("shake");
    });
  }

  // the flipcard logic//

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("flip");

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  // for us the obtain the match card function, i went for all of the images to have a card type, so if the cards have the same card type the will match//
  
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else this.cardMismatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  
  //We add all cards in an array we created, so if the cards that we matched is the same with the cards that we have from the start we will have victory, or the card will not match//
  
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    this.audioController.match();
    this.totalCoins++;
    this.coins.innerText = this.totalCoins;
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }
  cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("flip");
      card2.classList.remove("flip");
      this.busy = false;
    }, 1000);
  }

  // the suffle cards method, it changes the position of the cards everytime we call the startgame//

  shuffleCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [cardsArray[i], cardsArray[randIndex]] = [
        cardsArray[randIndex],
        cardsArray[i]
      ];
    }
    cardsArray = cardsArray.map((card, index) => {
      card.style.order = index;
    });
  }
  //our card type is the data-framework that all the cards have, and just 2 of them have the same data//
  
  getCardType(card) {
    return card.getAttribute("data-framework");
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}
//if the page is not available, wait untill it loads, then call the ready function;

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//the ready function, we got the overlay, cards and we summon the game class//
function ready() {
  let overlays = Array.from(document.getElementsByClassName("overlay-text"));
  let cards = Array.from(document.getElementsByClassName("memory-card"));
  let game = new Heroes(100, cards, 10);

  overlays.forEach(overlay => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      game.startGame();
    });
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });
}
