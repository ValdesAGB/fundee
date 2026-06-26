import Link from "next/link";
import { FloatingButton } from "../products/Products.styled";

export default function NewProductBtn() {
  return (
    <>
      <Link href="/admin/products/add-product">
        <FloatingButton>
          <i className="bi bi-plus-lg" />
          Nouveau Produit
        </FloatingButton>
      </Link>
    </>
  );
}
