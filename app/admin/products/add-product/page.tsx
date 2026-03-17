"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/admin/components/Sidebar";
import { Loader } from "../../components/dots/Loader";
import { handleAddProduct } from "./handleSubmit";
import {
  Wrapper, Container, Card, PageTitle, PageSubtitle,
  FieldLabel, FieldInput, FieldTextarea, FieldSelect,
  Row, Column, PromoHeader, Toggle, NewCatLink,
  ImageTabs, ImageTab, ImagePreview, SubmitBtn,
  ErrorBox, SectionLabel, SuccessCard, SuccessIcon,
  SuccessTitle, SuccessText,
} from "./AddProduct.styles";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    stock: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isPromo, setIsPromo] = useState(false);
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories", { credentials: "include" });
        const data = await res.json();
        if (res.ok) setCategories(data.data || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) =>
    handleAddProduct(e, {
      formData, isPromo, imageMode, imageFile, imageUrl,
      showNewCategory, newCategory, setError, setLoading, router,
      onSuccess: () => setSuccess(true),
    });

  if (success) {
    return (
      <Wrapper className="row">
        <Sidebar />
        <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SuccessCard>
            <SuccessIcon>✅</SuccessIcon>
            <SuccessTitle>Produit ajouté avec succès !</SuccessTitle>
            <SuccessText>
              Votre produit a été créé et est maintenant disponible dans votre catalogue.
            </SuccessText>
            <SubmitBtn type="button" onClick={() => router.push("/admin/products")}>
              OK
            </SubmitBtn>
          </SuccessCard>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="row">
      <Sidebar />
      <Container>
        <Card onSubmit={handleSubmit}>
          <PageTitle>Ajouter un produit</PageTitle>
          <PageSubtitle>Remplissez les informations de votre nouveau produit.</PageSubtitle>

          {error && <ErrorBox>{error}</ErrorBox>}

          <FieldLabel>Nom du produit</FieldLabel>
          <FieldInput
            name="name"
            value={formData.name}
            placeholder="Ex: Burger Deluxe"
            onChange={handleChange}
            required
          />

          <FieldLabel>Description</FieldLabel>
          <FieldTextarea
            name="description"
            value={formData.description}
            placeholder="Décrivez votre produit..."
            onChange={handleChange}
            required
          />

          <Row>
            <Column>
              <FieldLabel>Prix</FieldLabel>
              <FieldInput
                type="number"
                name="price"
                value={formData.price}
                placeholder="0.00"
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <PromoHeader>
                <FieldLabel style={{ marginBottom: 0 }}>Prix promotion</FieldLabel>
                <Toggle
                  type="button"
                  onClick={() => setIsPromo(!isPromo)}
                  $active={isPromo}
                >
                  {isPromo ? "✓ En promo" : "Activer"}
                </Toggle>
              </PromoHeader>
              <FieldInput
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                disabled={!isPromo}
                placeholder={isPromo ? "Prix barré" : "—"}
                style={{ opacity: isPromo ? 1 : 0.4 }}
              />
            </Column>
          </Row>

          <Row>
            <Column>
              <FieldLabel>Catégorie</FieldLabel>
              {!showNewCategory ? (
                <FieldSelect
                  name="categoryId"
                  onChange={handleChange}
                  required={!showNewCategory}
                  value={formData.categoryId}
                >
                  <option value="">Sélectionner</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </FieldSelect>
              ) : (
                <FieldInput
                  name="newCategory"
                  placeholder="Nom de la nouvelle catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required={showNewCategory}
                />
              )}
              <NewCatLink
                onClick={(e) => {
                  e.preventDefault();
                  setShowNewCategory(!showNewCategory);
                  setNewCategory("");
                }}
              >
                {showNewCategory
                  ? "← Choisir une catégorie existante"
                  : "+ Créer une nouvelle catégorie"}
              </NewCatLink>
            </Column>
            <Column>
              <FieldLabel>Stock</FieldLabel>
              <FieldInput
                type="number"
                name="stock"
                value={formData.stock}
                placeholder="0"
                onChange={handleChange}
                required
              />
            </Column>
          </Row>

          <SectionLabel>Image produit</SectionLabel>
          <ImageTabs>
            <ImageTab
              type="button"
              $active={imageMode === "file"}
              onClick={() => setImageMode("file")}
            >
              📁 Depuis mon appareil
            </ImageTab>
            <ImageTab
              type="button"
              $active={imageMode === "url"}
              onClick={() => setImageMode("url")}
            >
              🔗 Depuis une URL
            </ImageTab>
          </ImageTabs>

          {imageMode === "file" ? (
            <FieldInput type="file" accept="image/*" onChange={handleFileChange} />
          ) : (
            <FieldInput
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          )}

          {imagePreview && <ImagePreview src={imagePreview} alt="Aperçu" />}

          <SubmitBtn disabled={loading}>
            {loading ? <Loader /> : "Ajouter le produit"}
          </SubmitBtn>
        </Card>
      </Container>
    </Wrapper>
  );
}