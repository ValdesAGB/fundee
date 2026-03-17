import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FormData {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  stock: string;
}

interface SubmitParams {
  formData: FormData;
  isPromo: boolean;
  imageMode: "file" | "url";
  imageFile: File | null;
  imageUrl: string;
  showNewCategory: boolean;
  newCategory: string;
  setError: (msg: string) => void;
  setLoading: (val: boolean) => void;
  router: AppRouterInstance;
  onSuccess: () => void; // ← ajout
}

export async function handleAddProduct(
  e: React.FormEvent,
  params: SubmitParams
) {
  e.preventDefault();
  const {
    formData, isPromo, imageMode, imageFile, imageUrl,
    showNewCategory, newCategory, setError, setLoading, onSuccess, // ← ajout
  } = params;

  setError("");
  setLoading(true);

  try {
    // ── 1. Image ──
    let imagePayload: string[] = [];

    if (imageMode === "file" && imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);
      const uploadRes = await fetch("/api/v1/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Erreur upload image");
      imagePayload = [uploadData.url];
    } else if (imageMode === "url" && imageUrl.trim()) {
      imagePayload = [imageUrl.trim()];
    }

    // ── 2. Catégorie ──
    let categoryId = formData.categoryId;

    if (showNewCategory && newCategory.trim()) {
      const catRes = await fetch("/api/v1/categories", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const catData = await catRes.json();
      if (!catRes.ok) throw new Error(catData.message || "Erreur création catégorie");
      categoryId = catData.data.id;
    }

    // ── 3. Body ──
    const body: Record<string, unknown> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      categoryId,
      images: imagePayload,
    };

    if (isPromo && formData.compareAtPrice) {
      body.compareAtPrice = parseFloat(formData.compareAtPrice);
    }

    // ── 4. Création produit ──
    const res = await fetch("/api/v1/business/products", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur création produit");

    onSuccess(); // ✅ remplace router.push
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Une erreur est survenue");
  } finally {
    setLoading(false);
  }
}