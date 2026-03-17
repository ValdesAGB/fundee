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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Card = styled.form`
  width: 100%;
  max-width: 660px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`;

export const PageTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 6px;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 32px;
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
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: #cbd5e1; }

  &:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const FieldTextarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  margin-bottom: 20px;
  resize: none;
  height: 100px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: #cbd5e1; }

  &:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }
`;

export const FieldSelect = styled.select`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  margin-bottom: 8px;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus { border-color: #ff6b00; }
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
`;

export const Column = styled.div`
  flex: 1;
`;

export const PromoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const Toggle = styled.button<{ $active: boolean }>`
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#ff6b00" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "white" : "#64748b")};
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: 0.2s;
`;

export const NewCatLink = styled.span`
  font-size: 12px;
  color: #ff6b00;
  cursor: pointer;
  margin-bottom: 20px;
  display: block;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`;

export const ImageTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
`;

export const ImageTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid ${({ $active }) => ($active ? "#ff6b00" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#fff5ee" : "white")};
  color: ${({ $active }) => ($active ? "#ff6b00" : "#94a3b8")};
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1.5px solid #e2e8f0;
`;

export const SubmitBtn = styled.button`
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: #ff6b00;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;

  &:hover:not(:disabled) {
    background: #e55d00;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

export const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
`;


export const SuccessCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  background: white;
  padding: 60px 48px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  max-width: 480px;
  width: 100%;
`;

export const SuccessIcon = styled.div`
  font-size: 52px;
  line-height: 1;
`;

export const SuccessTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
`;

export const SuccessText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
`;