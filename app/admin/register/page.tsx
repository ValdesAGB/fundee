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
  FieldSelect,
} from "./Register.styles";
import { BUSINESS_CATEGORIES } from "./data";
import Success from "./Sucess";
import Formulaire from "./Formulaire";

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
    category: "",
    role: "BUSINESS",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          description: formData.description,
          address: formData.address,
          category: formData.category,
          role: formData.role,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw { message: data?.message || "Erreur lors de l'inscription" };

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
          <Success />
        ) : (
          <Formulaire
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            error={error}
            loading={loading}
            formData={formData}
            handlePhoneKeyDown={handlePhoneKeyDown}
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
