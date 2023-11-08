import styles from "./board.module.scss";
import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { calculateBestMove, initGame } from "chess-ai";
import { useMediaQuery } from "react-responsive";

const Board = () => {
  // web worker
  const workerRef = useRef<Worker>();
  // mQuery for chess
  const isPhone = useMediaQuery({
    query: "(max-width: 1200px)",
  });
  const classBtn: string = isPhone ? styles.chessBtnPhone : styles.chessBtn;
  // ai-skill (0-2)
  const [aiSkill, setAiSkill] = useState<number>(0);

  const [easyBtn, setEasyBtn] = useState<string>(classBtn);
  const [mediumBtn, setMediumBtn] = useState<string>(classBtn);
  const [hardBtn, setHardBtn] = useState<string>(classBtn);

  // inCheck Alert
  const [inCheckAlert, setInCheckAlert] = useState<string>(styles.bordered);
  // new Game

  const [game, setGame] = useState<any>(new Chess());

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../utils/worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (e: MessageEvent) => {
      console.log("Hi from UI", e);
    };
    workerRef.current.postMessage("Hi -- from UI");
    initGame(game, aiSkill); // From 0 - 2 ai-level

    return () => {
      workerRef.current?.terminate();
    };
  }, [game, aiSkill]);

  // Dificulty
  const easy = () => {
    if (isPhone) {
      setEasyBtn(styles.activeBtnPhone);
      setMediumBtn(styles.chessBtnPhone);
      setHardBtn(styles.chessBtnPhone);
    } else {
      setEasyBtn(styles.activeBtn);
      setMediumBtn(styles.chessBtn);
      setHardBtn(styles.chessBtn);
    }

    setAiSkill(0);
    game.reset();
  };

  const medium = () => {
    if (isPhone) {
      setEasyBtn(styles.chessBtnPhone);
      setMediumBtn(styles.activeBtnPhone);
      setHardBtn(styles.chessBtnPhone);
    } else {
      setEasyBtn(styles.chessBtn);
      setMediumBtn(styles.activeBtn);
      setHardBtn(styles.chessBtn);
    }

    setAiSkill(1);
    game.reset();
  };

  const hard = () => {
    if (isPhone) {
      setEasyBtn(styles.chessBtnPhone);
      setMediumBtn(styles.chessBtnPhone);
      setHardBtn(styles.activeBtnPhone);
    } else {
      setEasyBtn(styles.chessBtn);
      setMediumBtn(styles.chessBtn);
      setHardBtn(styles.activeBtn);
    }

    setAiSkill(2);

    game.reset();
  };
  const reset = () => {
    setAiSkill(aiSkill);
    game.reset();
    //@ts-ignore
    onDrop();
  };
  const undo = () => {
    setAiSkill(aiSkill);
    game.undo();
    game.undo();
    // @ts-ignore
    onDrop();
  };

  //Let's perform a function on the game state

  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }
  //Movement of computer
  function makeRandomMove() {
    const possibleMove = game.moves();
    // 1. Draw
    if (game.in_draw() || game.in_stalemate()) {
      alert("Draw");
    }
    // 2. Check Mate
    if (game.in_checkmate() || possibleMove.length === 0) {
      alert("Check Mate");
    }

    // 2.1
    if (!game.in_check() && possibleMove.length === 0) {
      alert("Draw");
      game.game_over();
    }
    // 3. Game Over
    if (game.game_over()) {
      alert("Game Over");
    }
    //select ai move
    const aiMove = calculateBestMove();

    //play random move
    safeGameMutate((game: any) => {
      game.move(aiMove);
    });

    // onCheck?
    game.in_check()
      ? setInCheckAlert(styles.onCheck)
      : setInCheckAlert(styles.bordered);
  }

  //Perform an action when a piece is droped by a user

  function onDrop(source: string, target: string) {
    let move = null;

    safeGameMutate((game: any) => {
      move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });
    });

    // 1. illegal move
    if (move == null) return false;
    // 2. move for ai
    setTimeout(makeRandomMove, 200);

    return true;
  }

  return (
    <>
      <div className={[styles.container, styles.chessPage].join(" ")}>
        <div className={styles.board}>
          <div className={styles.btnGroup}>
            <button onClick={easy} className={easyBtn}>
              Easy
            </button>
            <button onClick={medium} className={mediumBtn}>
              Medium
            </button>
            <button onClick={hard} className={hardBtn}>
              Hard
            </button>
          </div>

          <div className={inCheckAlert}>
            <Chessboard
              customDropSquareStyle={{
                boxShadow: "inset 0 0 1px 6px rgba(255, 215, 0, 0.73)",
              }}
              customBoardStyle={{
                borderRadius: "5px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
              }}
              customDarkSquareStyle={{ backgroundColor: "#0D77B7" }}
              customLightSquareStyle={{ backgroundColor: "#fff" }}
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={isPhone ? 333 : 800}
            />
          </div>
          <div className={styles.btnGroup}>
            <button
              onClick={reset}
              className={isPhone ? styles.chessBtnBottom : styles.chessBtn}
            >
              Reset
            </button>
            <button
              onClick={undo}
              className={isPhone ? styles.chessBtnBottom : styles.chessBtn}
            >
              Undo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
