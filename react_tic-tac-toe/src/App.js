import { useState } from "react";

// 보드를 구성하는 네모
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 게임의 보드판
function Board({ xIsNext, squares, onPlay }) {
  const size = 3;
  // 3*3 값을 저장하는 board 배열 생성
  const board = [];
  // board 행과 열 구성
  for (let row = 0; row < size; row++) {
    const squareRow = [];
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      squareRow.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />);
    }

    //board 배열에 push
    board.push(
      <div key={row} className="board-row">
        {squareRow}
      </div>
    );
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* 만들어놓은 3*3 보드판 렌더링 */}
      {board}
    </>
  );
}

// 게임 실행 함수
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 시간이동 함수
  function jumpTo(nextMove) {
    // 현재 부분, x인지 o인지 업데이트
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return <li key={move}>{currentMove === move ? <div>당신은 {move}번째 순서에 있습니다…</div> : <button onClick={() => jumpTo(move)}>{description}</button>}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 틱택토 게임 결과 확인
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
