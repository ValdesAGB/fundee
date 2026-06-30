"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import { saveProfile, savePassword, deleteAccount } from "./handlers";
import {
  Wrapper,
  Container,
  PageTitle,
  PageSubtitle,
  Modal,
  ModalImg,
  ModalClose,
} from "./Settings.styles";
import { Loader } from "../components/dots/Loader";
import SecuritySection from "./SecuritySection";
import ProfileSection from "./ProfileSection";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    category: "",
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
            category: data.data.category || "",
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
            category: newProfile.category,
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
          <ProfileSection
            error={error}
            success={success}
            profile={profile}
            setProfile={setProfile}
            handleProfileChange={handleProfileChange}
            saveProfile={saveProfile}
            saving={saving}
            setSaving={setSaving}
            setError={setError}
            setSuccess={setSuccess}
            avatarUploading={avatarUploading}
            setShowAvatarMenu={setShowAvatarMenu}
            showAvatarMenu={showAvatarMenu}
            menuRef={menuRef}
            setShowModal={setShowModal}
            handleUploadAvatar={handleUploadAvatar}
            handleDeleteAvatar={handleDeleteAvatar}
          />
        )}

        {/* ── Mot de passe ── */}
        <SecuritySection
          passwordError={passwordError}
          passwordSuccess={passwordSuccess}
          savePassword={savePassword}
          passwords={passwords}
          setPasswords={setPasswords}
          handlePasswordChange={handlePasswordChange}
          savingPassword={savingPassword}
          setSavingPassword={setSavingPassword}
          setPasswordError={setPasswordError}
          setPasswordSuccess={setPasswordSuccess}
        />
        {/* 
        <Notifications
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <DangerZone deleteAccount={deleteAccount} setError={setError} />
        */}
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
