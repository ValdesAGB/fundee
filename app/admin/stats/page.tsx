"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import {
  Wrapper,
  Container,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PeriodSelect,
  KpiGrid,
  KpiCard,
  KpiIcon,
  KpiValue,
  KpiLabel,
  KpiSub,
  SectionGrid,
  Section,
  SectionFull,
  SectionHeader,
  SectionTitle,
  SectionBadge,
  ProductList,
  ProductRow,
  ProductRank,
  ProductImg,
  ProductInfo,
  ProductName,
  ProductMeta,
  ProductStat,
  StatValue,
  StatLabel,
  ProgressBar,
  ProgressFill,
  StatusGrid,
  StatusItem,
  StatusCount,
  StatusName,
  TrendGrid,
  TrendBar,
  EmptyState,
  Skeleton,
  ErrorMsg,
} from "./Stats.styles";

/* ── Types ── */
interface TopProduct {
  id: string;
  name: string;
  images: string[];
  price: number;
  totalSold: number;
  revenue: number;
}

interface CategoryDist {
  categoryId: string;
  name: string;
  count: number;
}

interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

interface StatsData {
  period: number;
  generatedAt: string;
  overview: {
    products: { total: number; active: number; newInPeriod: number };
    orders: { total: number; inPeriod: number };
    revenue: { allTime: number; inPeriod: number; averageOrderValue: number };
  };
  ordersByStatus: Record<string, number>;
  revenueTrend: RevenueTrend[];
  topProducts: TopProduct[];
  categoryDistribution: CategoryDist[];
}

/* ── Status colors ── */
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#6366f1",
  processing: "#8b5cf6",
  shipped: "#0ea5e9",
  delivered: "#016232",
  cancelled: "#dc2626",
  refunded: "#64748b",
};

/* ── KPI config ── */
const KPI_CONFIG = [
  { key: "products", label: "Produits", icon: "bi-box-seam", color: "#0ea5e9" },
  { key: "orders", label: "Commandes", icon: "bi-bag-check", color: "#ff6b00" },
  { key: "revenue", label: "Revenus", icon: "bi-cash-stack", color: "#016232" },
  { key: "aov", label: "Panier moyen", icon: "bi-graph-up", color: "#f59e0b" },
];

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/v1/business/stats?period=${period}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur chargement stats");
        setStats(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  const getKpiValue = (key: string): string => {
    if (!stats) return "—";
    const { overview } = stats;
    switch (key) {
      case "products":
        return overview.products.total.toLocaleString();
      case "orders":
        return overview.orders.total.toLocaleString();
      case "revenue":
        return `$${overview.revenue.allTime.toLocaleString()}`;
      case "aov":
        return `$${overview.revenue.averageOrderValue.toFixed(2)}`;
      default:
        return "—";
    }
  };

  const getKpiSub = (key: string): string => {
    if (!stats) return "";
    const { overview } = stats;
    switch (key) {
      case "products":
        return `${overview.products.active} actifs · +${overview.products.newInPeriod} nouveau`;
      case "orders":
        return `${overview.orders.inPeriod} cette période`;
      case "revenue":
        return `$${overview.revenue.inPeriod.toLocaleString()} cette période`;
      case "aov":
        return "valeur moyenne par commande";
      default:
        return "";
    }
  };

  const maxTrend = stats?.revenueTrend.length
    ? Math.max(...stats.revenueTrend.map((t) => t.revenue), 1)
    : 1;

  return (
    <Wrapper className="row">
      <Sidebar />

      <Container>
        <PageHeader>
          <div>
            <PageTitle>Statistiques</PageTitle>
            <PageSubtitle>
              {stats
                ? `Données au ${new Date(stats.generatedAt).toLocaleDateString("fr-FR")} — période : ${stats.period} jours`
                : "Analysez les performances de vos produits."}
            </PageSubtitle>
          </div>

          <PeriodSelect
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>90 derniers jours</option>
            <option value={365}>365 derniers jours</option>
          </PeriodSelect>
        </PageHeader>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {/* ── KPI Cards ── */}
        <KpiGrid>
          {KPI_CONFIG.map((kpi, i) => (
            <KpiCard
              key={kpi.key}
              $color={kpi.color}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <KpiIcon $color={kpi.color}>
                <i className={`bi ${kpi.icon}`} />
              </KpiIcon>
              <KpiValue>{loading ? "—" : getKpiValue(kpi.key)}</KpiValue>
              <KpiLabel>{kpi.label}</KpiLabel>
              {!loading && stats && <KpiSub>{getKpiSub(kpi.key)}</KpiSub>}
            </KpiCard>
          ))}
        </KpiGrid>

        {/* ── Tendance revenus ── */}
        <SectionFull>
          <SectionHeader>
            <SectionTitle>Tendance des revenus</SectionTitle>
            <SectionBadge>Jour par jour</SectionBadge>
          </SectionHeader>

          {loading ? (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                height: 80,
              }}
            >
              {Array(20)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    style={{ flex: 1, height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
            </div>
          ) : !stats || stats.revenueTrend.length === 0 ? (
            <EmptyState>
              <i className="bi bi-graph-up" />
              <p>Aucune donnée de tendance disponible</p>
            </EmptyState>
          ) : (
            <TrendGrid>
              {stats.revenueTrend.map((t) => (
                <TrendBar
                  key={t.date}
                  $pct={(t.revenue / maxTrend) * 100}
                  $color="#ff6b00"
                  data-tip={`${t.date} · $${t.revenue} · ${t.orders} cmd`}
                />
              ))}
            </TrendGrid>
          )}
        </SectionFull>

        {/* ── Commandes par statut ── */}
        <SectionFull>
          <SectionHeader>
            <SectionTitle>Commandes par statut</SectionTitle>
            <SectionBadge>Cette période</SectionBadge>
          </SectionHeader>

          {loading ? (
            <div style={{ display: "flex", gap: 12 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  style={{ flex: 1, height: 72, borderRadius: 12 }}
                />
              ))}
            </div>
          ) : !stats || Object.keys(stats.ordersByStatus).length === 0 ? (
            <EmptyState>
              <i className="bi bi-bag" />
              <p>Aucune commande sur cette période</p>
            </EmptyState>
          ) : (
            <StatusGrid>
              {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const color = STATUS_COLORS[status] || "#94a3b8";
                return (
                  <StatusItem key={status} $color={color}>
                    <StatusCount $color={color}>{count}</StatusCount>
                    <StatusName>{status}</StatusName>
                  </StatusItem>
                );
              })}
            </StatusGrid>
          )}
        </SectionFull>

        {/* ── Top produits ── */}
        <SectionGrid>
          {/* Par ventes */}
          <Section>
            <SectionHeader>
              <SectionTitle>Top produits</SectionTitle>
              <SectionBadge>Par ventes</SectionBadge>
            </SectionHeader>

            {loading ? (
              <ProductList>
                {[1, 2, 3].map((i) => (
                  <ProductRow key={i}>
                    <Skeleton style={{ width: 20, height: 16 }} />
                    <Skeleton
                      style={{ width: 44, height: 44, borderRadius: 10 }}
                    />
                    <div style={{ flex: 1 }}>
                      <Skeleton style={{ height: 14, marginBottom: 6 }} />
                      <Skeleton style={{ height: 10, width: "60%" }} />
                    </div>
                  </ProductRow>
                ))}
              </ProductList>
            ) : !stats || stats.topProducts.length === 0 ? (
              <EmptyState>
                <i className="bi bi-bar-chart" />
                <p>Aucune donnée disponible</p>
              </EmptyState>
            ) : (
              <ProductList>
                {stats.topProducts.map((p, i) => {
                  const max = stats.topProducts[0].totalSold;
                  return (
                    <ProductRow key={p.id}>
                      <ProductRank>#{i + 1}</ProductRank>
                      <ProductImg
                        src={p.images?.[0] || "https://via.placeholder.com/44"}
                        alt={p.name}
                      />
                      <ProductInfo>
                        <ProductName>{p.name}</ProductName>
                        <ProductMeta>${p.price}</ProductMeta>
                        <ProgressBar>
                          <ProgressFill
                            $pct={max > 0 ? (p.totalSold / max) * 100 : 0}
                            $color="#ff6b00"
                          />
                        </ProgressBar>
                      </ProductInfo>
                      <ProductStat>
                        <StatValue>{p.totalSold}</StatValue>
                        <StatLabel>vendus</StatLabel>
                      </ProductStat>
                    </ProductRow>
                  );
                })}
              </ProductList>
            )}
          </Section>

          {/* Par revenus */}
          <Section>
            <SectionHeader>
              <SectionTitle>Revenus par produit</SectionTitle>
              <SectionBadge>Top 5</SectionBadge>
            </SectionHeader>

            {loading ? (
              <ProductList>
                {[1, 2, 3].map((i) => (
                  <ProductRow key={i}>
                    <Skeleton style={{ width: 20, height: 16 }} />
                    <Skeleton
                      style={{ width: 44, height: 44, borderRadius: 10 }}
                    />
                    <div style={{ flex: 1 }}>
                      <Skeleton style={{ height: 14, marginBottom: 6 }} />
                      <Skeleton style={{ height: 10, width: "40%" }} />
                    </div>
                    <Skeleton style={{ width: 60, height: 20 }} />
                  </ProductRow>
                ))}
              </ProductList>
            ) : !stats || stats.topProducts.length === 0 ? (
              <EmptyState>
                <i className="bi bi-cash-stack" />
                <p>Aucune donnée de revenus disponible</p>
              </EmptyState>
            ) : (
              <ProductList>
                {stats.topProducts.map((p, i) => {
                  const max = stats.topProducts[0].revenue;
                  return (
                    <ProductRow key={p.id}>
                      <ProductRank>#{i + 1}</ProductRank>
                      <ProductImg
                        src={p.images?.[0] || "https://via.placeholder.com/44"}
                        alt={p.name}
                      />
                      <ProductInfo>
                        <ProductName>{p.name}</ProductName>
                        <ProductMeta>
                          ${p.price} × {p.totalSold} vendus
                        </ProductMeta>
                        <ProgressBar>
                          <ProgressFill
                            $pct={max > 0 ? (p.revenue / max) * 100 : 0}
                            $color="#016232"
                          />
                        </ProgressBar>
                      </ProductInfo>
                      <ProductStat>
                        <StatValue>${p.revenue.toLocaleString()}</StatValue>
                        <StatLabel>revenus</StatLabel>
                      </ProductStat>
                    </ProductRow>
                  );
                })}
              </ProductList>
            )}
          </Section>
        </SectionGrid>

        {/* ── Distribution catégories ── */}
        <SectionFull>
          <SectionHeader>
            <SectionTitle>Distribution par catégorie</SectionTitle>
            <SectionBadge>Produits actifs</SectionBadge>
          </SectionHeader>

          {loading ? (
            <ProductList>
              {[1, 2, 3].map((i) => (
                <ProductRow key={i}>
                  <Skeleton style={{ width: 20, height: 16 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton style={{ height: 14, marginBottom: 6 }} />
                    <Skeleton style={{ height: 8, width: "50%" }} />
                  </div>
                  <Skeleton style={{ width: 40, height: 20 }} />
                </ProductRow>
              ))}
            </ProductList>
          ) : !stats || stats.categoryDistribution.length === 0 ? (
            <EmptyState>
              <i className="bi bi-tags" />
              <p>Aucune catégorie disponible</p>
            </EmptyState>
          ) : (
            <ProductList>
              {stats.categoryDistribution.map((cat, i) => {
                const max = stats.categoryDistribution[0].count;
                return (
                  <ProductRow key={cat.categoryId}>
                    <ProductRank>#{i + 1}</ProductRank>
                    <ProductInfo>
                      <ProductName>{cat.name || "Sans catégorie"}</ProductName>
                      <ProgressBar>
                        <ProgressFill
                          $pct={max > 0 ? (cat.count / max) * 100 : 0}
                          $color="#f59e0b"
                        />
                      </ProgressBar>
                    </ProductInfo>
                    <ProductStat>
                      <StatValue>{cat.count}</StatValue>
                      <StatLabel>produits</StatLabel>
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
