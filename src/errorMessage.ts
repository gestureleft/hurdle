import { Accessor, batch, createSignal, onCleanup } from "solid-js";

export const createErrorMessage = (
  runDismissAnimation: () => Promise<void>
): [Accessor<string | undefined>, (val: string) => void] => {
  const [error, setError] = createSignal<string | undefined>(undefined);
  const [timer, setTimer] = createSignal<number | undefined>(undefined);

  const clearTimer = () => {
    if (timer() !== undefined) {
      clearTimeout(timer());
    }
  };

  const setErrorThenClear = (val: string): void => {
    batch(() => {
      setError(val);
      clearTimer();
      setTimer(
        setTimeout(
          () => runDismissAnimation().then(() => setError(undefined)),
          1000
        )
      );
    });
  };

  onCleanup(clearTimer);

  return [error, setErrorThenClear];
};
