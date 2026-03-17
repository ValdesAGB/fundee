"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Container, Left, Right, RightInner,
  FormWrap, Brand, BrandDot, BrandName,
  IconCircle, Heading, Sub, Field, FieldLabel,
  FieldInput, SubmitBtn, Spinner, BackLink,
  ErrorBox, SuccessBox, Quote, Accent,
} from "./ForgotPassword.styles";

const SlideDots = dynamic(() => import("../components/dots/Animation"), {
  ssr: false,
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 🔌 Brancher la logique ici
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: "/admin/reset-password" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw { message: data?.message || "Erreur lors de l'envoi" };
      }

      setSuccess(true);
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

          <IconCircle>
            <i className="bi bi-lock" />
          </IconCircle>

          <Heading>Mot de passe oublié ?</Heading>
          <Sub>
            Entrez votre adresse email et nous vous enverrons un lien
            pour réinitialiser votre mot de passe.
          </Sub>

          {error && <ErrorBox>{error}</ErrorBox>}

          {success ? (
            <SuccessBox>
              <i className="bi bi-check-circle" style={{ marginRight: 8 }} />
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
              Vérifiez votre boîte mail.
            </SuccessBox>
          ) : (
            <>
              <Field>
                <FieldLabel>Adresse email</FieldLabel>
                <FieldInput
                  type="email"
                  name="email"
                  placeholder="john@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Envoyer le lien"}
              </SubmitBtn>
            </>
          )}

          <BackLink href="/admin/login">
            <i className="bi bi-arrow-left" />
            Retour à la connexion
          </BackLink>
        </FormWrap>
      </Left>

      <Right>
        <RightInner>
          <Quote>
            Reprenez le contrôle de votre{" "}
            <Accent>compte.</Accent>
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