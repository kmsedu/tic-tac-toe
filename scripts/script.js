const gameBoard = (() => {
  let board = [];
  const columns = () => {
    return board.map((ele, idx) => getColumn(idx));
  }
  const clear = () => {
    board.length = 0;
  }
  const diagonals = () => [getDiagonal(0), getDiagonal(1)];
  const getCell = index => {
    x = Math.floor(index / 3);
    y = index % 3;
    return { x, y };
  }
  const getColumn = col => {
    return board.map(ele => ele[col]);
  }
  const getDiagonal = diag => {
    switch (diag) {
      case 0:
        return [board[0][0], board[1][1], board[2][2]];
      case 1:
        return [board[2][0], board[1][1], board[0][2]];
    }
  }
  const getFreeCells = () => {
    const freeCells = [];

    for (let [index, value] of board.flat().entries()) {
      if (value == ` `) freeCells.push(index);
    }
    
    return freeCells;
  }
  const getRandomCell = freeCells => {
    const randomCell = Math.floor(Math.random() * freeCells.length);

    return freeCells[randomCell];
  }
  const generate = () => {
    clear();

    for (i = 0; i < 3; i++) {
      board.push(new Array(3).fill(' '));
    }
  }
  const hasAllSameMarkers = line => {
    return line.every(mark => {
      return mark != ' ' && mark == line[0];
    });
  }
  const isADraw = () => {
    if (!isWon() && board.flat().every(cell => cell != ` `)) {
      return true;
    } else return false;
  }
  const isWon = () => {
    if (rows().some(line => hasAllSameMarkers(line))) {
      return true;
    } else if (columns().some(line => hasAllSameMarkers(line))) {
      return true;
    } else if (diagonals().some(line => hasAllSameMarkers(line))) {
      return true;
    } else {
      return false;
    };
  }
  const rows = () => board;
  const setCell = (row, col, marker) => {
    board[row][col] = marker;
  }


  return {
    board,
    generate,
    getCell,
    getFreeCells,
    getRandomCell,
    isADraw,
    isWon,
    setCell
  }
})();

const gamePrototype = {
  window: document.querySelector('.game-window'),
  clear() {
    this.window.innerHTML = '';
  },
  computerMove(cell, marker) {
    this.setCell(cell, marker);
    this.currentPlayer = this.playerOne;
  },
  draw() {
    let i = 0;

    this.clear();

    for (cell of gameBoard.board.flat()) {
      div = this.generateCell(i, cell);
      this.window.appendChild(div);
      i++;
    }
  },
  generateCell(id, marker) {
    div = document.createElement('div');
    div.classList.add('cell');
    div.id = id;
    div.textContent = marker;

    return div;
  },
  listen() {
    const cells = document.querySelectorAll('.cell');

    if (this.playerTwo.isComputer) {
      for (cell of cells) {
          cell.addEventListener('click', (e) => {
            if (e.target.textContent = ' ') {
              this.setCell(e.target.id, this.playerOne.marker);
              this.currentPlayer = this.playerTwo;
              if (!(gameBoard.isWon() || gameBoard.isADraw())) {
                const freeCells = gameBoard.getFreeCells();
                const randomCell = gameBoard.getRandomCell(freeCells);
                this.computerMove(randomCell, this.playerTwo.marker);
              }
            }
        })
      }
      return;
    }

    for (cell of cells) {
      cell.addEventListener('click', (e) => {
        if (e.target.textContent === ' ') {
          this.setCell(e.target.id, this.currentPlayer.marker);
          this.swapCurrentPlayer();
        }
      })
    }
  },
  setCell(id, marker) {
    gameBoard.setCell(gameBoard.getCell(id).x,
                      gameBoard.getCell(id).y,
                      marker);
           
    this.draw();

    if (gameBoard.isWon()) {
      windowHandler.switchToolbarDisplay();
      return windowHandler.gameOver(this.currentPlayer.name);
    }

    if (gameBoard.isADraw()) {
      windowHandler.switchToolbarDisplay();
      return windowHandler.gameDraw();
    }

    this.listen();
  },
  start() {
    gameBoard.generate();
    this.draw();
    this.listen();
  },
  swapCurrentPlayer() {
    if (this.currentPlayer == this.playerOne) {
      return this.currentPlayer = this.playerTwo;
    } 

    return this.currentPlayer = this.playerOne;
  }
}

const game = (playerOne, playerTwo, currentPlayer) => {
  return Object.assign(Object.create(gamePrototype), {
  playerOne, 
  playerTwo,
  currentPlayer,
  players: [playerOne, playerTwo],
})}

const Player = (name, marker, isComputer) => {
  return { name, marker, isComputer }
}


const windowHandler = (() => {
  const toolBar = document.querySelector('.toolbar');
  const startButton = document.getElementById('start-button');
  const startCpuButton = document.getElementById('start-cpu-button');
  const winnerMessage = document.querySelector('.winner-message');

  const gameDraw = () => {
    winnerMessage.firstChild.textContent = `Game is a draw.`;

    winnerMessage.classList.remove('hidden');
  }

  const gameOver = winner => {
    winnerMessage.firstChild.textContent = `${winner} wins!`;

    winnerMessage.classList.remove('hidden');
  }

  const getFormData = () => {
    return new FormData(startButton.form);
  }
  const getInputsFromForm = () => {
    let inputValues = {};
    for (pair of getFormData().entries()) {
      inputValues[pair[0]] = pair[1];
    }
    return inputValues;
  }
  const getPlayerObjects = (playerOne, playerTwo) => {
    return [Player(playerOne, 'X'), Player(playerTwo, 'O')];
  }
  const getPlayerObjectsCpu = (playerOne) => {
    return [Player(playerOne, 'X'), Player('Computer', 'O', true)];
  }
  const getPlayerOneName = inputs => {
    return inputs['player-one'];
  }
  const getPlayerTwoName = inputs => {
    return inputs['player-two'];
  }
  const switchToolbarDisplay = () => {
    if ([...toolBar.classList].includes('hidden')) {
      return toolBar.classList.remove('hidden');
    }

    return toolBar.classList.add('hidden');
  }
  const listen = () => {
    startButton.addEventListener('click', () => {
      const playerOne = getPlayerOneName(getInputsFromForm());
      const playerTwo = getPlayerTwoName(getInputsFromForm());
      const players = getPlayerObjects(playerOne, playerTwo);

      startGame(players[0], players[1]);
    })
    startCpuButton.addEventListener('click', () => {
      const playerOne = getPlayerOneName(getInputsFromForm());
      const players = getPlayerObjectsCpu(playerOne);
      startGame(players[0], players[1]);
    })
  }
  const startGame = (playerOne, playerTwo) => {
    const main = game(playerOne, playerTwo, playerOne);
    switchToolbarDisplay();
    startButton.textContent = 'Play again';
    main.start();
  }
  return { 
    listen, 
    gameOver,
    gameDraw,
    switchToolbarDisplay,
   }
})();

windowHandler.listen();
