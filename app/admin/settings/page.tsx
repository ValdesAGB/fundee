"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import { saveProfile, savePassword, deleteAccount } from "./handlers";
import {
  Wrapper,
  Container,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  Row,
  Column,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  AvatarBlock,
  Avatar,
  AvatarWrapper,
  AvatarImg,
  AvatarOverlay,
  AvatarInfo,
  AvatarName,
  AvatarRole,
  AvatarMenu,
  AvatarMenuItem,
  Modal,
  ModalImg,
  ModalClose,
  SaveBtn,
  DangerBtn,
  ToggleRow,
  ToggleInfo,
  ToggleLabel,
  ToggleDesc,
  Toggle,
  ErrorBox,
  SuccessBox,
  AvatarSpinner,
} from "./Settings.styles";
import { Loader } from "../components/dots/Loader";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    marketingEmails: false,
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [businessCategories, setBusinessCategories] = useState<Array<{id: string, name: string, description?: string, icon?: string}>>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string, description?: string, icon?: string} | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon: "" });
  const [savingCategory, setSavingCategory] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/v1/business/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setProfile({
            name: data.data.name || "",
            email: data.data.email || "",
            phone: data.data.phone || "",
            description: data.data.description || "",
            address: data.data.address || "",
            avatar: data.data.avatar || "",
          });
        }
      } catch {
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/business/categories", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setBusinessCategories((data.data || []).filter((c: any) => c.businessId));
        }
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Ferme le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // ✅ Upload nouvelle photo
  const handleUploadAvatar = () => {
    setShowAvatarMenu(false);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setAvatarUploading(true);
      setError("");
      setSuccess("");

      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/v1/upload", {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur upload avatar");

        const newProfile = { ...profile, avatar: data.url };
        setProfile(newProfile);

        await fetch("/api/v1/business/auth/me", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newProfile.name,
            phone: newProfile.phone,
            description: newProfile.description,
            address: newProfile.address,
            avatar: data.url,
          }),
        });

        setSuccess("Photo de profil mise à jour.");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setAvatarUploading(false);
      }
    };
    input.click();
  };

  // ✅ Supprimer la photo
  const handleDeleteAvatar = async () => {
    setShowAvatarMenu(false);
    setError("");
    setSuccess("");

    try {
      await fetch("/api/v1/business/auth/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          description: profile.description,
          address: profile.address,
          avatar: "",
        }),
      });

      setProfile({ ...profile, avatar: "" });
      setSuccess("Photo de profil supprimée.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Category management
  const handleSaveCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Le nom de la catégorie est requis");
      return;
    }
    setSavingCategory(true);
    setError("");
    setSuccess("");

    try {
      const url = editingCategory
        ? `/api/v1/business/categories/${editingCategory.id}`
        : "/api/v1/business/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description || undefined,
          icon: newCategory.icon || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la sauvegarde");

      // Refresh categories
      const categoriesRes = await fetch("/api/v1/business/categories", {
        credentials: "include",
      });
      const categoriesData = await categoriesRes.json();
      if (categoriesRes.ok) {
        setBusinessCategories((categoriesData.data || []).filter((c: any) => c.businessId));
      }

      setShowCategoryForm(false);
      setEditingCategory(null);
      setNewCategory({ name: "", description: "", icon: "" });
      setSuccess(editingCategory ? "Catégorie mise à jour" : "Catégorie créée");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleEditCategory = (category: typeof businessCategories[0]) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/v1/business/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");

      setBusinessCategories(businessCategories.filter((c) => c.id !== categoryId));
      setSuccess("Catégorie supprimée");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Wrapper className="row">
      <Sidebar />

      <Container>
        <PageTitle>Paramètres</PageTitle>
        <PageSubtitle>Gérez votre compte et vos préférences.</PageSubtitle>

        {/* ── Profil ── */}
        {loadingProfile ? (
          <Loader />
        ) : (
          <Section>
            {error && <ErrorBox>{error}</ErrorBox>}
            {success && <SuccessBox>{success}</SuccessBox>}

            <AvatarBlock>
              <div style={{ position: "relative" }} ref={menuRef}>
                <AvatarWrapper
                  onClick={() =>
                    !avatarUploading && setShowAvatarMenu(!showAvatarMenu)
                  }
                  title="Options de la photo"
                >
                  {profile.avatar ? (
                    <AvatarImg src={profile.avatar} alt="avatar" />
                  ) : (
                    <Avatar>
                      {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "P"}
                    </Avatar>
                  )}

                  {avatarUploading ? (
                    <AvatarSpinner /> // ← spinner visible sans survol
                  ) : (
                    <AvatarOverlay>
                      <i className="bi bi-camera" />
                    </AvatarOverlay>
                  )}
                </AvatarWrapper>

                {/* ── Menu ── */}
                {showAvatarMenu && (
                  <AvatarMenu>
                    {profile.avatar && (
                      <AvatarMenuItem
                        type="button"
                        onClick={() => {
                          setShowAvatarMenu(false);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-eye" />
                        Voir la photo
                      </AvatarMenuItem>
                    )}
                    <AvatarMenuItem type="button" onClick={handleUploadAvatar}>
                      <i className="bi bi-pencil" />
                      {profile.avatar ? "Modifier" : "Ajouter une photo"}
                    </AvatarMenuItem>
                    {profile.avatar && (
                      <AvatarMenuItem
                        type="button"
                        $danger
                        onClick={handleDeleteAvatar}
                      >
                        <i className="bi bi-trash3" />
                        Supprimer
                      </AvatarMenuItem>
                    )}
                  </AvatarMenu>
                )}
              </div>

              <AvatarInfo>
                <AvatarName>{profile.name || "Votre business"}</AvatarName>
                <AvatarRole>BUSINESS</AvatarRole>
              </AvatarInfo>
            </AvatarBlock>

            <SectionTitle>Informations du profil</SectionTitle>
            <SectionSubtitle>
              Mettez à jour les informations de votre business.
            </SectionSubtitle>

            <form
              onSubmit={(e) =>
                saveProfile(e, {
                  profile,
                  setProfile,
                  setSaving,
                  setError,
                  setSuccess,
                })
              }
            >
              <Row>
                <Column>
                  <FieldLabel>Nom du business</FieldLabel>
                  <FieldInput
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Nom du business"
                  />
                </Column>
                <Column>
                  <FieldLabel>Téléphone</FieldLabel>
                  <FieldInput
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="+229 00 00 00 00"
                    onKeyDown={(e) => {
                      const allowed = /[0-9+\s\-().]/;
                      if (!allowed.test(e.key) && e.key.length === 1) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Column>
              </Row>

              <FieldLabel>Email</FieldLabel>
              <FieldInput
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="email@business.com"
                disabled
              />

              <FieldLabel>Description</FieldLabel>
              <FieldTextarea
                name="description"
                value={profile.description}
                onChange={handleProfileChange}
                placeholder="Description de votre business"
              />

              <FieldLabel>Adresse physique</FieldLabel>
              <FieldInput
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                placeholder="Adresse du business"
              />

              <SaveBtn type="submit" disabled={saving}>
                <i className="bi bi-check-lg" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </SaveBtn>
            </form>
          </Section>
        )}

        {/* ── Catégories ── */}
        <Section>
          <SectionTitle>Catégories de votre business</SectionTitle>
          <SectionSubtitle>
            Créez et gérez les catégories spécifiques à votre business. Ces
            catégories seront disponibles lors de l'ajout de produits.
          </SectionSubtitle>

          {error && <ErrorBox>{error}</ErrorBox>}
          {success && <SuccessBox>{success}</SuccessBox>}

          {!showCategoryForm ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {businessCategories.length === 0 ? (
                  <p style={{ color: "#888", fontSize: 14 }}>
                    Aucune catégorie pour le moment. Créez-en une pour
                    commencer.
                  </p>
                ) : (
                  businessCategories.map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                      }}
                    >
                      {cat.icon && <span>{cat.icon}</span>}
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {cat.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditCategory(cat)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ff6b00",
                          padding: 0,
                          marginLeft: 4,
                        }}
                        title="Modifier"
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#dc3545",
                          padding: 0,
                        }}
                        title="Supprimer"
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <SaveBtn
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory({ name: "", description: "", icon: "" });
                  setShowCategoryForm(true);
                }}
              >
                <i className="bi bi-plus-lg" />
                Ajouter une catégorie
              </SaveBtn>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 16,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <FieldLabel>Nom de la catégorie *</FieldLabel>
              <FieldInput
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Ex: Électronique, Alimentaire, Mode..."
              />

              <FieldLabel>Icône (emoji)</FieldLabel>
              <FieldInput
                value={newCategory.icon}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                placeholder="📱, 🍔, 👕..."
                maxLength={2}
              />

              <FieldLabel>Description</FieldLabel>
              <FieldTextarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Description de la catégorie (optionnel)"
              />

              <div style={{ display: "flex", gap: 8 }}>
                <SaveBtn
                  type="button"
                  onClick={handleSaveCategory}
                  disabled={savingCategory}
                >
                  <i className="bi bi-check-lg" />
                  {savingCategory
                    ? "Sauvegarde..."
                    : editingCategory
                    ? "Mettre à jour"
                    : "Créer"}
                </SaveBtn>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setNewCategory({ name: "", description: "", icon: "" });
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* ── Mot de passe ── */}
        <Section>
          <SectionTitle>Sécurité</SectionTitle>
          <SectionSubtitle>Modifiez votre mot de passe.</SectionSubtitle>

          {passwordError && <ErrorBox>{passwordError}</ErrorBox>}
          {passwordSuccess && <SuccessBox>{passwordSuccess}</SuccessBox>}

          <form
            onSubmit={(e) =>
              savePassword(e, {
                passwords,
                setPasswords,
                setSavingPassword,
                setPasswordError,
                setPasswordSuccess,
              })
            }
          >
            <FieldLabel>Mot de passe actuel</FieldLabel>
            <FieldInput
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
            />

            <Row>
              <Column>
                <FieldLabel>Nouveau mot de passe</FieldLabel>
                <FieldInput
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </Column>
              <Column>
                <FieldLabel>Confirmer</FieldLabel>
                <FieldInput
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </Column>
            </Row>

            <SaveBtn type="submit" disabled={savingPassword}>
              <i className="bi bi-shield-lock" />
              {savingPassword ? "Mise à jour..." : "Mettre à jour"}
            </SaveBtn>
          </form>
        </Section>

        {/* ── Notifications ── 
        <Section>
          <SectionTitle>Notifications</SectionTitle>
          <SectionSubtitle>
            Choisissez les notifications que vous souhaitez recevoir.
          </SectionSubtitle>

          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Notifications par email</ToggleLabel>
              <ToggleDesc>
                Recevez des emails pour les activités importantes.
              </ToggleDesc>
            </ToggleInfo>
            <Toggle
              type="button"
              $active={notifications.emailNotifications}
              onClick={() =>
                setNotifications({
                  ...notifications,
                  emailNotifications: !notifications.emailNotifications,
                })
              }
            />
          </ToggleRow>

          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Alertes de commandes</ToggleLabel>
              <ToggleDesc>Soyez notifié à chaque nouvelle commande.</ToggleDesc>
            </ToggleInfo>
            <Toggle
              type="button"
              $active={notifications.orderAlerts}
              onClick={() =>
                setNotifications({
                  ...notifications,
                  orderAlerts: !notifications.orderAlerts,
                })
              }
            />
          </ToggleRow>

          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Emails marketing</ToggleLabel>
              <ToggleDesc>
                Recevez des conseils et nouvelles fonctionnalités.
              </ToggleDesc>
            </ToggleInfo>
            <Toggle
              type="button"
              $active={notifications.marketingEmails}
              onClick={() =>
                setNotifications({
                  ...notifications,
                  marketingEmails: !notifications.marketingEmails,
                })
              }
            />
          </ToggleRow>
        </Section>*/}

        {/* ── Danger zone ── 
        <Section>
          <SectionTitle>Zone de danger</SectionTitle>
          <SectionSubtitle>
            Ces actions sont irréversibles. Soyez prudent.
          </SectionSubtitle>

          <DangerBtn type="button" onClick={() => deleteAccount({ setError })}>
            <i className="bi bi-trash3" />
            Supprimer mon compte
          </DangerBtn>
        </Section>*/}
      </Container>

      {/* ── Modal photo ── */}
      {showModal && profile.avatar && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalClose onClick={() => setShowModal(false)}>
            <i className="bi bi-x" />
          </ModalClose>
          <ModalImg
            src={profile.avatar}
            alt="Photo de profil"
            onClick={(e) => e.stopPropagation()}
          />
        </Modal>
      )}
    </Wrapper>
  );
}
