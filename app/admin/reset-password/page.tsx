import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage"; // ← renomme ton composant actuel

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
