"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const SlideDots = dynamic(() => import("../components/dots/Animation"), {
  ssr: false,
});
import {
  Container,
  Left,
  Right,
  RightInner,
  FormWrap,
  Brand,
  BrandDot,
  BrandName,
  Heading,
  Sub,
  Field,
  FieldLabel,
  FieldInput,
  Row,
  Forgot,
  SubmitBtn,
  Spinner,
  Footer,
  ErrorBox,
  Quote,
  Accent,
} from "./LoginPage.styles";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* 🔌 Brancher la logique ici*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw { message: data?.message || "Email ou mot de passe incorrect" };
      }

      window.location.href = "/admin/products";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Left>
        <FormWrap onSubmit={handleSubmit}>
          <Brand>
            <BrandDot />
            <BrandName>Fundee</BrandName>
          </Brand>

          <Heading>Bon retour 👋</Heading>
          <Sub>Connectez-vous pour accéder à votre espace.</Sub>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Field>
            <FieldLabel>Adresse email</FieldLabel>
            <FieldInput
              type="email"
              name="email"
              placeholder="john@exemple.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </Field>

          <Field>
            <FieldLabel>Mot de passe</FieldLabel>
            <FieldInput
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </Field>

          <Row>
            <Forgot href='/admin/forgot-password'>Mot de passe oublié ?</Forgot>
          </Row>

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Se connecter"}
          </SubmitBtn>

          <Footer>
            Pas encore de compte ? <a href="/admin/register">Créer un compte</a>
          </Footer>
        </FormWrap>
      </Left>

      <Right>
        <RightInner>
          <Quote>
            "La réussite appartient à ceux qui <Accent>osent agir.</Accent>"
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
