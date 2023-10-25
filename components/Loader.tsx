import { HTMLProps } from "react";
import styles from "./loader.module.scss";

const Loader = (props: HTMLProps<HTMLDivElement>) => {
  return (
    <div className={styles.loader} {...props}>
      <div></div>
    </div>
  );
};

export default Loader;
