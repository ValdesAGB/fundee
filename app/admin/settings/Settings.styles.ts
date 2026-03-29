import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
`;

export const Container = styled.div`
  flex: 1;
  padding: 48px 52px;
`;

export const PageTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 6px;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 40px;
`;

export const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

export const SectionTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
`;

export const SectionSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 24px;
`;

export const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 24px 0;
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
`;

export const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
`;

export const FieldInput = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;

  &::placeholder { color: #cbd5e1; }

  &:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const FieldTextarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  resize: none;
  height: 100px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: #cbd5e1; }

  &:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }
`;

export const AvatarBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

export const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #016232);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

export const AvatarInfo = styled.div``;

export const AvatarName = styled.p`
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;
  margin-bottom: 4px;
`;

export const AvatarRole = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(255, 107, 0, 0.1);
  color: #ff6b00;
  font-size: 12px;
  font-weight: 600;
`;

export const SaveBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: #ff6b00;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #e55d00;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #fecaca;
    transform: translateY(-1px);
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

export const ToggleInfo = styled.div``;

export const ToggleLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
`;

export const ToggleDesc = styled.p`
  font-size: 12px;
  color: #94a3b8;
`;

export const Toggle = styled.button<{ $active: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ $active }) => ($active ? "#ff6b00" : "#e2e8f0")};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${({ $active }) => ($active ? "23px" : "3px")};
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
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

export const SuccessBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  flex-shrink: 0;

  &:hover > div:last-child {
    opacity: 1;
  }
`;


export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const AvatarMenu = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
  min-width: 160px;
  display: flex;
  flex-direction: column;
`;

export const AvatarSpinner = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const AvatarMenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#374151")};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fee2e2" : "#f3f4f6")};
  }

  i { font-size: 15px; }
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalImg = styled.img`
  max-width: 480px;
  max-height: 480px;
  width: 90vw;
  height: 90vw;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;

  &:hover { background: #f3f4f6; }
`;