import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { createInitialBoardState, GameState } from "./types";
import { wordsWithNLetters } from "./words";

export const createLocalStore = (
  numberOfguesses: number,
  wordList: string[]
): [Store<GameState>, SetStoreFunction<GameState>] => {
  const localState = localStorage.getItem("hurdle-game-state");

  const word = wordList[Math.floor(Math.random() * (wordList.length - 0) + 0)]!;
  const init: GameState = {
    board: createInitialBoardState(numberOfguesses),
    word,
  };

  const [state, setState] = createStore<GameState>(
    localState ? JSON.parse(localState) : init
  );

  createEffect(() =>
    localStorage.setItem("hurdle-game-state", JSON.stringify(state))
  );
  return [state, setState];
};
