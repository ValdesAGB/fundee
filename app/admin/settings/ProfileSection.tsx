import AvatarSection from "./AvatarSection";
import ProfileSectionForm from "./ProfileSectionForm";
import {
  ErrorBox,
  Section,
  SectionSubtitle,
  SectionTitle,
  SuccessBox,
} from "./Settings.styles";

export default function ProfileSection({
  error,
  success,
  profile,
  setProfile,
  handleProfileChange,
  saveProfile,
  saving,
  setSaving,
  setError,
  setSuccess,
  avatarUploading,
  setShowAvatarMenu,
  showAvatarMenu,
  menuRef,
  setShowModal,
  handleUploadAvatar,
  handleDeleteAvatar,
}: any) {
  return (
    <>
      <Section>
        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        <AvatarSection
          avatarUploading={avatarUploading}
          setShowAvatarMenu={setShowAvatarMenu}
          showAvatarMenu={showAvatarMenu}
          menuRef={menuRef}
          profile={profile}
          setShowModal={setShowModal}
          handleUploadAvatar={handleUploadAvatar}
          handleDeleteAvatar={handleDeleteAvatar}
        />

        <SectionTitle>Informations du profil</SectionTitle>
        <SectionSubtitle>
          Mettez à jour les informations de votre business.
        </SectionSubtitle>

        <ProfileSectionForm
          profile={profile}
          setProfile={setProfile}
          handleProfileChange={handleProfileChange}
          saveProfile={saveProfile}
          saving={saving}
          setSaving={setSaving}
          setError={setError}
          setSuccess={setSuccess}
        />
      </Section>
    </>
  );
}
