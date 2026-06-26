// app/admin/page.tsx
"use client";

import Link from "next/link";
import {
  Page,
  Backdrop,
  RescueRing,
  Nav,
  NavBrand,
  NavDot,
  Hero,
  Eyebrow,
  Stamp,
  StampSvg,
  Title,
  TitleAccent,
  Subtitle,
  StatRow,
  Stat,
  StatNumber,
  StatLabel,
  Actions,
  PrimaryBtn,
  SecondaryBtn,
  Foot,
} from "./Admin.styles";
import AdminPageCircle from "./components/AdminPageCircle";
import AppName from "./components/AppName";

export default function AdminLandingPage() {
  return (
    <Page className="row">
      <Backdrop />
      <RescueRing aria-hidden="true" />

      <Nav>
        <NavBrand>
          <NavDot />
          <AppName />
        </NavBrand>
      </Nav>

      <Hero>
        <Eyebrow>Anti-gaspillage alimentaire · Bénin BJ</Eyebrow>

        <AdminPageCircle />

        <Title>
          Le bon repas,
          <br />
          au bon <TitleAccent>moment.</TitleAccent>
        </Title>

        <Subtitle>
          Récupérez les invendus des restaurants, boulangeries et épiceries de
          Cotonou avant qu&apos;ils ne finissent à la poubelle — à prix réduit.
        </Subtitle>

        <StatRow>
          <Stat>
            <StatNumber>−60%</StatNumber>
            <StatLabel>en moyenne</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>3</StatNumber>
            <StatLabel>nouveaux paniers / jour</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>120+</StatNumber>
            <StatLabel>commerces partenaires</StatLabel>
          </Stat>
        </StatRow>

        <Actions>
          <Link href="/admin/login" style={{ textDecoration: "none" }}>
            <PrimaryBtn>Se connecter</PrimaryBtn>
          </Link>
          <Link href="/admin/register" style={{ textDecoration: "none" }}>
            <SecondaryBtn>Créer un compte business</SecondaryBtn>
          </Link>
        </Actions>

        <Foot>
          Vous êtes un commerçant ? Rejoignez le mouvement anti-gaspi.
        </Foot>
      </Hero>
    </Page>
  );
}
