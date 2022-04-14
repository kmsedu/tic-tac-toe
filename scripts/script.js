const Player = (name, marker) => {
  return { name, marker }
}

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
  const getWinningLine = () => {
    const rowWins = rows().filter(line => hasAllSameMarkers(line));
    const diagWins = diagonals().filter(line => hasAllSameMarkers(line));
    const colWins = columns().filter(line => hasAllSameMarkers(line));

    const winningLine = [rowWins, diagWins, colWins].find(arr => arr.length != 0);

    return winningLine;
  }
  const getWinningMark = () => {
    return getWinningLine()[0][0];
  }
  const generate = () => {
    clear();

    for (i = 0; i < 3; i++) {
      board.push(new Array(3).fill(' '));
    }
  }
  const hasAllSameMarkers = (line) => {
    return line.every(mark => {
      return mark != ' ' && mark == line[0];
    });
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
    getWinningLine,
    getWinningMark,
    isWon,
    setCell
  }
})();

const gamePrototype = {
  window: document.querySelector('.game-window'),
  clear() {
    this.window.innerHTML = '';
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

    for (cell of cells) {
      cell.addEventListener('click', (e) => {
        if (e.target.textContent === ' ') {
          this.setCell(e.target.id, this.currentPlayer.marker);
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
      console.log(`Game over, the winner is ${this.currentPlayer.name}.`);
    } else {
      this.swapCurrentPlayer();
      this.listen();
    };
  },
  start() {
    
  },
  swapCurrentPlayer() {
    if (this.currentPlayer == this.playerOne) {
      this.currentPlayer = this.playerTwo
    } else this.currentPlayer = this.playerOne;
  }
}

const game = (playerOne, playerTwo, currentPlayer) => Object.assign(Object.create(gamePrototype), {
  playerOne, 
  playerTwo,
  currentPlayer,
})

const windowHandler = (() => {
  const window = document.querySelector('main');
  const form = window.querySelector('form');

  const getFormData = () => {
    return new FormData(form);
  }
  const getInputsFromForm = () => {
    let inputValues = {};
    for (pair of getFormData().entries()) {
      inputValues[pair[0]] = pair[1];
    }
    return inputValues;
  }
  const listen = () => {
    form.addEventListener('submit', event => {

      event.preventDefault();
    });
  }
  const startGame = (playerOne, playerTwo) => {
    const main = game(playerOne, playerTwo, playerOne);


  }
  return { getInputsFromForm, listen, window };
})();
