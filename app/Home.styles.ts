// app/Home.styles.ts
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.div`
  position: relative;
  min-height: 100vh;
  background: #0b2b22;
  color: #f6f2e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  font-family: "Inter", sans-serif;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 18% 12%,
      rgba(232, 163, 61, 0.1),
      transparent 45%
    ),
    radial-gradient(circle at 85% 75%, rgba(201, 123, 83, 0.1), transparent 50%);
  pointer-events: none;
`;

export const RescueRing = styled.div`
  position: absolute;
  top: -220px;
  right: -220px;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  border: 1px dashed rgba(246, 242, 231, 0.08);
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    inset: 60px;
    border-radius: 50%;
    border: 1px solid rgba(246, 242, 231, 0.06);
  }

  @media (max-width: 768px) {
    width: 320px;
    height: 320px;
    top: -140px;
    right: -140px;
  }
`;

export const Nav = styled.nav`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  padding: 32px 24px 0;
`;

export const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Fraunces", serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: #f6f2e7;
`;

export const NavDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e8a33d;
  box-shadow: 0 0 10px rgba(232, 163, 61, 0.55);
`;

export const Hero = styled.section`
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 24px 80px;
  animation: ${fadeUp} 0.7s ease both;

  @media (max-width: 640px) {
    padding: 40px 20px 56px;
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(143, 174, 150, 0.12);
  border: 1px solid rgba(143, 174, 150, 0.3);
  color: #8fae96;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-bottom: 28px;
`;

export const Stamp = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 20px;
  color: #c97b53;
  transform: rotate(-8deg);
`;

export const StampSvg = styled.svg`
  width: 100%;
  height: 100%;
  animation: ${spin} 40s linear infinite;
`;

export const Title = styled.h1`
  font-family: "Fraunces", serif;
  font-size: 52px;
  font-weight: 600;
  line-height: 1.06;
  letter-spacing: -1.2px;
  color: #f6f2e7;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    font-size: 36px;
  }
`;

export const TitleAccent = styled.span`
  color: #e8a33d;
  font-style: italic;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  line-height: 1.65;
  color: #8fae96;
  max-width: 460px;
  margin-bottom: 40px;
`;

export const StatRow = styled.div`
  display: flex;
  gap: 36px;
  margin-bottom: 44px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StatNumber = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 22px;
  font-weight: 600;
  color: #e8a33d;
`;

export const StatLabel = styled.span`
  font-size: 11px;
  color: #8fae96;
  margin-top: 4px;
  text-align: center;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 360px;
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: #e8a33d;
  color: #1a1006;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: #f0b35a;
    transform: translateY(-1px);
  }
`;

export const SecondaryBtn = styled.button`
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(246, 242, 231, 0.25);
  border-radius: 12px;
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
    background: rgba(246, 242, 231, 0.06);
    border-color: rgba(246, 242, 231, 0.4);
  }
`;

export const Foot = styled.p`
  margin-top: 28px;
  font-size: 13px;
  color: rgba(143, 174, 150, 0.7);
`;

export const FoodRow = styled.div`
  display: flex;
  gap: 22px;
  margin-bottom: 28px;
  color: #c97b53;
`;

export const FoodIcon = styled.svg`
  width: 38px;
  height: 38px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;
