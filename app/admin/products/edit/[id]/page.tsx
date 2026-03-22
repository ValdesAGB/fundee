"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/admin/components/Sidebar";
import { Loader } from "@/app/admin/components/dots/Loader";

import {
  Wrapper, Container, BackLink, Card, PageTitle, PageSubtitle,
  FieldLabel, FieldInput, FieldTextarea, FieldSelect,
  Row, Column, PromoHeader, Toggle, NewCatLink,
  ImageTabs, ImageTab, ImagePreview, SubmitBtn,
  ErrorBox, SectionLabel, SuccessCard, SuccessIcon,
  SuccessTitle, SuccessText,
} from "./Edit.styles";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPromo, setIsPromo] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/business/products/${params.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur récupération produit");

        const product = data.data;
        setFormData(product);

        if (product.compareAtPrice && product.compareAtPrice > 0) setIsPromo(true);

        if (product.images?.[0]) {
          setImagePreview(product.images[0]);
          if (product.images[0].startsWith("http")) {
            setImageMode("url");
            setImageUrl(product.images[0]);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (!formData || categories.length === 0) return;
    const knownIds = categories.map((c) => c.id);
    if (formData.categoryId && !knownIds.includes(formData.categoryId)) {
      setShowNewCategory(true);
      setNewCategory(formData.categoryId);
    }
  }, [formData, categories]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // ── Image ──
      let imagePayload: string[] = [];

      if (imageMode === "file" && imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await fetch("/api/v1/upload", {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Erreur upload image");
        imagePayload = [uploadData.url];
      } else if (imageMode === "url" && imageUrl.trim()) {
        imagePayload = [imageUrl.trim()];
      } else if (formData.images?.[0]) {
        imagePayload = [formData.images[0]];
      }

      // ── Catégorie ──
      let categoryId = formData.categoryId;

      if (showNewCategory && newCategory.trim()) {
        const catRes = await fetch("/api/v1/categories", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) throw new Error(catData.message || "Erreur création catégorie");
        categoryId = catData.data.id;
      }

      // ── Body ──
      const body = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryId,
        images: imagePayload,
        ...(isPromo && formData.compareAtPrice
          ? { compareAtPrice: parseFloat(formData.compareAtPrice) }
          : { compareAtPrice: null }),
      };

      const res = await fetch(`/api/v1/business/products/${params.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur mise à jour produit");

      setSuccess(true); // ✅ remplace router.push
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Wrapper className="row">
      <Sidebar />
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </Container>
    </Wrapper>
  );

  if (error && !formData) return (
    <Wrapper className="row">
      <Sidebar />
      <Container>
        <p style={{ color: "#dc2626" }}>{error}</p>
      </Container>
    </Wrapper>
  );

  if (!formData) return null;

  if (success) return (
    <Wrapper className="row">
      <Sidebar />
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SuccessCard>
          <SuccessIcon>✅</SuccessIcon>
          <SuccessTitle>Produit modifié avec succès !</SuccessTitle>
          <SuccessText>
            Les modifications ont bien été enregistrées.
          </SuccessText>
          <SubmitBtn type="button" onClick={() => router.push(`/admin/products/${params.id}`)}>
            OK
          </SubmitBtn>
        </SuccessCard>
      </Container>
    </Wrapper>
  );

  return (
    <Wrapper className="row">
      <Sidebar />

      <Container>
        <BackLink href={`/admin/products/${params.id}`}>
          <i className="bi bi-arrow-left" />
          Retour au produit
        </BackLink>

        <Card onSubmit={handleSubmit}>
          <PageTitle>Modifier le produit</PageTitle>
          <PageSubtitle>Mettez à jour les informations de votre produit.</PageSubtitle>

          {error && <ErrorBox>{error}</ErrorBox>}

          <FieldLabel>Nom du produit</FieldLabel>
          <FieldInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FieldLabel>Description</FieldLabel>
          <FieldTextarea
            name="description"
            value={formData.description}
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
                onChange={handleChange}
                required
              />
            </Column>
            <Column>
              <PromoHeader>
                <FieldLabel style={{ marginBottom: 0 }}>Prix promotion</FieldLabel>
                <Toggle type="button" onClick={() => setIsPromo(!isPromo)} $active={isPromo}>
                  {isPromo ? "✓ En promo" : "Activer"}
                </Toggle>
              </PromoHeader>
              <FieldInput
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice || ""}
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
                  value={formData.categoryId || ""}
                  onChange={handleChange}
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
                />
              )}
              <NewCatLink
                onClick={(e) => {
                  e.preventDefault();
                  setShowNewCategory(!showNewCategory);
                  setNewCategory("");
                }}
              >
                {showNewCategory ? "← Choisir une catégorie existante" : "+ Créer une nouvelle catégorie"}
              </NewCatLink>
            </Column>
            <Column>
              <FieldLabel>Stock</FieldLabel>
              <FieldInput
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Column>
          </Row>

          <SectionLabel>Image produit</SectionLabel>
          <ImageTabs>
            <ImageTab type="button" $active={imageMode === "file"} onClick={() => setImageMode("file")}>
              📁 Depuis mon appareil
            </ImageTab>
            <ImageTab type="button" $active={imageMode === "url"} onClick={() => setImageMode("url")}>
              🔗 Depuis une URL
            </ImageTab>
          </ImageTabs>

          {imageMode === "file" ? (
            <FieldInput type="file" accept="image/*" onChange={handleFileChange} />
          ) : (
            <FieldInput
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={imageUrl ?? ""}
              onChange={handleImageUrlChange}
            />
          )}

          {imagePreview && <ImagePreview src={imagePreview} alt="Aperçu" />}

          <SubmitBtn disabled={saving}>
            {saving ? <Loader /> : "Sauvegarder les modifications"}
          </SubmitBtn>
        </Card>
      </Container>
    </Wrapper>
  );
}