import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

export const Container = styled.main`
  flex: 1;
  padding: 40px;

  @media (max-width: 1024px) {
    padding: 32px;
  }

  @media (max-width: 768px) {
    padding: 72px 16px 24px;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-family: "Poppins", sans-serif;

  &:hover {
    color: #ff6b00;
  }
`;

export const Card = styled.form`
  width: 100%;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

export const PageTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const PageSubtitle = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 32px;
`;

export const FieldLabel = styled.label`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  display: block;
`;

export const FieldInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: border 0.2s;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }
`;

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
  box-sizing: border-box;
  resize: none;
  height: 100px;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }
`;

export const FieldSelect = styled.select`
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 8px;
  background: white;
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 580px) {
    flex-direction: column;
    gap: 0;
  }
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
  padding: 4px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#ff6b00" : "#e5e7eb")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  font-weight: 600;
  transition: 0.2s;
`;

export const NewCatLink = styled.span`
  font-size: 12px;
  color: #ff6b00;
  cursor: pointer;
  margin-bottom: 20px;
  display: block;
  font-family: "Poppins", sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

export const SectionLabel = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
`;

export const ImageTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

export const ImageTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid ${({ $active }) => ($active ? "#ff6b00" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#fff5ee" : "white")};
  color: ${({ $active }) => ($active ? "#ff6b00" : "#6b7280")};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
`;

export const SubmitBtn = styled.button`
  padding: 13px;
  border-radius: 10px;
  border: none;
  background: #ff6b00;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;

  &:hover {
    background: #e55d00;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorBox = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
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

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
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

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const SuccessText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
`;
