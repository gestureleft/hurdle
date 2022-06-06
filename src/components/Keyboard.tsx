import { Component, For, Show } from "solid-js";
import { DidAddLetter, DidMakeGuess } from "../gameLogic";
import { GameState } from "../types";
import { correct, incorrect, inWord } from "../utils";
import keyboard from "./Keyboard.module.css";
import { TiBackspaceOutline } from "solid-icons/ti";

type KeyboardProps = {
  state: GameState;
  rowsRevealed: number;
  addLetter: (char: string) => DidAddLetter;
  removeLetter: () => void;
  makeGuess: () => DidMakeGuess;
};

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "<"],
];

const Keyboard: Component<KeyboardProps> = (props) => {
  const incorrectLetters = () =>
    props.state.board.reduce((acc, el, i) => {
      if (i >= props.rowsRevealed) return acc;
      if (!el.submitted) return acc;
      for (let i = 0; i < el.guess.length; i++) {
        if (incorrect(props.state.word, el, i)) {
          acc[el.guess[i]!] = true;
        }
      }
      return acc;
    }, {} as { [key: string]: boolean });

  const correctLetters = () =>
    props.state.board.reduce((acc, el, i) => {
      if (i >= props.rowsRevealed) return acc;
      if (!el.submitted) return acc;
      for (let i = 0; i < el.guess.length; i++) {
        if (correct(props.state.word, el, i)) {
          acc[el.guess[i]!] = true;
        }
      }
      return acc;
    }, {} as { [key: string]: boolean });

  const inWordLetters = () =>
    props.state.board.reduce((acc, el, i) => {
      if (i >= props.rowsRevealed) return acc;
      if (!el.submitted) return acc;
      for (let i = 0; i < el.guess.length; i++) {
        if (inWord(props.state.word, el, i)) {
          acc[el.guess[i]!] = true;
        }
      }
      return acc;
    }, {} as { [key: string]: boolean });

  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      props.makeGuess();
      return;
    }
    if (key === "<") {
      props.removeLetter();
      return;
    }
    props.addLetter(key);
  };

  return (
    <div class={keyboard.root}>
      <For each={KEYS}>
        {(keyboardRow) => (
          <div class={keyboard.keyRow}>
            <For each={keyboardRow}>
              {(key) => {
                return (
                  <button
                    onClick={() => handleKeyPress(key)}
                    classList={{
                      [keyboard.incorrect ?? ""]: incorrectLetters()[key],
                      [keyboard.unused ?? ""]:
                        !incorrectLetters()[key] &&
                        !correctLetters()[key] &&
                        !inWordLetters()[key],
                      [keyboard.correct ?? ""]: correctLetters()[key],
                      [keyboard.inWord ?? ""]:
                        inWordLetters()[key] && !correctLetters()[key],
                      [keyboard.key ?? ""]: true,
                      [keyboard.backspace ?? ""]: key === "<",
                    }}
                  >
                    <Show when={key === "<"} fallback={key}>
                      <TiBackspaceOutline size={26} color="white" />
                    </Show>
                  </button>
                );
              }}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default Keyboard;
