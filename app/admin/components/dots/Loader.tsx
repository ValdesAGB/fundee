"use client";

import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  from { transform: translateY(0); opacity: 0.4; }
  to   { transform: translateY(-8px); opacity: 1; }
`;

/* ── Spinner ── */

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 107, 0, 0.15);
  border-top: 4px solid #ff6b00;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export function Spinner() {
  return (
    <SpinnerWrapper>
      <SpinnerCircle />
    </SpinnerWrapper>
  );
}

/* ── DotsLoader ── */

const DotsWrapper = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: ${bounce} 0.5s infinite alternate;

  &:nth-child(1) {
    background: #ff6b00;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    background: #016232;
    animation-delay: 0.15s;
  }

  &:nth-child(3) {
    background: #0f172a;
    animation-delay: 0.3s;
  }
`;

export function Loader() {
  return (
    <DotsWrapper>
      <Dot />
      <Dot />
      <Dot />
    </DotsWrapper>
  );
}