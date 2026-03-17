import { Dispatch, SetStateAction } from "react";

interface Profile {
  name: string;
  email: string;
  phone: string;
  description: string;
  address: string;
}

interface Passwords {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileParams {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<string>>;
}

interface PasswordParams {
  passwords: Passwords;
  setPasswords: Dispatch<SetStateAction<Passwords>>;
  setSavingPassword: Dispatch<SetStateAction<boolean>>;
  setPasswordError: Dispatch<SetStateAction<string>>;
  setPasswordSuccess: Dispatch<SetStateAction<string>>;
}

interface DeleteParams {
  setError: Dispatch<SetStateAction<string>>;
}

export async function saveProfile(e: React.FormEvent, params: ProfileParams) {
  e.preventDefault();
  const { profile, setProfile, setSaving, setError, setSuccess } = params;

  setSaving(true);
  setError("");
  setSuccess("");

  // ✅ Validation téléphone
  const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
  if (profile.phone && !phoneRegex.test(profile.phone)) {
    setError("Numéro de téléphone invalide. Ex: +229 00 00 00 00");
    setSaving(false);
    return;
  }

  try {
    const res = await fetch("/api/v1/business/auth/me", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        phone: profile.phone,
        description: profile.description,
        address: profile.address,
      }),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || "Erreur lors de la sauvegarde");

    const refreshRes = await fetch("/api/v1/business/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    const refreshData = await refreshRes.json();
    if (refreshRes.ok) {
      setProfile({
        name: refreshData.data.name || "",
        email: refreshData.data.email || "",
        phone: refreshData.data.phone || "",
        description: refreshData.data.description || "",
        address: refreshData.data.address || "",
      });
    }

    setSuccess("Profil mis à jour avec succès.");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
}

export async function savePassword(e: React.FormEvent, params: PasswordParams) {
  e.preventDefault();
  const {
    passwords,
    setPasswords,
    setSavingPassword,
    setPasswordError,
    setPasswordSuccess,
  } = params;

  setPasswordError("");
  setPasswordSuccess("");

  if (passwords.newPassword !== passwords.confirmPassword) {
    setPasswordError("Les mots de passe ne correspondent pas.");
    return;
  }

  if (passwords.newPassword.length < 8) {
    setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
    return;
  }

  setSavingPassword(true);

  try {
    const res = await fetch("/api/v1/business/auth/change-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || "Erreur changement de mot de passe");

    setPasswordSuccess("Mot de passe mis à jour avec succès.");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  } catch (err: any) {
    setPasswordError(err.message);
  } finally {
    setSavingPassword(false);
  }
}

export async function deleteAccount(params: DeleteParams) {
  const { setError } = params;

  const confirm1 = confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
  if (!confirm1) return;

  const confirm2 = confirm(
    "Cette action est irréversible. Confirmer la suppression ?",
  );
  if (!confirm2) return;

  try {
    const res = await fetch("/api/v1/business/auth/me", {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Erreur suppression du compte");
    }

    window.location.href = "/admin/register";
  } catch (err: any) {
    setError(err.message);
  }
}
