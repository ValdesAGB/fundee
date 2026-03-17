"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";

export default function FirstProduct() {
  return (
    <Wrapper>
      <IconCircle>
        <i className="bi bi-box-seam" />
      </IconCircle>

      <Text>Vous n'avez pas encore créé votre premier produit.</Text>
      <SubText>Commencez à vendre en ajoutant votre premier produit.</SubText>

      <Link href="/admin/products/add-product">
        <AddButton>
          <i className="bi bi-plus-lg" />
          Ajouter un produit
        </AddButton>
      </Link>
    </Wrapper>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 80px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeUp} 0.4s ease both;
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff5ee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  i {
    font-size: 30px;
    color: #ff6b00;
  }
`;

const Text = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 28px;
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ff6b00;
  color: white;
  border: none;
  padding: 13px 24px;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(255, 107, 0, 0.3);

  &:hover {
    background: #e55d00;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255, 107, 0, 0.35);
  }
`;