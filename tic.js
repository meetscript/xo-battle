let currentPlayer = "X";
const cells = document.querySelectorAll(".cell");
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let movesHistory = [];
let movehist = [];
let gameOver = false;
let playWithBot = false;
let aboutopen =false;
document.getElementById("playWithBot").addEventListener("change", () => {
  playWithBot = document.getElementById("playWithBot").checked;
  document.getElementById("undoBtn").disabled = playWithBot;
  document.getElementById("redoBtn").disabled = playWithBot;
  document.getElementById("botLevel").disabled = !playWithBot;
});

// simple moves 
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const row = cell.getAttribute("data-row");
    const col = cell.getAttribute("data-col");
    if (!aboutopen&&!gameOver && board[row][col] === "") {
      board[row][col] = currentPlayer;
      cell.textContent = currentPlayer; 
      document.getElementById("playWithBot").disabled = true;
      document.getElementById("botLevel").disabled = true;
      movesHistory.push({ row: parseInt(row), col: parseInt(col), val: currentPlayer });
      const winner = checkwinner();
      if (winner)
        showWinner(winner);
      else if (isDraw())
        showDraw();
      if (winner || isDraw()) {
        gameOver = true;
        document.getElementById("undoBtn").disabled = true;
        document.getElementById("redoBtn").disabled = true;
      }
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (playWithBot && currentPlayer === "O") {
        setTimeout(playBot, 300);
      }
    }
  });
});

// undo function

function undo() {
  if (movesHistory.length === 0) return;
  const lastMove = movesHistory.pop();
  board[lastMove.row][lastMove.col] = "";
  movehist.push({ row: lastMove.row, col: lastMove.col, val: lastMove.val });
  const selector = `.cell[data-row='${lastMove.row}'][data-col='${lastMove.col}']`;
  const cell = document.querySelector(selector);
  cell.textContent = "";
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}


//redo function

function redo() {
  if (movehist.length === 0) return;
  const lastdel = movehist.pop();
  board[lastdel.row][lastdel.col] = lastdel.val;
  movesHistory.push({ row: lastdel.row, col: lastdel.col, val: lastdel.val });
  const selector = `.cell[data-row='${lastdel.row}'][data-col='${lastdel.col}']`;
  const cell = document.querySelector(selector);
  cell.textContent = lastdel.val;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

//checkwinner function

function checkwinner() {
  for (let r = 0; r < 3; r++) {
    if (board[r][0] !== "" &&
      board[r].every(cell => cell === board[r][0])) {
      return board[r][0];
    }
  }


  for (let col = 0; col < 3; col++) {
    let val = board[0][col];
    if (val === "") continue;
    let win = true;
    for (let row = 1; row < 3; row++) {
      if (board[row][col] !== val) {
        win = false;
        break;
      }
    }
    if (win) return val;
  }

  if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2])
    return board[0][0];
  if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0])
    return board[0][2];
  return null;
}


function showWinner(winner) {
  const messageBox = document.getElementById("winnerMessage");
  if (playWithBot) {
    if (winner === "O") {
      triggerLossEmojis();
      messageBox.textContent = " 😂😂Bot is winner ";
    }
    else {
      winConfetti();
      messageBox.textContent = "🎉  you are great 🫡🫡";
    }

  }
  else {
    winConfetti();
    messageBox.textContent = `🎉 Player ${winner} is the winner!`;
  }

  messageBox.style.display = "block";

}

function winConfetti() {
  let duration = 2 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 15,
      spread: 100,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.6
      },
      colors: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

}
function isDraw() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "")
         return false;
    }
  }
    return true;
}

function showDraw() {
  const messageBox = document.getElementById("winnerMessage");
  messageBox.textContent = "😒😒 Game is draw you dumb!!";
  messageBox.style.display = "block";
  triggerDrawEmojis();
}

function triggerDrawEmojis() {
  const container = document.getElementById("emojiContainer");

  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji";
    emoji.textContent = "😪";
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.animationDuration = (1 + Math.random() * 2) + "s"; // random fall speed
    container.appendChild(emoji);
    setTimeout(() => {
      emoji.remove();
    }, 3000);
  }
}
function triggerLossEmojis() {
  const container = document.getElementById("emojiContainer");

  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji";
    emoji.textContent = "😭";
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.animationDuration = (1 + Math.random() * 2) + "s"; // random fall speed
    container.appendChild(emoji);
    setTimeout(() => {
      emoji.remove();
    }, 3000);
  }
}


function resetGame() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.textContent = "";
  });
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = "";
    }
  }
  movehist.length = 0;
  movesHistory.length = 0;
  document.getElementById("winnerMessage").style.display = "none";
  gameOver = false;
  document.getElementById("undoBtn").disabled = false;
  document.getElementById("redoBtn").disabled = false;
  document.getElementById("playWithBot").disabled = false;
  currentPlayer = "X";
  document.getElementById("undoBtn").disabled = playWithBot;
  document.getElementById("redoBtn").disabled = playWithBot;
  document.getElementById("botLevel").disabled = !playWithBot;
   document.querySelector(".allrules").style.display="none";
}



function medHardBotMove() {
  if (gameOver) return;

  // 1. Try to win
  const winningMove = findBestMove("O");
  if (winningMove) {
    makeBotMove(winningMove.row, winningMove.col);
    return;
  }

  // 2. Try to block player
  const blockMove = findBestMove("X");
  if (blockMove) {
    makeBotMove(blockMove.row, blockMove.col);
    return;
  }

  let emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col });
      }
    }
  }
  const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeBotMove(move.row, move.col);
}

function playBot() {
  const level = document.getElementById("botLevel").value;
  if (level === "easy") easyBotMove();
  else if (level === "medium") mediumBotMove();
  else if (level === "MedHard") medHardBotMove();
  else hardBotMove();
}



function findBestMove(player) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = player;
        const isWin = checkwinner();
        board[row][col] = "";
        if (isWin) return { row, col };
      }
    }
  }
  return null;
}

function easyBotMove() {
  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") emptyCells.push({ row, col });
    }
  }
  const random = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeBotMove(random.row, random.col);
}

function mediumBotMove() {
  const randomPlay = Math.random() < 0.5;
  if (randomPlay) {
    easyBotMove();
  } else {
    const best = minimax(board, 0, true);
    makeBotMove(best.row, best.col);
  }
}

function hardBotMove() {
  const best = minimax(board, 0, true);
  makeBotMove(best.row, best.col);
}



function minimax(board, depth, isMaximizing) {
  const winner = checkwinner();
  if (winner === "O") return { score: 10 - depth };
  if (winner === "X") return { score: depth - 10 };
  if (isDraw(board)) return { score: 0 };

  let bestMove;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          board[row][col] = "O";
          const result = minimax(board, depth + 1, false);
          board[row][col] = "";
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = { row, col, score: bestScore };
          }
        }
      }
    }
    return bestMove;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          board[row][col] = "X";
          const result = minimax(board, depth + 1, true);
          board[row][col] = "";
          if (result.score < bestScore) {
            bestScore = result.score;
            bestMove = { row, col, score: bestScore };
          }
        }
      }
    }
    return bestMove;
  }
}

function makeBotMove(row, col) {
  board[row][col] = "O";
  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  cell.textContent = "O";
  const winner = checkwinner(board);
  if (winner)
    showWinner(winner);
  if (isDraw())
    showDraw();
  if (winner || isDraw()) {
    gameOver = true;
    document.getElementById("undoBtn").disabled = true;
    document.getElementById("redoBtn").disabled = true;
  }
  currentPlayer = "X";
}

function toggle() {
  const icon = document.getElementById("icon");
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
  if (body.classList.contains("dark-mode")) {
     setTimeout(() => {
    icon.src = "light.svg";
  }, 300);
    
  } else {
     setTimeout(() => {
   icon.src = "dark.png";
  }, 300);
    
  }
  icon.classList.add("rotate");
  
  setTimeout(() => {
    icon.classList.remove("rotate");
  }, 600);
}
document.getElementById("about").addEventListener("click",()=>{
     aboutopen=true;
      const about = document.querySelector(".aboutbox");
 about.style.display="block";
});
document.getElementById("removeabout").addEventListener("click",()=>{
      aboutopen=false;
      const about = document.querySelector(".aboutbox");
   about.style.display="none";
});
document.getElementById("rules").addEventListener("click",()=>{
     document.querySelector(".allrules").style.display="block";
});
