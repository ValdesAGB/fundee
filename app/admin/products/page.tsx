"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/app/admin/components/Sidebar";
import { Loader } from "../components/dots/Loader";
import FirstProduct from "../components/FirstProduct";
import {
  Wrapper, Container, Header, TitleBlock, Title, Subtitle,
  Select, Table, Img, ProductName, CategoryBadge, Status,
  Actions, View, Editing, Delete, FloatingButton, EmptyCell,
} from "./Products.styled";

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  categoryId?: string;
  category?: { name: string };
  images?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/business/products", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const list: Product[] = data.data || [];
        setProducts(list);

        // Extraire les catégories uniques pour le filtre
        const uniqueCategories = Array.from(
          new Set(
            list
              .map((p) => p.category?.name || p.categoryId)
              .filter(Boolean) as string[]
          )
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Erreur fetch produits →", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm("Supprimer ce produit ?")) return;

    try {
      const res = await fetch(`/api/v1/business/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur suppression");

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Erreur suppression →", err);
    }
  };

  const filteredProducts =
    categoryFilter === "all"
      ? products
      : products.filter(
          (p) =>
            p.categoryId === categoryFilter ||
            p.category?.name?.toLowerCase() === categoryFilter.toLowerCase()
        );

  return (
    <Wrapper className='row'>
      <Sidebar />

      <Container>
        <Header>
          <TitleBlock>
            <Title>Tous vos produits</Title>
            <Subtitle>{products.length} produit{products.length !== 1 ? "s" : ""} au total</Subtitle>
          </TitleBlock>

          <Select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </Select>
        </Header>

        {loading ? (
          <Loader />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Prix Promo</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <EmptyCell colSpan={8}>
                    <FirstProduct />
                  </EmptyCell>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Img
                        src={product.images?.[0] || "https://via.placeholder.com/52"}
                        alt={product.name}
                      />
                    </td>

                    <td>
                      <ProductName>{product.name}</ProductName>
                    </td>

                    <td>
                      <CategoryBadge>
                        {product.category?.name || product.categoryId || "-"}
                      </CategoryBadge>
                    </td>

                    <td>${product.price}</td>

                    <td>
                      {product.compareAtPrice ? `$${product.compareAtPrice}` : "-"}
                    </td>

                    <td>{product.stock}</td>

                    <td>
                      <Status $active={!!product.compareAtPrice}>
                        {product.compareAtPrice ? "Promo" : "Normal"}
                      </Status>
                    </td>

                    <td>
                      <Actions>
                        <View href={`/admin/products/${product.id}`}>
                          <i className="bi bi-eye" />
                        </View>
                        <Editing href={`/admin/products/edit/${product.id}`}>
                          <i className="bi bi-pencil" />
                        </Editing>
                        <Delete onClick={() => handleDelete(product.id)}>
                          <i className="bi bi-trash3" />
                        </Delete>
                      </Actions>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        <Link href="/admin/products/add-product">
          <FloatingButton>
            <i className="bi bi-plus-lg" />
            Nouveau Produit
          </FloatingButton>
        </Link>
      </Container>
    </Wrapper>
  );
}