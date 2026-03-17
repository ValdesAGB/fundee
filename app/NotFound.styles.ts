import styled, { keyframes } from "styled-components";
import Link from "next/link";

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
`;

export const Container = styled.div`
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
`;

export const Glow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 4s ease-in-out infinite;
  pointer-events: none;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
`;

export const Code = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 140px;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 107, 0, 0.6);
  letter-spacing: -8px;
  line-height: 1;
  margin-bottom: 0;
  animation: ${float} 4s ease-in-out infinite;
  user-select: none;
`;

export const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.4px;
`;

export const Sub = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 40px;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const HomeBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  border-radius: 10px;
  background: #ff6b00;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #e55d00;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 0, 0.35);
  }
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    transform: translateY(-2px);
  }
`;