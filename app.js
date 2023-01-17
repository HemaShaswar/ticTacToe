
const Player = (marker) => {
    
    this.marker = marker;

    const getMarker = () => {
        return marker
    };
    
    return { getMarker };
};

const gameBoard = (() => {
    const board = document.getElementById('board');
    const gameBoard = [];

    for (i=0;i<9;i++) {
        const square = document.createElement('div');
        square.classList.add('square')
        square.setAttribute('data-index',i)
        board.appendChild(square);

        gameBoard.push('')
    };

    const setSquare= (index, marker) => {
        if (index > gameBoard.length) return;
        gameBoard[index] = marker;
    };

    const getSquare = (index) => {
        if (index > gameBoard.length) return;
        return gameBoard[index]
    }

    const reset = () => {
        for (let i = 0;i<9;i++) {
            board[i] = '';
        }
    }
    
    return {setSquare, getSquare, reset}
})();

const displayController = (() => {
    const text = document.getElementById('text');
    const squareElements = document.querySelectorAll('.square');
    const restartBtn = document.getElementById('restart');
    squareElements.forEach((square) => {
        
        square.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();

        })
        
    })

    restartBtn.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    const updateGameboard = () => {
        for (let i = 0; i < squareElements.length; i++) {
          squareElements[i].textContent = gameBoard.getSquare(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === "Draw") {
          setMessageElement("It's a draw!");
        } else {
          setMessageElement(`Player ${winner} has won!`);
        }
    };
    
    const setMessageElement = (message) => {
        text.textContent = message;
    };
    
    return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let round = 1;
    let isOver = false;

    const playRound = (squareIndex) => {
        gameBoard.setSquare(squareIndex, getCurrentPlayerMarker());
        if (checkWinner(squareIndex)) {
            displayController.setResultMessage(getCurrentPlayerMarker());
            isOver = true;
            return;
          }
          if (round === 9) {
            displayController.setResultMessage("Draw");
            isOver = true;
            return;
          }
          round++;
          displayController.setMessageElement(
            `Player ${getCurrentPlayerMarker()}'s turn`
          );
    };

    const getCurrentPlayerMarker = () => {
    return round % 2 === 1 ? playerX.getMarker() : playerO.getMarker();
  };

  const checkWinner = (squareIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(squareIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getSquare(index) === getCurrentPlayerMarker()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };


    
})()

