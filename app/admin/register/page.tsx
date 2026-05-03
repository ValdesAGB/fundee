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
          <SuccessCard>
            <Brand>
              <BrandDot />
              <BrandName>Fundee</BrandName>
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
              <BrandName>Fundee</BrandName>
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
