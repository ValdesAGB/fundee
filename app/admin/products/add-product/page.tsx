"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/admin/components/Sidebar";
import { Loader } from "../../components/dots/Loader";
import { handleAddProduct } from "./handleSubmit";
import {
  Wrapper,
  Container,
  Card,
  PageTitle,
  PageSubtitle,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  FieldSelect,
  Row,
  Column,
  PromoHeader,
  Toggle,
  NewCatLink,
  ImageTabs,
  ImageTab,
  ImagePreview,
  SubmitBtn,
  ErrorBox,
  SectionLabel,
  SuccessCard,
  SuccessIcon,
  SuccessTitle,
  SuccessText,
  AGBadge,
  DiscountBadge,
  FieldError,
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
  const [priceError, setPriceError] = useState("");
  const [compareAtPriceError, setCompareAtPriceError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setCategories(data.data || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  // ── Calcul du pourcentage de réduction ──
  const discountPercent = (() => {
    const price = parseFloat(formData.price);
    const compareAt = parseFloat(formData.compareAtPrice);
    if (!isPromo || !price || !compareAt || compareAt >= price) return null;
    return Math.round(((price - compareAt) / price) * 100);
  })();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ── Validation prix ──
    if (name === "price") {
      const val = parseFloat(value);
      if (value && val < 100) {
        setPriceError("Le prix minimum est de 100 FCFA.");
      } else {
        setPriceError("");
      }
    }

    // ── Validation prix de réduction ──
    if (name === "compareAtPrice") {
      const val = parseFloat(value);
      const price = parseFloat(formData.price);
      if (value && val < 100) {
        setCompareAtPriceError("Le prix de réduction minimum est de 100 FCFA.");
      } else if (value && price && val >= price) {
        setCompareAtPriceError(
          "Le prix de réduction doit être inférieur au prix de départ.",
        );
      } else {
        setCompareAtPriceError("");
      }
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    // Bloque si erreurs de validation
    if (priceError || compareAtPriceError) {
      e.preventDefault();
      return;
    }
    const price = parseFloat(formData.price);
    if (price < 100) {
      e.preventDefault();
      setError("Le prix minimum est de 100 FCFA.");
      return;
    }
    if (isPromo) {
      const compareAt = parseFloat(formData.compareAtPrice);
      if (!formData.compareAtPrice || compareAt < 100 || compareAt >= price) {
        e.preventDefault();
        setError("Prix de réduction invalide.");
        return;
      }
    }

    return handleAddProduct(e, {
      formData,
      isPromo,
      imageMode,
      imageFile,
      imageUrl,
      showNewCategory,
      newCategory,
      setError,
      setLoading,
      router,
      onSuccess: () => setSuccess(true),
    });
  };

  if (success) {
    return (
      <Wrapper className="row">
        <Sidebar />
        <Container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SuccessCard>
            <SuccessIcon>✅</SuccessIcon>
            <SuccessTitle>Produit ajouté avec succès !</SuccessTitle>
            <SuccessText>
              Votre produit a été créé et est maintenant disponible dans votre
              catalogue.
            </SuccessText>
            <SubmitBtn
              type="button"
              onClick={() => router.push("/admin/products")}
            >
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
          <PageSubtitle>
            Remplissez les informations de votre nouveau produit.
          </PageSubtitle>

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
              <FieldLabel>Prix (FCFA)</FieldLabel>
              <FieldInput
                type="number"
                name="price"
                value={formData.price}
                placeholder="Min. 100"
                onChange={handleChange}
                min={100}
                required
              />
              {priceError && <FieldError>{priceError}</FieldError>}
            </Column>

            <Column>
              <PromoHeader>
                <FieldLabel style={{ marginBottom: 0 }}>
                  Statut : {isPromo && "En promotion"}
                </FieldLabel>
                <Toggle
                  type="button"
                  onClick={() => {
                    setIsPromo(!isPromo);
                    setCompareAtPriceError("");
                  }}
                  $active={isPromo}
                >
                  {isPromo ? "Désactiver" : "Activer"}
                </Toggle>
              </PromoHeader>

              {isPromo ? (
                <>
                  <FieldInput
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    placeholder={`Max. ${parseFloat(formData.price) - 1 || "prix - 1"} FCFA`}
                    min={100}
                    max={parseFloat(formData.price) - 1 || undefined}
                  />
                  {compareAtPriceError && (
                    <FieldError>{compareAtPriceError}</FieldError>
                  )}
                  {discountPercent !== null && (
                    <DiscountBadge>
                      ↓ {discountPercent}% de réduction
                    </DiscountBadge>
                  )}
                </>
              ) : (
                <AGBadge>Anti-gaspi (A-G)</AGBadge>
              )}
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
            <FieldInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          ) : (
            <FieldInput
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          )}

          {imagePreview && <ImagePreview src={imagePreview} alt="Aperçu" />}

          <SubmitBtn
            disabled={loading || !!priceError || !!compareAtPriceError}
          >
            {loading ? <Loader /> : "Ajouter le produit"}
          </SubmitBtn>
        </Card>
      </Container>
    </Wrapper>
  );
}
