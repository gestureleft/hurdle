export type Row = {
  guess: string;
  submitted: boolean;
};
export type GameState = { board: Row[]; word: string };

export const createInitialBoardState = (guesses: number): GameState["board"] =>
  Array(guesses)
    .fill(undefined)
    .map(() => ({ guess: "", submitted: false }));
