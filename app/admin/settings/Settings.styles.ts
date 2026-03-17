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
  width: 72px;
  height: 72px;
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