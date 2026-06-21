import { Actions } from "@/app/NotFound.styles";
import { Delete, Editing, View } from "../products/Products.styled";

export default function DashboardActionsBtn({ product, handleDelete }) {
  return (
    <>
      <Actions>
        <View href={`/admin/products/${product.id}`}>
          <i className="bi bi-eye" />
        </View>
        <Editing href={`/admin/products/edit/${product.id}`}>
          <i className="bi bi-pencil" />
        </Editing>
        <Delete onClick={() => handleDelete(product.id)}>
          <i className="bi bi-trash3" />
        </Delete>
      </Actions>
    </>
  );
}
