import grid from "./Grid.module.css";
import { Component, For } from "solid-js";
import {
  makeGuessArray,
  correct,
  inWord,
  incorrect,
  correctLetterIndexes,
  inWordLetterIndexes,
} from "../utils";
import { GameState } from "../types";

type GridProps = {
  state: GameState;
  wordLength: number;
  lettersRevealed: number;
  rowBeingRevealed: number;
};

const Grid: Component<GridProps> = (props) => {
  return (
    <For each={props.state.board}>
      {(row, rowNum) => {
        const correctLetters = () =>
          correctLetterIndexes(row.guess, props.state.word);
        const inWord = () => inWordLetterIndexes(row.guess, props.state.word);
        return (
          <div class={grid.row}>
            <For each={makeGuessArray(row.guess, props.wordLength)}>
              {(el, i) => {
                return (
                  <div
                    classList={{
                      [grid.cell ?? ""]: true,
                      [grid["has-letter"] ?? ""]:
                        (!row.submitted ||
                          (i() >= props.lettersRevealed &&
                            rowNum() === props.rowBeingRevealed)) &&
                        el !== "",
                      [grid["correct"] ?? ""]:
                        row.submitted &&
                        (i() < props.lettersRevealed ||
                          rowNum() !== props.rowBeingRevealed) &&
                        correctLetters().indexOf(i()) > -1,
                      [grid["in-word"] ?? ""]:
                        row.submitted &&
                        (i() < props.lettersRevealed ||
                          rowNum() !== props.rowBeingRevealed) &&
                        inWord().indexOf(i()) > -1,
                      [grid["incorrect"] ?? ""]:
                        row.submitted &&
                        (i() < props.lettersRevealed ||
                          rowNum() !== props.rowBeingRevealed) &&
                        correctLetters().indexOf(i()) < 0 &&
                        inWord().indexOf(i()) < 0,
                    }}
                  >
                    {el}
                  </div>
                );
              }}
            </For>
          </div>
        );
      }}
    </For>
  );
};

export default Grid;
