import {
  Column,
  FieldInput,
  FieldLabel,
  FieldTextarea,
  Row,
  SaveBtn,
} from "./Settings.styles";

export default function ProfileSectionForm({
  saveProfile,
  profile,
  setProfile,
  handleProfileChange,
  saving,
  setSaving,
  setError,
  setSuccess,
}: any) {
  return (
    <>
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

        <Row>
          <Column>
            <FieldLabel>Email</FieldLabel>
            <FieldInput
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="email@business.com"
              disabled
            />
          </Column>
          <Column>
            <FieldLabel>Catégorie</FieldLabel>
            <FieldInput
              name="category"
              value={profile.category}
              onChange={handleProfileChange}
              placeholder="Catégorie du business"
            />
          </Column>
        </Row>

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
    </>
  );
}
