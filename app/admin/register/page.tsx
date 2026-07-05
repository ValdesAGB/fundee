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
import Formulaire from "./Formulaire";

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
        : [...prev, categoryId],
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
    const realCategoryIds = selectedCategories.filter(
      (id) => !id.startsWith("custom-"),
    );

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
        localStorage.setItem(
          "pendingCustomCategories",
          JSON.stringify(customNames),
        );
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
          <Formulaire
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            error={error}
            loading={loading}
            handlePhoneKeyDown={handlePhoneKeyDown}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCustomCategory={handleAddCustomCategory}
          />
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
