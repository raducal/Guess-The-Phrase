class UI {
  constructor(tries, keys, word) {
    this.keys = keys;
    this.tries = tries;
    this.word = word;
    this.missed = 0;
  }

  async getRandomQuote() {
    const prefix = `https://cors-anywhere.herokuapp.com/`;
    const url = `${prefix}https://thesimpsonsquoteapi.glitch.me/quotes`;

    const response = await fetch(url);
    const data = await response.json();
    return data[0].quote;

    // AJAX BELOW

    // const ajax = new XMLHttpRequest();

    // const url = "https://api.quotable.io/random";

    // ajax.open("GET", url, true);

    // const self = this;

    // ajax.onload = function() {
    //   // console.log(this);
    //   // console.log(self);
    //   if (this.status === 200) {
    //     console.log(this.responseText);
    //     self.getData(this.responseText, self.addPhraseToDisplay, self.word);
    //   } else {
    //     console.log(this.statusText);
    //   }
    // };

    // ajax.onerror = function() {
    //   console.log("error");
    // };

    // ajax.send();
  }

  getData(data) {
    // AJAX
    // const result = JSON.parse(response);
    // const { content } = result;
    // console.log(content);

    this.addPhraseToDisplay(data.toLowerCase());
    // this.addPhraseToDisplay(phrase);
  }

  addPhraseToDisplay(content) {
    console.log(content);
    for (let i = 0; i < content.length - 1; i++) {
      if (content.charAt(i) === " " || content.charAt(i) === "'") {
        const li = document.createElement("li");
        li.classList.add("space");
        li.textContent = content.charAt(i);
        this.word.appendChild(li);
      } else {
        const li = document.createElement("li");
        li.classList.add("letter");
        li.classList.add("hide");
        li.textContent = content.charAt(i);
        this.word.appendChild(li);
      }
    }
    console.log(this.word);
  }

  compareKeyToPhrase(e) {
    console.log(e.target);
    if (e.target.classList.contains("key")) {
      e.target.setAttribute("disabled", true);
      if (this.checkLetter(e.target.textContent) === false) {
        e.target.className += " wrong";
        this.removeLife();
      } else {
        e.target.className += " chosen";
        this.showMatch(e.target.textContent);
        if (this.checkForWin() === true) {
          this.gameOver();
        }
      }
    }
  }

  checkLetter(target) {
    if (this.word.textContent.includes(target)) {
      return true;
    } else {
      return false;
    }
  }

  showMatch(target) {
    let phraseLi = document.querySelectorAll("#phrase li");
    phraseLi.forEach(function(li) {
      if (target === li.textContent) {
        li.classList.remove("hide");
        li.classList.add("show");
      }
    });
  }

  removeLife() {
    this.tries[this.missed].src = "images/lostHeart.png";

    this.missed += 1;
    if (this.missed === 5) {
      console.log("game over");
      this.gameOver();
    }
  }

  checkForWin() {
    const triesLeft = document.querySelectorAll(".hide");
    if (triesLeft.length === 0) {
      return true;
    }
  }

  gameOver() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex";
    const message = document.getElementById("game-over-message");
    if (this.missed === 5) {
      message.textContent = "You Lost";
      overlay.classList.add("lose");
    } else {
      message.textContent = "You Win";
      overlay.classList.add("win");
    }

    this.missed = 0;
    this.word.innerHTML = "";
    this.keys.forEach(function(key) {
      key.removeAttribute("disabled");
      key.classList.remove("wrong");
      key.classList.remove("chosen");
    });

    this.tries.forEach(tries => {
      tries.src = "images/liveHeart.png";
    });
    console.log(this.word);
  }
}

(function() {
  const keys = document.querySelectorAll(".key");
  const tries = document.querySelectorAll(".tries img");
  const word = document.querySelector("#phrase ul");
  const qwerty = document.querySelector("#qwerty");

  const ui = new UI(tries, keys, word);

  const btn = document.querySelector("#btn__reset");

  btn.addEventListener("click", function() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    ui.getRandomQuote()
      .then(data => ui.getData(data))
      .catch(error => console.log(error));
  });

  qwerty.addEventListener("click", function(e) {
    ui.compareKeyToPhrase(e);
  });
})();
