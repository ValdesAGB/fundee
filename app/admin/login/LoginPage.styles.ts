import Link from "next/link";
import styled, { keyframes } from "styled-components";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  overflow: hidden;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }
`;

export const Left = styled.div`
  width: 480px;
  flex-shrink: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  animation: ${fadeUp} 0.6s ease both;

  /* À partir de 1200px — même largeur que Right */
  @media (min-width: 1200px) {
    width: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    width: 420px;
    padding: 40px 32px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 24px;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 48px;
  }
`;

export const FormWrap = styled.form`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Right = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0a2540 0%, #016232 60%, #ff6b00 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* À partir de 1200px — même largeur que Left */
  @media (min-width: 1200px) {
    width: 50%;
    flex: none;
  }

  &::before {
    content: "";
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    top: -100px;
    right: -150px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.06);
    bottom: -80px;
    left: -80px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RightInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    padding: 40px;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
`;

export const BrandDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff6b00;
`;

export const BrandName = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #0a2540;
  letter-spacing: -0.3px;
`;

export const Heading = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: #0a2540;
  margin-bottom: 8px;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

export const Sub = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.6;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

export const FieldInput = styled.input`
  padding: 13px 14px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #111827;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &::placeholder {
    color: #c4c4c4;
  }

  &:focus {
    border-color: #016232;
    box-shadow: 0 0 0 3px rgba(1, 98, 50, 0.12);
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

export const Forgot = styled(Link)`
  font-size: 13px;
  color: #016232;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const SubmitBtn = styled.button`
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #016232;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;

  &:hover:not(:disabled) {
    background: #014d27;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const Footer = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #9ca3af;

  a {
    color: #016232;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
`;

export const Quote = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
  line-height: 1.4;
  max-width: 380px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    font-size: 22px;
  }
`;

export const Accent = styled.span`
  color: #ff6b00;
`;
