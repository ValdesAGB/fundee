import {
  Avatar,
  AvatarBlock,
  AvatarImg,
  AvatarInfo,
  AvatarMenu,
  AvatarMenuItem,
  AvatarName,
  AvatarOverlay,
  AvatarRole,
  AvatarSpinner,
  AvatarWrapper,
} from "./Settings.styles";

export default function AvatarSection({
  avatarUploading,
  setShowAvatarMenu,
  showAvatarMenu,
  menuRef,
  profile,
  setShowModal,
  handleUploadAvatar,
  handleDeleteAvatar,
}: any) {
  return (
    <>
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
                {profile.name ? profile.name.charAt(0).toUpperCase() : "P"}
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
    </>
  );
}
