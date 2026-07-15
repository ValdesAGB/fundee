"use client";

import { useState } from "react";
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
  icon?: string;
}

const FIXED_CATEGORIES: Category[] = [
  { id: "restaurants-maquis", name: "Restaurants / Maquis", icon: "🍲" },
  { id: "epiceries-supermarches", name: "Épiceries / Supermarchés", icon: "🛒" },
  { id: "boulangeries", name: "Boulangeries", icon: "🍞" },
];

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

  const categories = FIXED_CATEGORIES;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

      // Sauvegarde les catégories sélectionnées sur le profil business
      if (selectedCategories.length > 0) {
        await fetch("/api/v1/user/profile", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryIds: selectedCategories }),
        });
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
