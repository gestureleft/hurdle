import { Accessor, batch, createSignal } from "solid-js";
import { createLocalStore } from "./localStore";
import { GameState } from "./types";
import { countSubmittedRows } from "./utils";

export enum MakeGuessResult {
  DidntMakeGuess,
  MadeIncorrectGuess,
  MadeCorrectGuess,
}

export enum DidAddLetter {
  Yes,
  No,
}

export const createGameStore = (
  numberOfGuesses: number,
  wordLength: number,
  wordList: string[]
): {
  gameState: GameState;
  rowBeingEdited: Accessor<number>;
  addLetter: (char: string) => DidAddLetter;
  removeLetter: () => void;
  makeGuess: () => MakeGuessResult;
  doneGuessing: () => boolean;
} => {
  const [gameState, setGameState] = createLocalStore(numberOfGuesses, wordList);
  const [rowBeingEdited, setRowBeingEdited] = createSignal(
    countSubmittedRows(gameState)
  );
  const doneGuessing = () =>
    gameState.board[rowBeingEdited() - 1]?.guess === gameState.word;

  const addLetter = (char: string): DidAddLetter => {
    if (doneGuessing()) return DidAddLetter.No;
    const row = gameState.board[rowBeingEdited()];
    if (!row || row.guess.length >= wordLength) return DidAddLetter.No;
    setGameState("board", rowBeingEdited(), "guess", (g) => g + char);
    return DidAddLetter.Yes;
  };

  const removeLetter = () => {
    if (!gameState.board[rowBeingEdited()]) return;
    setGameState("board", rowBeingEdited(), "guess", (g) =>
      g.substring(0, g.length - 1)
    );
  };

  const makeGuess = (): MakeGuessResult => {
    const row = gameState.board[rowBeingEdited()];
    if (!row || row.guess.length < wordLength)
      return MakeGuessResult.DidntMakeGuess;
    batch(() => {
      setGameState("board", rowBeingEdited(), "submitted", true);
      setRowBeingEdited((i) => i + 1);
    });
    if (doneGuessing()) {
      return MakeGuessResult.MadeCorrectGuess;
    }
    return MakeGuessResult.MadeIncorrectGuess;
  };

  return {
    gameState,
    rowBeingEdited,
    addLetter,
    removeLetter,
    makeGuess,
    doneGuessing,
  };
};
