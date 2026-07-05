import { useEffect, useRef, useState } from "react";
import { ERASE_SPEED, PAUSE_AFTER, PHRASES, TYPE_SPEED } from "./data";

export function useTypewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState({ before: "", accent: "" });
  const [phase, setPhase] = useState<
    | "typing-before"
    | "typing-accent"
    | "pause"
    | "erasing-accent"
    | "erasing-before"
  >("typing-before");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];

    const schedule = (fn: () => void, delay: number) => {
      timeout.current = setTimeout(fn, delay);
    };

    if (phase === "typing-before") {
      const target = phrase.before;
      const current = displayed.before;
      if (current.length < target.length) {
        schedule(
          () =>
            setDisplayed((d) => ({
              ...d,
              before: target.slice(0, d.before.length + 1),
            })),
          TYPE_SPEED,
        );
      } else {
        schedule(() => setPhase("typing-accent"), TYPE_SPEED);
      }
    }

    if (phase === "typing-accent") {
      const target = phrase.accent;
      const current = displayed.accent;
      if (current.length < target.length) {
        schedule(
          () =>
            setDisplayed((d) => ({
              ...d,
              accent: target.slice(0, d.accent.length + 1),
            })),
          TYPE_SPEED,
        );
      } else {
        schedule(() => setPhase("pause"), PAUSE_AFTER);
      }
    }

    if (phase === "pause") {
      schedule(() => setPhase("erasing-accent"), 0);
    }

    if (phase === "erasing-accent") {
      if (displayed.accent.length > 0) {
        schedule(
          () => setDisplayed((d) => ({ ...d, accent: d.accent.slice(0, -1) })),
          ERASE_SPEED,
        );
      } else {
        schedule(() => setPhase("erasing-before"), ERASE_SPEED);
      }
    }

    if (phase === "erasing-before") {
      if (displayed.before.length > 0) {
        schedule(
          () => setDisplayed((d) => ({ ...d, before: d.before.slice(0, -1) })),
          ERASE_SPEED,
        );
      } else {
        schedule(() => {
          setPhraseIdx((i) => (i + 1) % PHRASES.length);
          setPhase("typing-before");
        }, 200);
      }
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [phase, displayed, phraseIdx]);

  return { displayed, phase };
}
