import styles from "./board.module.scss";

const board = () => {
  return (
    <div className={styles.board}>
      {new Array(8).fill(0).map((_, i) => {
        return (<div className={styles.row} key={i}>
               {new Array(8).fill(0).map((_, j) => {
        return (<div className={styles.col} key={`${i},, ${j}`}>

        </div>);
      })}
        </div>);
      })}
    </div>
  );
};

export default board;
