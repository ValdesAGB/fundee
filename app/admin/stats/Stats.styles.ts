import styled, { keyframes } from "styled-components";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: "Poppins", sans-serif;
`;

export const Container = styled.div`
  flex: 1;
  padding: 48px 52px;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 40px 32px;
  }

  @media (max-width: 768px) {
    padding: 72px 16px 24px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const PageTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
`;

export const PeriodSelect = styled.select`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #ff6b00;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const KpiCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border-left: 4px solid ${({ $color }) => $color};
  animation: ${fadeUp} 0.4s ease both;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: ${({ $color }) => $color}14;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const KpiIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color }) => $color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  i {
    font-size: 18px;
    color: ${({ $color }) => $color};
  }
`;

export const KpiValue = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1px;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const KpiLabel = styled.p`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

export const KpiSub = styled.p`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 6px;
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const SectionFull = styled(Section)`
  margin-bottom: 20px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
`;

export const SectionBadge = styled.span`
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 3px 10px;
  border-radius: 20px;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductRank = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #cbd5e1;
  width: 24px;
  flex-shrink: 0;
`;

export const ProductImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #f1f5f9;
  flex-shrink: 0;
`;

export const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProductName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

export const ProductMeta = styled.p`
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
`;

export const ProductStat = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

export const StatValue = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

export const StatLabel = styled.p`
  font-size: 11px;
  color: #94a3b8;
`;

export const ProgressBar = styled.div`
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  transition: width 0.6s ease;
`;

export const StatusGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const StatusItem = styled.div<{ $color: string }>`
  flex: 1;
  min-width: 100px;
  background: ${({ $color }) => $color}10;
  border: 1px solid ${({ $color }) => $color}25;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: center;

  @media (max-width: 480px) {
    min-width: 80px;
    padding: 10px 12px;
  }
`;

export const StatusCount = styled.p<{ $color: string }>`
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: ${({ $color }) => $color};
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const StatusName = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: capitalize;
`;

export const TrendGrid = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 80px;
  padding-top: 8px;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

export const TrendBar = styled.div<{ $pct: number; $color: string }>`
  flex: 1;
  height: ${({ $pct }) => Math.max($pct, 4)}%;
  background: ${({ $color }) => $color};
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  position: relative;
  cursor: pointer;

  &:hover::after {
    content: attr(data-tip);
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: white;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 10;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;

  i {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
    opacity: 0.4;
  }

  p {
    font-size: 13px;
  }
`;

export const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

export const ErrorMsg = styled.p`
  color: #dc2626;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 24px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 10px;
`;
