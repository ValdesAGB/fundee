"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

interface SlideDotsProps {
  count?: number;        // nombre de dots (défaut: 3)
  autoPlay?: boolean;    // animation automatique (défaut: true)
  interval?: number;     // ms entre chaque slide (défaut: 3000)
  activeColor?: string;  // couleur dot actif (défaut: #ff6b00)
  inactiveColor?: string;// couleur dot inactif (défaut: rgba(255,255,255,0.3))
  onChange?: (index: number) => void; // callback quand index change
}

export default function SlideDots({
  count = 3,
  autoPlay = true,
  interval = 3000,
  activeColor = "#ff6b00",
  inactiveColor = "rgba(255,255,255,0.3)",
  onChange,
}: SlideDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % count;
        onChange?.(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, count, interval, onChange]);

  const handleClick = (index: number) => {
    setActive(index);
    onChange?.(index);
  };

  return (
    <Wrapper>
      {Array.from({ length: count }).map((_, i) => (
        <Dot
          key={i}
          $active={i === active}
          $activeColor={activeColor}
          $inactiveColor={inactiveColor}
          onClick={() => handleClick(i)}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div<{
  $active: boolean;
  $activeColor: string;
  $inactiveColor: string;
}>`
  width: ${({ $active }) => ($active ? "24px" : "8px")};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active, $activeColor, $inactiveColor }) =>
    $active ? $activeColor : $inactiveColor};
  transition: width 0.3s ease, background 0.3s ease;
  cursor: pointer;
`;