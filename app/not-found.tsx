"use client";

import {
  Container, Glow, Content,
  Code, Title, Sub,
  Actions, HomeBtn, BackBtn,
} from "./NotFound.styles";

export default function NotFoundPage() {
  return (
    <Container className="row">
      <Glow />

      <Content>
        <Code>404</Code>
        <Title>Page introuvable</Title>
        <Sub>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </Sub>

        <Actions>
          <HomeBtn href="/admin/products">
            <i className="bi bi-house" />
            Retour au dashboard
          </HomeBtn>
          <BackBtn onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left" />
            Page précédente
          </BackBtn>
        </Actions>
      </Content>
    </Container>
  );
}