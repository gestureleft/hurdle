import { Component, createSignal, onCleanup, Show, Signal } from "solid-js";

import app from "./App.module.css";
import {
  appearFromLeft,
  dismissLeft,
  doAddLetterAnimation,
  doBadWordAnimation,
  doFadeOutAnimation,
  doRevealAnimation,
} from "./animations";
import { FiMenu } from "solid-icons/fi";
import Grid from "./components/Grid";
import { wordsWithNLetters } from "./words";
import { createGameStore, DidAddLetter, DidMakeGuess } from "./gameLogic";
import Keyboard from "./components/Keyboard";
import { createErrorMessage } from "./errorMessage";
import About from "./components/About";

const App: Component = () => {
  const WORD_LENGTH = 5;
  const NUMBER_OF_GUESSES = 6;
  const WORD_LIST = wordsWithNLetters(WORD_LENGTH);

  const [lettersRevealed, setLettersRevealed] = createSignal(WORD_LENGTH);
  const [rowBeingRevealed, setRowBeingRevealed] = createSignal(0);
  const {
    gameState,
    rowBeingEdited,
    addLetter,
    removeLetter,
    makeGuess,
    doneGuessing,
  } = createGameStore(NUMBER_OF_GUESSES, WORD_LENGTH, WORD_LIST);
  const [rowsRevealed, setRowsRevealed] = createSignal(rowBeingEdited());

  const [errorMessage, setErrorMessage] = createErrorMessage(async () => {
    const errorDiv = document.querySelector("#error-div");
    if (errorDiv) {
      return doFadeOutAnimation(errorDiv);
    }
  });

  const addLetterWithAnimation: typeof addLetter = (key: string) => {
    if (addLetter(key) === DidAddLetter.Yes) {
      const guess = gameState.board[rowBeingEdited()]?.guess;
      const toAnimate = document.querySelector(
        `main > :nth-child(${rowBeingEdited() + 1}) > :nth-child(${
          guess?.length ?? 0
        })`
      );
      if (toAnimate) doAddLetterAnimation(toAnimate);
      return DidAddLetter.Yes;
    }
    return DidAddLetter.No;
  };

  const makeGuessWithAnimation = (): void => {
    if (doneGuessing()) return;
    const guess = gameState.board[rowBeingEdited()]?.guess;
    if (!guess || guess.length < WORD_LENGTH) {
      const toAnimate = document.querySelector(
        `main > :nth-child(${rowBeingEdited() + 1})`
      );
      if (!toAnimate) return;
      doBadWordAnimation(toAnimate);
      setErrorMessage("Not enough letters");
      return;
    }
    if (WORD_LIST.indexOf(guess) < 0) {
      const toAnimate = document.querySelector(
        `main > :nth-child(${rowBeingEdited() + 1})`
      );
      if (!toAnimate) return;
      doBadWordAnimation(toAnimate);
      setErrorMessage("Not in word list");
      return;
    }
    // We now reveal the hint for the row that is being edited
    // if the guess is valid
    setRowBeingRevealed(rowBeingEdited());
    if (makeGuess() === DidMakeGuess.No) {
      return;
    }
    setLettersRevealed(0);
    doRevealAnimation(
      document.querySelectorAll(`main > :nth-child(${rowBeingEdited()}) > div`),
      () => setLettersRevealed((i) => i + 1),
      () => setRowsRevealed((i) => i + 1)
    );
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (
      e.key.length === 1 &&
      e.key.match(/[a-z]/i) &&
      (rowBeingRevealed() !== rowBeingEdited() - 1 ||
        lettersRevealed() === WORD_LENGTH)
    ) {
      addLetterWithAnimation(e.key.toUpperCase());
    }
    if (e.key === "Backspace") {
      removeLetter();
    }
    if (
      e.key === "Enter" &&
      (rowBeingRevealed() !== rowBeingEdited() - 1 ||
        lettersRevealed() === WORD_LENGTH)
    ) {
      makeGuessWithAnimation();
    }
  };

  document.body.addEventListener("keyup", onKeyUp);
  onCleanup(() => {
    document.body.removeEventListener("keyup", onKeyUp);
  });

  const showWord = () => setErrorMessage(`The word is ${gameState.word}`);

  const [menuShown, setMenuShown] = createSignal(false);
  const toggleMenu = async (e: MouseEvent) => {
    e.stopPropagation();
    const menuElement = document.querySelector(`.${app.menu}`);
    if (!menuElement) return;
    if (menuShown()) {
      setMenuShown(false);
      await dismissLeft(menuElement, "var(--menu-width)");
      menuElement.classList.remove(app.menuShown ?? "");
    } else {
      console.log("Appearing");
      menuElement.classList.add(app.menuShown ?? "");
      appearFromLeft(menuElement, "var(--menu-width)");
      setMenuShown(true);
    }
  };

  const onMenuClick = (e: MouseEvent) => {
    const menuElement = document.querySelector(`.${app.menu}`);
    if (!menuShown()) return;
    if (e.target instanceof Element) {
      !menuElement?.contains(e.target) && toggleMenu(e);
    }
  };
  document.body.addEventListener("click", onMenuClick);

  onCleanup(() => document.body.removeEventListener("click", onMenuClick));

  return (
    <div class={app.wordle}>
      <Show when={errorMessage() !== undefined}>
        <div id="error-div" class={app.errorDialog}>
          {errorMessage()}
        </div>
      </Show>
      <header>
        <div>
          <button onClick={toggleMenu} class={app.menuButton}>
            <FiMenu size={24} color="white" />
          </button>
          <button onClick={showWord}>?</button>
        </div>
        Hurdle
      </header>
      <div class={app.menu}>
        <About close={toggleMenu} />
      </div>
      <main>
        <Grid
          rowBeingRevealed={rowBeingRevealed()}
          lettersRevealed={lettersRevealed()}
          wordLength={WORD_LENGTH}
          state={gameState}
        />
      </main>
      <footer>
        <Keyboard
          state={gameState}
          rowsRevealed={rowsRevealed()}
          addLetter={addLetterWithAnimation}
          removeLetter={removeLetter}
          makeGuess={makeGuessWithAnimation}
        />
      </footer>
    </div>
  );
};

export default App;
