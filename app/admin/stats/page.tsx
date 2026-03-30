"use client";

import { useState } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import {
  Wrapper, Container, PageHeader, PageTitle, PageSubtitle,
  KpiGrid, KpiCard, KpiIcon, KpiValue, KpiLabel, KpiTrend,
  SectionGrid, Section, SectionFull, SectionHeader, SectionTitle, SectionBadge,
  ProductList, ProductRow, ProductRank, ProductImg, ProductInfo,
  ProductName, ProductMeta, ProductStat, StatValue, StatLabel,
  ProgressBar, ProgressFill, Stars, Star, EmptyState, Skeleton,
} from "./Stats.styles";

// ── Types ──
interface ProductStat {
  id: string;
  name: string;
  image?: string;
  categoryId?: string;
  viewCount: number;
  orderCount: number;
  reviewCount: number;
  favoriteCount: number;
  averageRating: number;
  price: number;
}

interface StatsData {
  totalViews: number;
  totalOrders: number;
  totalReviews: number;
  totalRevenue: number;
  mostViewed: ProductStat[];
  mostOrdered: ProductStat[];
  mostReviewed: ProductStat[];
  topRated: ProductStat[];
}

// ── Dummy data (remplacer par vraies données) ──
const DUMMY_STATS: StatsData = {
  totalViews: 0,
  totalOrders: 0,
  totalReviews: 0,
  totalRevenue: 0,
  mostViewed: [],
  mostOrdered: [],
  mostReviewed: [],
  topRated: [],
};

const KPI_CONFIG = [
  { key: "totalViews", label: "Vues totales", icon: "bi-eye", color: "#6366f1" },
  { key: "totalOrders", label: "Commandes", icon: "bi-bag-check", color: "#ff6b00" },
  { key: "totalReviews", label: "Avis", icon: "bi-star", color: "#f59e0b" },
  { key: "totalRevenue", label: "Revenus", icon: "bi-cash-stack", color: "#016232", prefix: "$" },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="bi bi-star-fill" $filled={i <= Math.round(rating)} />
      ))}
    </Stars>
  );
}

function ProductListSection({
  title,
  badge,
  products,
  statKey,
  statLabel,
  color,
  loading,
}: {
  title: string;
  badge: string;
  products: ProductStat[];
  statKey: keyof ProductStat;
  statLabel: string;
  color: string;
  loading: boolean;
}) {
  const max = products.length > 0 ? Number(products[0][statKey]) : 1;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <SectionBadge>{badge}</SectionBadge>
      </SectionHeader>

      {loading ? (
        <ProductList>
          {[1, 2, 3].map((i) => (
            <ProductRow key={i}>
              <Skeleton style={{ width: 20, height: 16 }} />
              <Skeleton style={{ width: 44, height: 44, borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ height: 14, marginBottom: 6 }} />
                <Skeleton style={{ height: 10, width: "60%" }} />
              </div>
            </ProductRow>
          ))}
        </ProductList>
      ) : products.length === 0 ? (
        <EmptyState>
          <i className="bi bi-bar-chart" />
          <p>Aucune donnée disponible</p>
        </EmptyState>
      ) : (
        <ProductList>
          {products.map((product, index) => (
            <ProductRow key={product.id}>
              <ProductRank>#{index + 1}</ProductRank>
              <ProductImg
                src={product.image || "https://via.placeholder.com/44"}
                alt={product.name}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductMeta>{product.categoryId || "—"}</ProductMeta>
                <ProgressBar>
                  <ProgressFill
                    $pct={max > 0 ? (Number(product[statKey]) / max) * 100 : 0}
                    $color={color}
                  />
                </ProgressBar>
              </ProductInfo>
              <ProductStat>
                <StatValue>{String(product[statKey])}</StatValue>
                <StatLabel>{statLabel}</StatLabel>
              </ProductStat>
            </ProductRow>
          ))}
        </ProductList>
      )}
    </Section>
  );
}

export default function StatsPage() {
  const [stats] = useState<StatsData>(DUMMY_STATS);
  const [loading] = useState(false);

  // 🔌 Brancher le fetch des stats ici

  return (
    <Wrapper className="row">
      <Sidebar />

      <Container>
        <PageHeader>
          <PageTitle>Statistiques</PageTitle>
          <PageSubtitle>Analysez les performances de vos produits.</PageSubtitle>
        </PageHeader>

        {/* ── KPI Cards ── */}
        <KpiGrid>
          {KPI_CONFIG.map((kpi, i) => (
            <KpiCard key={kpi.key} $color={kpi.color} style={{ animationDelay: `${i * 0.08}s` }}>
              <KpiIcon $color={kpi.color}>
                <i className={`bi ${kpi.icon}`} />
              </KpiIcon>
              <KpiValue>
                {kpi.prefix || ""}{loading ? "—" : String(stats[kpi.key as keyof StatsData] ?? 0)}
              </KpiValue>
              <KpiLabel>{kpi.label}</KpiLabel>
            </KpiCard>
          ))}
        </KpiGrid>

        {/* ── Top produits ── */}
        <SectionGrid>
          <ProductListSection
            title="Plus vus"
            badge="Top vues"
            products={stats.mostViewed}
            statKey="viewCount"
            statLabel="vues"
            color="#6366f1"
            loading={loading}
          />
          <ProductListSection
            title="Plus commandés"
            badge="Top ventes"
            products={stats.mostOrdered}
            statKey="orderCount"
            statLabel="commandes"
            color="#ff6b00"
            loading={loading}
          />
        </SectionGrid>

        <SectionGrid>
          <ProductListSection
            title="Plus appréciés"
            badge="Top avis"
            products={stats.mostReviewed}
            statKey="reviewCount"
            statLabel="avis"
            color="#f59e0b"
            loading={loading}
          />
          <ProductListSection
            title="Mieux notés"
            badge="Top notes"
            products={stats.topRated}
            statKey="averageRating"
            statLabel="/ 5"
            color="#016232"
            loading={loading}
          />
        </SectionGrid>

        {/* ── Revenus par produit ── */}
        <SectionFull>
          <SectionHeader>
            <SectionTitle>Revenus par produit</SectionTitle>
            <SectionBadge>Top revenus</SectionBadge>
          </SectionHeader>

          {loading ? (
            <ProductList>
              {[1, 2, 3, 4].map((i) => (
                <ProductRow key={i}>
                  <Skeleton style={{ width: 20, height: 16 }} />
                  <Skeleton style={{ width: 44, height: 44, borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton style={{ height: 14, marginBottom: 6 }} />
                    <Skeleton style={{ height: 10, width: "40%" }} />
                  </div>
                  <Skeleton style={{ width: 60, height: 20 }} />
                </ProductRow>
              ))}
            </ProductList>
          ) : stats.mostOrdered.length === 0 ? (
            <EmptyState>
              <i className="bi bi-cash-stack" />
              <p>Aucune donnée de revenus disponible</p>
            </EmptyState>
          ) : (
            <ProductList>
              {stats.mostOrdered.map((product, index) => {
                const revenue = product.orderCount * product.price;
                const maxRevenue = stats.mostOrdered[0].orderCount * stats.mostOrdered[0].price;
                return (
                  <ProductRow key={product.id}>
                    <ProductRank>#{index + 1}</ProductRank>
                    <ProductImg
                      src={product.image || "https://via.placeholder.com/44"}
                      alt={product.name}
                    />
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductMeta>${product.price} × {product.orderCount} commandes</ProductMeta>
                      <ProgressBar>
                        <ProgressFill
                          $pct={maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0}
                          $color="#016232"
                        />
                      </ProgressBar>
                    </ProductInfo>
                    <ProductStat>
                      <StatValue>${revenue.toLocaleString()}</StatValue>
                      <StatLabel>revenus</StatLabel>
                    </ProductStat>
                  </ProductRow>
                );
              })}
            </ProductList>
          )}
        </SectionFull>
      </Container>
    </Wrapper>
  );
}