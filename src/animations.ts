export const doRevealAnimation = (
  elementsToAnimate: NodeListOf<Element>,
  onLetterRevealed: () => void,
  onRowRevealed: () => void
) => {
  const ANIMATION_DURATION = 450;
  if (!elementsToAnimate.length) return;
  const startAnimate = (n: number) => {
    const firstAnimation = elementsToAnimate[n]?.animate(
      [
        {
          transform: "rotate3d(0, 0, 0, 0)",
        },
        {
          transform: "rotate3d(1, 0, 0, 90deg)",
        },
      ],
      {
        duration: ANIMATION_DURATION / 2,
      }
    );
    if (!firstAnimation) return;
    firstAnimation.onfinish = () => {
      onLetterRevealed();
      const secondAnimation = elementsToAnimate[n]?.animate(
        [
          {
            transform: "rotate3d(1, 0, 0, 90deg)",
          },
          {
            transform: "rotate3d(0, 0, 0, 0)",
          },
        ],
        {
          duration: ANIMATION_DURATION / 2,
        }
      );

      if (n + 1 < elementsToAnimate.length) startAnimate(n + 1);
      else if (secondAnimation) secondAnimation.onfinish = onRowRevealed;
    };
  };
  startAnimate(0);
};

export const doBadWordAnimation = (elementToAnimate: Element) => {
  elementToAnimate.animate(
    [
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0)" },
    ],
    { iterations: 3, duration: 100 }
  );
};

export const doAddLetterAnimation = (elementToAnimate: Element) => {
  elementToAnimate.animate(
    [{ transform: "scale(1.1)" }, { transform: "scale(1)" }],
    { duration: 40 }
  );
};

export const doFadeOutAnimation = (
  elementToAnimate: Element
): Promise<void> => {
  return new Promise((res, rej) => {
    const animation = elementToAnimate.animate([{ opacity: 0 }], {
      duration: 200,
    });
    if (animation) {
      animation.onfinish = () => res();
    } else {
      rej("Couldn't create animation");
    }
  });
};

const DISMISS_ANIMATION_DURATION = 200;

export const dismissLeft = (
  elementToAnimate: Element,
  distance: string
): Promise<void> => {
  return new Promise((res, rej) => {
    const animation = elementToAnimate.animate(
      [
        {
          transform: "translateX(0)",
          opacity: 1,
        },
        { opacity: 0 },
        { opacity: 0 },
        {
          transform: `translateX(calc(-1 * ${distance}))`,
          opacity: 0,
        },
      ],
      {
        duration: DISMISS_ANIMATION_DURATION,
        easing: "ease-in-out",
      }
    );
    if (!animation) {
      rej("Couldn't create animation");
    }
    animation.onfinish = () => res();
  });
};

export const appearFromLeft = (
  elementToAnimate: Element,
  distance: string
): Promise<void> => {
  return new Promise((res, rej) => {
    const animation = elementToAnimate.animate(
      [
        {
          transform: `translateX(calc(-1 * ${distance}))`,
          opacity: 0,
        },
        { opacity: 0.2 },
        {
          transform: "translateX(0)",
          opacity: 1,
        },
      ],
      { duration: DISMISS_ANIMATION_DURATION, easing: "ease-in-out" }
    );
    if (!animation) rej("Couldn't create animation");
    animation.onfinish = () => res();
  });
};
