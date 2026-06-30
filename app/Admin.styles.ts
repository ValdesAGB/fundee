// app/admin/Admin.styles.ts
import styled, { keyframes, css } from "styled-components";

/* ─── Keyframes ─────────────────────────────────────────── */

const listFadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const float = keyframes`
  0%   { transform: rotate(2deg) translateY(0px) scale(1); }
  30%  { transform: rotate(0.5deg) translateY(-14px) scale(1.01); }
  60%  { transform: rotate(2.8deg) translateY(-6px) scale(0.99); }
  100% { transform: rotate(2deg) translateY(0px) scale(1); }
`;
const slideInRotate = keyframes`
  from { opacity: 0; transform: translateY(48px) rotate(-3deg); }
  to   { opacity: 1; transform: translateY(0) rotate(2deg); }
`;

const itemReveal = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const dotPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 163, 61, 0); }
  50%       { box-shadow: 0 0 0 6px rgba(232, 163, 61, 0.18); }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const counterRotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const drift = keyframes`
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  25%  { transform: translate(6px, -8px) rotate(4deg); }
  50%  { transform: translate(-4px, 5px) rotate(-3deg); }
  75%  { transform: translate(8px, 3px) rotate(2deg); }
  100% { transform: translate(0px, 0px) rotate(0deg); }
`;

const titleLineGrow = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const badgePop = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

/* ─── Page shell ─────────────────────────────────────────── */

export const Page = styled.div`
  position: relative;
  min-height: 100vh;
  background: #0b2b22;
  color: #f6f2e7;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

/* ─── Background food illustrations ─────────────────────── */

export const BgCanvas = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

export const BgFood = styled.div<{
  $top?: string;
  $left?: string;
  $right?: string;
  $bottom?: string;
  $size: number;
  $delay: number;
  $duration: number;
  $opacity: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top ?? "auto"};
  left: ${({ $left }) => $left ?? "auto"};
  right: ${({ $right }) => $right ?? "auto"};
  bottom: ${({ $bottom }) => $bottom ?? "auto"};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  opacity: ${({ $opacity }) => $opacity};
  animation: ${drift} ${({ $duration }) => $duration}s ease-in-out
    ${({ $delay }) => $delay}s infinite;

  @media (max-width: 768px) {
    opacity: ${({ $opacity }) => $opacity * 0.5};
    width: ${({ $size }) => $size * 0.6}px;
    height: ${({ $size }) => $size * 0.6}px;
  }
`;

/* Decorative ring behind ticket */
export const OrbRing = styled.div<{ $delay: number }>`
  position: absolute;
  inset: -24px;
  border-radius: 50%;
  border: 1px solid rgba(232, 163, 61, 0.12);
  animation: ${rotateSlow} 18s linear ${({ $delay }) => $delay}s infinite;
  pointer-events: none;
`;

export const OrbRingInner = styled.div`
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 1px dashed rgba(201, 123, 83, 0.14);
  animation: ${counterRotate} 12s linear infinite;
`;

/* ─── Navigation ─────────────────────────────────────────── */

export const Nav = styled.nav`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  padding: 30px 28px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease both;
`;

export const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Fraunces", serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
`;

export const NavDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8a33d;
  animation: ${dotPulse} 2.5s ease-in-out infinite;
`;

export const NavBadge = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #8fae96;
  border: 1px solid rgba(143, 174, 150, 0.3);
  padding: 4px 10px;
  border-radius: 999px;
  animation: ${badgePop} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
`;

/* ─── Main two-column layout ─────────────────────────────── */

export const Main = styled.main`
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  padding: 52px 28px 72px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 52px;
    padding: 36px 20px 56px;
  }
`;

/* ─── Left — hero copy ───────────────────────────────────── */

export const Hero = styled.section`
  flex: 1;
  max-width: 520px;

  @media (max-width: 900px) {
    max-width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #8fae96;
  margin-bottom: 24px;
  animation: ${slideInLeft} 0.6s ease 0.1s both;
`;

export const TitleWrap = styled.div`
  margin-bottom: 22px;
  animation: ${slideInLeft} 0.6s ease 0.2s both;
  min-height: 150px;
  display: flex;
  align-items: flex-start;

  @media (max-width: 1024px) {
    min-height: 180px;
  }

  @media (max-width: 640px) {
    min-height: 140px;
  }
`;

export const Title = styled.h1`
  font-family: "Fraunces", serif;
  font-size: 68px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  color: #f6f2e7;

  @media (max-width: 1024px) {
    font-size: 54px;
  }

  @media (max-width: 640px) {
    font-size: 42px;
    letter-spacing: -1.5px;
  }
`;

export const TitleAccent = styled.span`
  position: relative;
  color: #e8a33d;
  font-style: italic;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 4px;
    height: 3px;
    background: linear-gradient(90deg, #c97b53, #e8a33d);
    border-radius: 2px;
    transform-origin: left;
    animation: ${titleLineGrow} 0.6s ease 0.8s both;
  }
`;

export const Subtitle = styled.p`
  font-size: 17px;
  line-height: 1.65;
  color: #8fae96;
  max-width: 440px;
  margin-bottom: 40px;
  animation: ${slideInLeft} 0.6s ease 0.35s both;
`;

/* ─── Stat pills ─────────────────────────────────────────── */

export const StatRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  animation: ${slideInLeft} 0.6s ease 0.45s both;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

export const StatPill = styled.div<{ $delay: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(143, 174, 150, 0.07);
  border: 1px solid rgba(143, 174, 150, 0.2);
  border-radius: 999px;
  animation: ${badgePop} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
    ${({ $delay }) => $delay}s both;
`;

export const StatNumber = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  font-weight: 700;
  color: #e8a33d;
`;

export const StatLabel = styled.span`
  font-size: 12px;
  color: #8fae96;
`;

/* ─── CTAs ───────────────────────────────────────────────── */

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
  animation: ${slideInLeft} 0.6s ease 0.55s both;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 10px;
  background: #e8a33d;
  color: #1a1006;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition:
    background 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: #f0b35a;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryBtn = styled.button`
  width: 100%;
  padding: 16px 24px;
  border: 1px solid rgba(246, 242, 231, 0.2);
  border-radius: 10px;
  background: transparent;
  color: #f6f2e7;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: rgba(246, 242, 231, 0.4);
    background: rgba(246, 242, 231, 0.05);
  }
`;

export const Foot = styled.p`
  margin-top: 20px;
  font-size: 13px;
  color: rgba(143, 174, 150, 0.6);
  animation: ${fadeIn} 0.6s ease 0.8s both;
`;

/* ─── Right — receipt ticket ─────────────────────────────── */

const teeth = (() => {
  const points: string[] = [];
  const count = 18;
  for (let i = 0; i <= count; i++) {
    const x = (i * 100) / count;
    points.push(`${x}% ${i % 2 === 0 ? "0%" : "100%"}`);
  }
  return points.join(", ");
})();

export const TicketWrap = styled.div`
  position: relative;
  width: 300px;
  flex-shrink: 0;
  animation:
    ${slideInRotate} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both,
    ${float} 4s ease-in-out 1.1s infinite;

  @media (max-width: 900px) {
    animation: ${slideInRotate} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s
      both;
    width: 100%;
    max-width: 320px;
  }
`;

export const TicketEdge = styled.div<{ $position: "top" | "bottom" }>`
  height: 12px;
  background: #123a2d;
  clip-path: polygon(${teeth});
  transform: ${({ $position }) =>
    $position === "bottom" ? "rotate(180deg)" : "none"};
`;

export const Ticket = styled.div`
  background: #123a2d;
  padding: 28px 26px 24px;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(143, 174, 150, 0.08);
`;

export const TicketHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba(246, 242, 231, 0.15);
`;

export const TicketShop = styled.div`
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 16px;
  color: #f6f2e7;
  margin-bottom: 4px;
`;

export const TicketMeta = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.4px;
  color: #8fae96;
`;

export const TicketList = styled.ul<{ $visible: boolean }>`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(6px)"};
`;

export const TicketItem = styled.li<{ $index: number }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
`;

export const TicketItemName = styled.span`
  color: #f6f2e7;
`;

export const TicketPrices = styled.span`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: "JetBrains Mono", monospace;
  white-space: nowrap;
`;

export const TicketOldPrice = styled.span`
  color: rgba(143, 174, 150, 0.55);
  text-decoration: line-through;
  font-size: 11px;
`;

export const TicketNewPrice = styled.span`
  color: #e8a33d;
  font-weight: 700;
  font-size: 13px;
`;

export const TicketTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px dashed rgba(246, 242, 231, 0.15);
`;

export const TicketTotalLabel = styled.span`
  font-family: "JetBrains Mono", monospace;
  color: #8fae96;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-size: 10px;
`;

export const TicketTotalValue = styled.span`
  font-family: "JetBrains Mono", monospace;
  color: #c97b53;
  font-weight: 700;
  font-size: 16px;
`;

export const Cursor = styled.span<{ $blink: boolean }>`
  display: inline-block;
  width: 3px;
  height: 0.85em;
  background: #e8a33d;
  margin-left: 4px;
  vertical-align: middle;
  border-radius: 1px;
  animation: ${({ $blink }) =>
    $blink
      ? css`
          ${blink} 0.7s ease-in-out infinite
        `
      : "none"};
  opacity: 1;
`;
