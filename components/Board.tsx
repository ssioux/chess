import { useEffect, useState } from "react";
import styles from "./board.module.scss";
import { Move } from "chess.js";
import { calculateBestMove, initGame } from "chess-ai";

import {
  initialPieces,
  blackPieces,
  whitePieces,
  chess,
} from "../utils/chess-utils";
import Loader from "./Loader";

const Board = () => {
  // represent the board
  const [pieces, setPieces] = useState(
    new Array(8).fill(0).map(() => new Array(8).fill(""))
  );
  // next movements
  const [highlighted, setHighlighted] = useState<string[]>([]);
  // Loader
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    initGame(chess, 1); //  chess, ai-difficulty from 0 to 2
    getBoard();
  }, []);

  const getBoard = () => {
    // ascii square with lines removed, each rank sliced from idx 5 until 27 + 2 spaces between letters removed adding converting into str.
    setPieces(
      chess
        .ascii()
        .split("\n")
        .slice(1, 9)
        .map((rank) => rank.slice(5, 27).split("  "))
    );
  };

  return (
    <div className={styles.board}>
      {new Array(8).fill(0).map((_, i) => {
        return (
          <div className={styles.row} key={i}>
            {new Array(8).fill(0).map((_, j) => {
              let p = pieces[i][j];
              let c = "";
              if (p == ".") {
                p = "";
              } else if (p.match(/[A-Z]/)) {
                p = whitePieces[initialPieces.indexOf(p.toLowerCase())]; // Changing letter by symbol, taking the index of initialPieces for take the index of the white pieces (the same with black pieces)
                c = "w";
              } else {
                p = blackPieces[initialPieces.indexOf(p)];
                c = "b";
              }

              const square = `${"abcdefgh".charAt(j)}${8 - i}`;
              return (
                <div
                  className={[
                    styles.col,
                    (i + j) % 2 == 0 ? styles.w : styles.b,
                    p && chess.turn() == c && styles.pointer,
                    highlighted.slice(1).includes(square) && styles.highlighted,
                  ].join(" ")}
                  key={`${i}, ${j}`}
                  onClick={() => {
                    if (highlighted.slice(1).includes(square)) {
                      chess.move({ to: square, from: highlighted[0] });
                      getBoard();
                      setIsLoading(true);
                      //ai-movement delay
                      setTimeout(() => {
                        const aiMove = calculateBestMove();
                        if (aiMove) chess.move(aiMove);
                        getBoard();
                        setHighlighted([]);
                        setIsLoading(false);
                      }, 2000);

                    } else if (p && chess.turn() == c) {
                      const mvs = chess.moves({
                        // @ts-ignore
                        square,
                        verbose: true,
                      }) as Move[];
                      setHighlighted([square, ...mvs.map(({ to }) => to)]);
                    } else {
                      setHighlighted([]);
                    }
                  }}
                >
                  {p}
                </div>
              );
            })}
          </div>
        );
      })}
      <Loader hidden={!isLoading} />
    </div>
  );
};

export default Board;
