import styled from "styled-components";
import Link from "next/link";

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

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 28px;
  transition: color 0.15s;

  &:hover { color: #0f172a; }
`;

export const Card = styled.div`
  display: flex;
  gap: 48px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

export const ImageBlock = styled.div`
  flex-shrink: 0;
`;

export const ProductImage = styled.img`
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 14px;
  border: 1.5px solid #f1f5f9;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  background: #fff5ee;
  color: #ff6b00;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: capitalize;
`;

export const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 12px;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 32px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 36px;
`;

export const InfoCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f1f5f9;
`;

export const InfoLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

export const InfoValue = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
`;

export const PromoStatus = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? "rgba(255,107,0,0.12)" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "#ff6b00" : "#64748b")};
`;

export const DateRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 36px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

export const DateItem = styled.div``;

export const DateLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const DateValue = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #475569;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

export const EditButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ff6b00;
  padding: 12px 22px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #e55d00;
    transform: translateY(-1px);
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fee2e2;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  color: #dc2626;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
    transform: translateY(-1px);
  }
`;