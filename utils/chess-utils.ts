import { Chess } from "chess.js";

export const p0 = "rnbqkp";
// https://html-css-js.com/html/character-codes/ -> Chess Icons
export const pb = "♜♞♝♛♚♟";
export const pw = "♖♘♗♕♔♙";

// new Game
export const chess = new Chess();
// Position
export const files = "abcdefgh".split("");
export const ranks = "87654321".split("");

// board
export const getBoard = () =>
  chess
    .ascii()
    .split("\n")
    .slice(1, 9)
    .map((rank) => rank.slice(5, 27).split("  "));
