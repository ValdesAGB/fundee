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
  display: flex;
  flex-direction: column;
  padding: 48px 52px;
  overflow-x: auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const TitleBlock = styled.div``;

export const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 4px;
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
`;

export const Select = styled.select`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #ff6b00;
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  th, td {
    padding: 14px 18px;
    text-align: left;
  }

  th {
    background: #0f172a;
    color: rgba(255,255,255,0.75);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;

    &:last-child { border-bottom: none; }
    &:hover { background: #fafafa; }
  }
`;

export const Img = styled.img`
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

export const ProductName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

export const CategoryBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
`;

export const Status = styled.span<{ $active?: boolean }>`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? "rgba(255,107,0,0.12)" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "#ff6b00" : "#64748b")};
`;

export const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

export const View = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #016232;
  color: white;
  text-decoration: none;
  font-size: 13px;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

export const Editing = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ff6b00;
  color: white;
  text-decoration: none;
  font-size: 13px;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

export const Delete = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #fecaca; }
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  padding: 14px 22px;
  border-radius: 50px;
  border: none;
  background: #ff6b00;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.35);
  transition: all 0.2s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #e55d00;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(255, 107, 0, 0.4);
  }
`;

export const EmptyCell = styled.td`
  padding: 60px !important;
  text-align: center !important;
`;