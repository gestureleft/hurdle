import { GameState, Row } from "./types";

// Given a grid state, return how many rows have been submitted
export const countSubmittedRows = (gameState: GameState): number => {
  return gameState.board.reduce((acc, el) => acc + (el.submitted ? 1 : 0), 0);
};

// Given a guess string, return an array of length `wordLength`, where
// each array element is either a character from `guess` or undefined
export const makeGuessArray = (guess: string, wordLength: number): string[] => {
  return guess
    .split("")
    .concat(Array(Math.max(0, wordLength - guess.length)).fill(""));
};

// Returns whether the character at `letterIndex` should be rendered
// with the green "Correct" colour
export const correct = (word: string, row: Row, letterIndex: number): boolean =>
  word[letterIndex] === row.guess[letterIndex];

const countOfLetterInWord = (word: string, letter: string): number =>
  word.split("").reduce((acc, el) => (el === letter ? acc + 1 : acc), 0);

// Return the index into `guess` of the first instance of `letter`
// that isn't correct
export const indexOfFirstNotCorrectInstanceOfLetter = (
  word: string,
  guess: string,
  letter: string
): number => {
  let lettersUsed = 0;
  for (let i = 0; i < word.length; i++) {
    // Correct Instance
    if (guess[i] === letter && word[i] === letter) {
      lettersUsed += 1;
      continue;
    }
    // Incorrect Instance
    if (guess[i] === letter) {
      if (lettersUsed + 1 <= countOfLetterInWord(word, letter)) return i;
    }
  }
  return -1;
};

// Returns whether the character at `letterIndex` should be rendered
// with the yellow "In Word" colour
export const inWord = (
  word: string,
  row: Row,
  letterIndex: number
): boolean => {
  // We return true if this is the first occurence of letter in guess
  // that isn't correct
  const guessedLetter = row.guess[letterIndex];
  if (!guessedLetter) return false;
  return (
    word.indexOf(guessedLetter) > -1 &&
    letterIndex ===
      indexOfFirstNotCorrectInstanceOfLetter(word, row.guess, guessedLetter)
  );
};

// Returns whether the character at `letterIndex` should be rendered
// with the grey "Incorrect" colour
export const incorrect = (
  word: string,
  row: Row,
  letterIndex: number
): boolean =>
  !correct(word, row, letterIndex) && !inWord(word, row, letterIndex);

// Given a word and a guess, return a list of indexes, where
// each index in the list points to a correct letter in the guess
export const correctLetterIndexes = (guess: string, word: string) => {
  return guess.split("").reduce((acc, el, i) => {
    if (el === word[i]) {
      return acc.concat([i]);
    }
    return acc;
  }, [] as number[]);
};

// Given a word and a guess, return a list of indexes, where
// each index in the list points to a letter in the guess that
// "is in the word" according to Wordle rules
export const inWordLetterIndexes = (guess: string, word: string) => {
  return guess.split("").reduce(
    (acc, el, i) => {
      for (let j = 0; j < word.length; j++) {
        if (word[j] === el && acc.usedLetters.indexOf(j) < 0) {
          acc.usedLetters.push(j);
          acc.inWord.push(i);
        }
      }
      return acc;
    },
    { usedLetters: correctLetterIndexes(guess, word), inWord: [] as number[] }
  ).inWord;
};
