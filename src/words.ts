import words from "an-array-of-english-words";

const uppercaseWords = words.map((w) => w.toUpperCase());

export const fiveLetterWords = uppercaseWords.filter((w) => w.length === 5);

export const wordsWithNLetters = (n: number) =>
  uppercaseWords.filter((w) => w.length === n);
