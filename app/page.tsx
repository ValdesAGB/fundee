// app/admin/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import AppName from "./admin/components/AppName";
import {
  Actions,
  BgCanvas,
  BgFood,
  Cursor,
  Eyebrow,
  Foot,
  Hero,
  Main,
  Nav,
  NavBadge,
  NavBrand,
  NavDot,
  OrbRing,
  OrbRingInner,
  Page,
  PrimaryBtn,
  SecondaryBtn,
  StatLabel,
  StatNumber,
  StatPill,
  StatRow,
  Subtitle,
  Ticket,
  TicketEdge,
  TicketHeader,
  TicketItem,
  TicketItemName,
  TicketList,
  TicketMeta,
  TicketNewPrice,
  TicketOldPrice,
  TicketPrices,
  TicketShop,
  TicketTotal,
  TicketTotalLabel,
  TicketTotalValue,
  TicketWrap,
  Title,
  TitleAccent,
  TitleWrap,
} from "./Admin.styles";
import { useTypewriter } from "./admin/components/TypeFunction";
import { useTicketItems } from "./admin/components/TicketItemsFunction";
import { bgItems, stats } from "./admin/components/data";

/* ── Page ───────────────────────────────────────────────── */
export default function AdminLandingPage() {
  const { displayed, phase } = useTypewriter();
  const { items, visible } = useTicketItems();

  return (
    <Page className="row">
      <BgCanvas>
        {bgItems.map(
          (
            { Icon, top, left, right, bottom, size, delay, dur, opacity },
            i,
          ) => (
            <BgFood
              key={i}
              $top={top}
              $left={left}
              $right={right}
              $bottom={bottom}
              $size={size}
              $delay={delay}
              $duration={dur}
              $opacity={opacity}
            >
              <Icon />
            </BgFood>
          ),
        )}
      </BgCanvas>

      <Nav>
        <NavBrand>
          <NavDot />
          <AppName />
        </NavBrand>
        <NavBadge>Bénin · BJ</NavBadge>
      </Nav>

      <Main>
        {/* ── Colonne gauche ── */}
        <Hero>
          <Eyebrow>Anti-gaspillage alimentaire</Eyebrow>

          <TitleWrap>
            <Title>
              {/* Affichage du texte avec retours à la ligne */}
              {displayed.before.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
              <TitleAccent>{displayed.accent}</TitleAccent>
              <Cursor $blink={phase === "pause"} />
            </Title>
          </TitleWrap>

          <Subtitle>
            Récupérez les invendus des restaurants, boulangeries et épiceries du
            Bénin avant qu&apos;ils ne finissent à la poubelle — à prix réduit.
          </Subtitle>

          <StatRow>
            {stats.map((s, i) => (
              <StatPill key={s.label} $delay={0.5 + i * 0.12}>
                <StatNumber>{s.number}</StatNumber>
                <StatLabel>{s.label}</StatLabel>
              </StatPill>
            ))}
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

        {/* ── Colonne droite — ticket ── */}
        <TicketWrap aria-hidden="true">
          <OrbRing $delay={0}>
            <OrbRingInner />
          </OrbRing>
          <TicketEdge $position="top" />
          <Ticket>
            <TicketHeader>
              <TicketShop>Reçu du jour</TicketShop>
              <TicketMeta>120+ commerces · Cotonou</TicketMeta>
            </TicketHeader>

            <TicketList $visible={visible}>
              {items.map((item, i) => (
                <TicketItem key={item.name} $index={i}>
                  <TicketItemName>{item.name}</TicketItemName>
                  <TicketPrices>
                    <TicketOldPrice>{item.old} F</TicketOldPrice>
                    <TicketNewPrice>{item.price} F</TicketNewPrice>
                  </TicketPrices>
                </TicketItem>
              ))}
            </TicketList>

            <TicketTotal>
              <TicketTotalLabel>Économie moyenne</TicketTotalLabel>
              <TicketTotalValue>−60%</TicketTotalValue>
            </TicketTotal>
          </Ticket>
          <TicketEdge $position="bottom" />
        </TicketWrap>
      </Main>
    </Page>
  );
}
