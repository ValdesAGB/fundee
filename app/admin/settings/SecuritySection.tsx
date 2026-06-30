import SecurtityForm from "./SecurtityForm";
import {
  ErrorBox,
  Section,
  SectionSubtitle,
  SectionTitle,
  SuccessBox,
} from "./Settings.styles";

export default function SecuritySection({
  passwordError,
  passwordSuccess,
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
      <Section>
        <SectionTitle>Sécurité</SectionTitle>
        <SectionSubtitle>Modifiez votre mot de passe.</SectionSubtitle>

        {passwordError && <ErrorBox>{passwordError}</ErrorBox>}
        {passwordSuccess && <SuccessBox>{passwordSuccess}</SuccessBox>}

        <SecurtityForm
          savePassword={savePassword}
          passwords={passwords}
          setPasswords={setPasswords}
          handlePasswordChange={handlePasswordChange}
          savingPassword={savingPassword}
          setSavingPassword={setSavingPassword}
          setPasswordError={setPasswordError}
          setPasswordSuccess={setPasswordSuccess}
        />
      </Section>
    </>
  );
}
