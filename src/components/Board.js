import { useState, useEffect } from "react";
import Cell from "./Cell";

function isMatch(sequence) {
  const items = sequence.filter((cell) => cell !== null);
  if (items.length !== 3) return false;

  for (let i = 1; i < items.length; i++) {
    if (items[i] !== items[i - 1]) return false;
  }

  return true;
}

function containsMatch(board) {
  // check horizontal
  const rows = [
    [board[0], board[1], board[2]],
    [board[3], board[4], board[5]],
    [board[6], board[7], board[8]],
  ];
  const cols = [
    [board[0], board[3], board[6]],
    [board[1], board[4], board[7]],
    [board[2], board[5], board[8]],
  ];

  const diagonals = [
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]],
  ];

  const rowMatch = rows.reduce((matched, row) => {
    return matched || isMatch(row);
  }, false);
  const colMatch = cols.reduce((matched, row) => {
    return matched || isMatch(row);
  }, false);

  const diagonalMatch = diagonals.reduce((matched, row) => {
    return matched || isMatch(row);
  }, false);

  return rowMatch || colMatch || diagonalMatch;
}

const getOpposite = (tag) => (tag === "X" ? "O" : "X");

export default function Board() {
  const [values, setValues] = useState(new Array(9).fill(null));
  const [tag, setTag] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [cheating, setCheating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    if (containsMatch(values)) setGameOver(true);
  }, [values]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          width: "300px",
        }}
      >
        {rounds.map((round, idx) => {
          console.log(round);
          return (
            <button
              key={`round-${idx}`}
              onClick={() => {
                setValues(round.board);
                setTag(round.tag);
                setCheating(idx !== rounds.length - 1);
                setCurrentRound(idx);
                if (idx !== 8) setGameOver(false);
              }}
            >
              Go to round {idx}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", width: "300px" }}>
        {values.map((value, idx) => {
          return (
            <Cell
              key={`cell-${idx}`}
              value={value}
              onClick={() => {
                if (gameOver || values[idx] !== null) return;
                const updatedGrid = [...values];
                updatedGrid[idx] = tag;

                setTag(getOpposite(tag));
                setValues(updatedGrid);

                if (cheating) {
                  const updatedRounds = rounds.filter(
                    (_, idx) => idx <= currentRound
                  );
                  setRounds([
                    ...updatedRounds,
                    { board: updatedGrid, tag: getOpposite(tag) },
                  ]);
                } else {
                  setRounds([
                    ...rounds,
                    { board: updatedGrid, tag: getOpposite(tag) },
                  ]);
                }
                setCurrentRound(rounds.length + 1);
              }}
            />
          );
        })}
      </div>
      <div>{gameOver ? `${getOpposite(tag)} won!` : `Player turn: ${tag}`}</div>
      <button
        onClick={() => {
          setValues(new Array(9).fill(null));
          setGameOver(false);
          setRounds([]);
          setTag("X");
        }}
      >
        Restart
      </button>
    </div>
  );
}
