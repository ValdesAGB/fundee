"use client";

import { useRouter } from "next/navigation";
import {
  Brand,
  BrandDot,
  BrandName,
  SubmitBtn,
  SuccessCard,
  SuccessIcon,
  SuccessText,
  SuccessTitle,
} from "./Register.styles";

export default function Success() {
  const router = useRouter();

  return (
    <>
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
        <SubmitBtn type="button" onClick={() => router.push("/admin/login")}>
          OK, se connecter
        </SubmitBtn>
      </SuccessCard>
    </>
  );
}
