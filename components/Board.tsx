import styles from "./board.module.scss";

const Board = () => {
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
