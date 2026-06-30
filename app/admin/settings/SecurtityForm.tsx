import {
  Column,
  FieldInput,
  FieldLabel,
  Row,
  SaveBtn,
} from "./Settings.styles";

export default function SecurtityForm({
  savePassword,
  passwords,
  setPasswords,
  handlePasswordChange,
  savingPassword,
  setSavingPassword,
  setPasswordError,
  setPasswordSuccess,
}: any) {
  return (
    <>
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
    </>
  );
}
