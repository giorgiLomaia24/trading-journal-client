import { useEffect } from "react";

let lockCount = 0;
let saved = null;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      const body = document.body;
      const html = document.documentElement;
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      saved = {
        bodyOverflow: body.style.overflow,
        htmlOverflow: html.style.overflow,
        bodyPaddingRight: body.style.paddingRight
      };

      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      // რომ გვერდი სქროლბარის გაქრობისას არ "გახტეს"
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0 && saved) {
        document.body.style.overflow = saved.bodyOverflow;
        document.documentElement.style.overflow = saved.htmlOverflow;
        document.body.style.paddingRight = saved.bodyPaddingRight;
        saved = null;
      }
    };
  }, [active]);
}