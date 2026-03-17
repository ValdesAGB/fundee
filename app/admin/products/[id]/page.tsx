"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import { Loader } from "../../components/dots/Loader";
import {
  Wrapper, Container, BackLink, Card,
  ImageBlock, ProductImage, Content,
  CategoryBadge, Title, Description,
  InfoGrid, InfoCard, InfoLabel, InfoValue,
  PromoStatus, DateRow, DateItem, DateLabel, DateValue,
  Actions, EditButton, DeleteButton,
} from "./DetailsProduct.styled";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔌 Fetch produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/business/products/${params.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur récupération produit");
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  // 🔌 Suppression
  const handleDelete = async () => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/v1/business/products/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur suppression produit");
      }
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  if (loading) return (
    <Wrapper className="row">
      <Sidebar />
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </Container>
    </Wrapper>
  );

  if (error || !product) return (
    <Wrapper className="row">
      <Sidebar />
      <Container>
        <p style={{ color: "#dc2626", fontFamily: "Poppins, sans-serif" }}>
          {error || "Produit introuvable"}
        </p>
      </Container>
    </Wrapper>
  );

  return (
    <Wrapper className="row">
      <Sidebar />

      <Container>
        <BackLink href="/admin/products">
          <i className="bi bi-arrow-left" />
          Retour aux produits
        </BackLink>

        <Card>
          <ImageBlock>
            <ProductImage
              src={product.images?.[0] || "https://via.placeholder.com/320"}
              alt={product.name}
            />
          </ImageBlock>

          <Content>
            <CategoryBadge>
              {product.category?.name || product.categoryId || "Sans catégorie"}
            </CategoryBadge>

            <Title>{product.name}</Title>

            <Description>{product.description}</Description>

            <InfoGrid>
              <InfoCard>
                <InfoLabel>Prix</InfoLabel>
                <InfoValue>${product.price}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>Prix promo</InfoLabel>
                <InfoValue>
                  {product.compareAtPrice ? `$${product.compareAtPrice}` : "—"}
                </InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>Stock</InfoLabel>
                <InfoValue>{product.stock}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>Promotion</InfoLabel>
                <InfoValue>
                  <PromoStatus $active={!!product.compareAtPrice}>
                    {product.compareAtPrice ? "En promo" : "Normal"}
                  </PromoStatus>
                </InfoValue>
              </InfoCard>
            </InfoGrid>

            <DateRow>
              <DateItem>
                <DateLabel>Créé le</DateLabel>
                <DateValue>{formatDate(product.createdAt)}</DateValue>
              </DateItem>
              <DateItem>
                <DateLabel>Modifié le</DateLabel>
                <DateValue>{formatDate(product.updatedAt)}</DateValue>
              </DateItem>
            </DateRow>

            <Actions>
              <EditButton href={`/admin/products/edit/${product.id}`}>
                <i className="bi bi-pencil" />
                Modifier
              </EditButton>
              <DeleteButton onClick={handleDelete}>
                <i className="bi bi-trash3" />
                Supprimer
              </DeleteButton>
            </Actions>
          </Content>
        </Card>
      </Container>
    </Wrapper>
  );
}