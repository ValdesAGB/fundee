"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SlideDots from "../components/dots/Animation";
import {
  Container,
  Left,
  Right,
  RightInner,
  Form,
  SuccessCard,
  Brand,
  BrandDot,
  BrandName,
  Title,
  Subtitle,
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  Row,
  Column,
  SubmitBtn,
  Spinner,
  ErrorBox,
  LoginLink,
  Quote,
  Accent,
  SuccessIcon,
  SuccessTitle,
  SuccessText,
} from "./Register.styles";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    phone: "",
    address: "",
    role: "BUSINESS",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        const data = await res.json();
        if (res.ok) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    const customId = `custom-${Date.now()}`;
    setCategories([
      ...categories,
      { id: customId, name: newCategoryName.trim() },
    ]);
    setSelectedCategories([...selectedCategories, customId]);
    setNewCategoryName("");
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /[0-9+\s\-().]/;
    if (!allowed.test(e.key) && e.key.length === 1) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError("Numéro de téléphone invalide. Ex: +229 00 00 00 00");
      setLoading(false);
      return;
    }

    // Only save real (global) category IDs — custom ones will be created after login
    const realCategoryIds = selectedCategories.filter((id) => !id.startsWith("custom-"));

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          description: formData.description,
          address: formData.address,
          role: formData.role,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Erreur lors de l'inscription");

      // Save selected category IDs (custom ones excluded — user will create them after login)
      if (realCategoryIds.length > 0) {
        await fetch("/api/v1/user/profile", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryIds: realCategoryIds }),
        });
      }

      // Store custom category names in localStorage so they can be created after login
      const customNames = selectedCategories
        .filter((id) => id.startsWith("custom-"))
        .map((id) => categories.find((c) => c.id === id)?.name)
        .filter(Boolean) as string[];
      if (customNames.length > 0) {
        localStorage.setItem("pendingCustomCategories", JSON.stringify(customNames));
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="row">
      <Left>
        {success ? (
          <SuccessCard>
            <Brand>
              <BrandDot />
              <BrandName>Fudee</BrandName>
            </Brand>
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessTitle>Compte créé avec succès !</SuccessTitle>
            <SuccessText>
              Votre compte business a été créé. Vous pouvez maintenant vous
              connecter et commencer à gérer votre activité.
            </SuccessText>
            <SubmitBtn
              type="button"
              onClick={() => router.push("/admin/login")}
            >
              OK, se connecter
            </SubmitBtn>
          </SuccessCard>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Brand>
              <BrandDot />
              <BrandName>Fudee</BrandName>
            </Brand>

            <Title>Créer votre compte</Title>
            <Subtitle>Rejoignez la plateforme dès aujourd'hui.</Subtitle>

            {error && <ErrorBox>{error}</ErrorBox>}

            <Row>
              <Column>
                <FieldLabel>Nom du business</FieldLabel>
                <FieldInput
                  type="text"
                  name="name"
                  placeholder="Nom du business"
                  onChange={handleChange}
                  required
                />
              </Column>
              <Column>
                <FieldLabel>Téléphone</FieldLabel>
                <FieldInput
                  type="text"
                  name="phone"
                  placeholder="+229 00 00 00 00"
                  onChange={handleChange}
                  onKeyDown={handlePhoneKeyDown}
                />
              </Column>
            </Row>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldInput
                type="email"
                name="email"
                placeholder="email@business.com"
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldTextarea
                name="description"
                placeholder="Description du business"
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel>Adresse physique</FieldLabel>
              <FieldInput
                type="text"
                name="address"
                placeholder="Adresse du business"
                onChange={handleChange}
              />
            </Field>

            {/* ── Catégories ── */}
            <Field>
              <FieldLabel>Catégories de votre business</FieldLabel>
              <p style={{ fontSize: 12, color: "#888", margin: "4px 0 8px 0" }}>
                Sélectionnez les catégories qui décrivent votre activité. Vous
                pourrez les modifier plus tard dans les paramètres.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {categories.length === 0 ? (
                  <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
                    Aucune catégorie existante. Ajoutez-en une ci-dessous.
                  </p>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: "1px solid #ddd",
                        background: selectedCategories.includes(cat.id) ? "#ff6b00" : "#fff",
                        color: selectedCategories.includes(cat.id) ? "#fff" : "#333",
                        cursor: "pointer",
                        fontSize: 14,
                        transition: "all 0.2s",
                      }}
                    >
                      {cat.icon && <span style={{ marginRight: 6 }}>{cat.icon}</span>}
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <FieldInput
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ajouter une catégorie personnalisée..."
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    background: "#ff6b00",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  + Ajouter
                </button>
              </div>
            </Field>

            <Row>
              <Column>
                <FieldLabel>Mot de passe</FieldLabel>
                <FieldInput
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </Column>
              <Column>
                <FieldLabel>Confirmer Mot de passe</FieldLabel>
                <FieldInput
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </Column>
            </Row>

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? <Spinner /> : "S'inscrire"}
            </SubmitBtn>

            <LoginLink>
              Déjà un compte ? <a href="/admin/login">Se connecter</a>
            </LoginLink>
          </Form>
        )}
      </Left>

      <Right>
        <RightInner>
          <Quote>
            Gérez votre business avec <Accent>simplicité.</Accent>
          </Quote>
          <SlideDots
            count={3}
            autoPlay={true}
            interval={3000}
            activeColor="#ff6b00"
            inactiveColor="rgba(255,255,255,0.3)"
          />
        </RightInner>
      </Right>
    </Container>
  );
}
