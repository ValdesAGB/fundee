"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Container,
  Left,
  Right,
  RightInner,
  FormWrap,
  Brand,
  BrandDot,
  BrandName,
  IconCircle,
  Heading,
  Sub,
  Field,
  FieldLabel,
  FieldInput,
  SubmitBtn,
  Spinner,
  BackLink,
  ErrorBox,
  SuccessBox,
  Quote,
  Accent,
} from "./ResetPassword.styles";

const SlideDots = dynamic(() => import("../components/dots/Animation"), {
  ssr: false,
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien de réinitialisation invalide ou expiré.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/business/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erreur lors de la réinitialisation");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
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
            <i className="bi bi-shield-lock" />
          </IconCircle>

          <Heading>Nouveau mot de passe</Heading>
          <Sub>
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </Sub>

          {error && <ErrorBox>{error}</ErrorBox>}

          {success ? (
            <SuccessBox>
              <i className="bi bi-check-circle" style={{ marginRight: 8 }} />
              Mot de passe réinitialisé avec succès. Redirection vers la
              connexion...
            </SuccessBox>
          ) : (
            <>
              <Field>
                <FieldLabel>Nouveau mot de passe</FieldLabel>
                <FieldInput
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={!token}
                />
              </Field>

              <Field>
                <FieldLabel>Confirmer le mot de passe</FieldLabel>
                <FieldInput
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!token}
                />
              </Field>

              <SubmitBtn type="submit" disabled={loading || !token}>
                {loading ? <Spinner /> : "Réinitialiser le mot de passe"}
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
            Reprenez le contrôle de votre <Accent>compte.</Accent>
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
