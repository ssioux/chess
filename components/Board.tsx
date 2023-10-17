import { useEffect, useState } from "react";
import styles from "./board.module.scss";
import { Chess } from "chess.js";

const Board = () => {
  // represent the board
  const [pieces, setPieces] = useState(
    new Array(8).fill(0).map(() => new Array(8).fill(""))
  );

  useEffect(() => {
    // new Game
    const chess = new Chess();
    // ascii square with lines removed, each rank sliced from idx 5 until 27 + 2 spaces between letters removed adding converting into str.
    const ranks = chess
      .ascii()
      .split("\n")
      .slice(1, 9)
      .map((rank) => rank.slice(5, 27).split("  "));
    console.log({ ranks, len: ranks[0].length });
  }, []);

  return (
    <div className={styles.board}>
      {new Array(8).fill(0).map((_, i) => {
        return (
          <div className={styles.row} key={i}>
            {new Array(8).fill(0).map((_, j) => {
              return (
                <div
                  className={[
                    styles.col,
                    (i + j) % 2 === 0 ? styles.w : styles.b,
                  ].join(" ")}
                  key={`${i}, ${j}`}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
