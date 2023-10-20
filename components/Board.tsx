import { useEffect, useState } from "react";
import styles from "./board.module.scss";

import { initialPieces, blackPieces, whitePieces, chess } from "../utils/chess-utils";

const Board = () => {
  // represent the board
  const [pieces, setPieces] = useState(
    new Array(8).fill(0).map(() => new Array(8).fill(""))
  );

  useEffect(() => {

    // ascii square with lines removed, each rank sliced from idx 5 until 27 + 2 spaces between letters removed adding converting into str.
    const b = chess
      .ascii()
      .split("\n")
      .slice(1, 9)
      .map((rank) => rank.slice(5, 27).split("  "));
    setPieces(b);
  }, []);

  return (
    <div className={styles.board}>
      {new Array(8).fill(0).map((_, i) => {
        return (
          <div className={styles.row} key={i}>
            {new Array(8).fill(0).map((_, j) => {
              let p = pieces[i][j];
              console.log("first", p)
              if (p === ".") {
                p = "";
              } else if (p.match(/[A-Z]/)) {
                p = whitePieces[initialPieces.indexOf(p.toLowerCase())]; // Changing letter by symbol, taking the index of initialPieces for take the index of the white pieces (the same with black pieces)
              } else {
                p = blackPieces[initialPieces.indexOf(p)];

              }
              return (
                <div
                  className={[
                    styles.col,
                    (i + j) % 2 === 0 ? styles.w : styles.b,
                  ].join(" ")}
                  key={`${i}, ${j}`}
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
