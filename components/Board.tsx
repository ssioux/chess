import { useEffect, useState } from "react";
import styles from "./board.module.scss";

import {
  initialPieces,
  blackPieces,
  whitePieces,
  chess,
} from "../utils/chess-utils";

const Board = () => {
  // represent the board
  const [pieces, setPieces] = useState(
    new Array(8).fill(0).map(() => new Array(8).fill(""))
  );

  const [highlighted, setHighlighted] = useState<string[]>([]);
  useEffect(() => {

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


    getBoard();
  }, []);

 
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
                    highlighted.includes(square) && styles.highlighted,
                  ].join(" ")}
                  key={`${i}, ${j}`}
                  onClick={() => {
                    // next posible position
                    // ignoring square ts error
                    // @ts-ignore
                    const mvs = chess.moves({ square , verbose: true }) as Move[];
                    setHighlighted(mvs.map(({ to }) => to));
                 
                  }}
                >
                  {p}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
