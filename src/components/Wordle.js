import React, { useEffect, useState } from "react";
import useWordle from "../hooks/useWordle";

// components
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

export default function Wordle() {
  const {
    type,
    changeType,
    currentGuess,
    guesses,
    turn,
    isCorrect,
    usedKeys,
    handleKeyup,
    reset,
    seed
  } = useWordle();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showModal === true) {
      setTimeout(() => {
        reset();
        setShowModal(false);
      }, 3000);
    }
  }, [showModal]);
  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    if (isCorrect && showModal !== true) {
      setShowModal(true);
      window.removeEventListener("keyup", handleKeyup);
    }
    if (turn > 5 && showModal !== true) {
      setTimeout(() => setShowModal(true), 2000);
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup, isCorrect, turn]);

  return (
    <div>
      <div>
        <button
          className={` btn ${type === "Daily" ? "active" : ""}`}
          onClick={() => changeType("Daily")}
        >
          Daily
        </button>
        <button
          className={` btn ${type === "Random" ? "active" : ""}`}
          onClick={() => changeType("Random")}
        >
          Random
        </button>
        <button
          className={` btn ${type === "Word" ? "active" : ""}`}
          onClick={() => changeType("Word")}
        >
          level {seed}
        </button>
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
      <Keypad usedKeys={usedKeys} />
      {showModal && <Modal isCorrect={isCorrect} turn={turn} />}
    </div>
  );
}
