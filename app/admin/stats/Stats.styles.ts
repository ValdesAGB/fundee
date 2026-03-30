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
  font-family: 'Poppins', sans-serif;
`;

export const Container = styled.div`
  flex: 1;
  padding: 48px 52px;
  overflow-x: hidden;
`;

export const PageHeader = styled.div`
  margin-bottom: 36px;
`;

export const PageTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin-bottom: 4px;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
`;

/* ── KPI Cards ── */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const KpiCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border-left: 4px solid ${({ $color }) => $color};
  animation: ${fadeUp} 0.4s ease both;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: ${({ $color }) => $color}18;
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
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1px;
  margin-bottom: 2px;
`;

export const KpiLabel = styled.p`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

export const KpiTrend = styled.span<{ $up: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $up }) => ($up ? "#16a34a" : "#dc2626")};
  background: ${({ $up }) => ($up ? "#f0fdf4" : "#fef2f2")};
  padding: 2px 8px;
  border-radius: 20px;
  margin-top: 6px;
  display: inline-block;
`;

/* ── Section ── */
export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
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
  font-family: 'Montserrat', sans-serif;
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

/* ── Product Row ── */
export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

export const ProductRank = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #cbd5e1;
  width: 20px;
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
`;

export const ProductStat = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

export const StatValue = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

export const StatLabel = styled.p`
  font-size: 11px;
  color: #94a3b8;
`;

/* ── Progress bar ── */
export const ProgressBar = styled.div`
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  transition: width 0.6s ease;
`;

/* ── Rating stars ── */
export const Stars = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`;

export const Star = styled.i<{ $filled: boolean }>`
  font-size: 11px;
  color: ${({ $filled }) => ($filled ? "#f59e0b" : "#e2e8f0")};
`;

/* ── Empty state ── */
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

/* ── Loading skeleton ── */
export const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;