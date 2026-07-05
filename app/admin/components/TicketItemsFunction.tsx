import { useEffect, useState } from "react";
import { ALL_ITEMS, TICK_DURATION } from "./data";

export function useTicketItems() {
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(true);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  useEffect(() => {
    const cycle = setInterval(() => {
      // 1. Fade out
      setVisible(false);
      const next = (offset + 3) % ALL_ITEMS.length;
      setNextOffset(next);
    }, TICK_DURATION);
    return () => clearInterval(cycle);
  }, [offset]);

  useEffect(() => {
    if (!visible && nextOffset !== null) {
      const t = setTimeout(() => {
        setOffset(nextOffset);
        setNextOffset(null);
        setVisible(true);
      }, 500); // durée du fade out
      return () => clearTimeout(t);
    }
  }, [visible, nextOffset]);

  const items = [
    ALL_ITEMS[offset % ALL_ITEMS.length],
    ALL_ITEMS[(offset + 1) % ALL_ITEMS.length],
    ALL_ITEMS[(offset + 2) % ALL_ITEMS.length],
  ];

  return { items, visible };
}
