import {
  DangerBtn,
  Section,
  SectionSubtitle,
  SectionTitle,
} from "./Settings.styles";

export default function DangerZone({ deleteAccount, setError }: any) {
  return (
    <Section>
      <SectionTitle>Zone de danger</SectionTitle>
      <SectionSubtitle>
        Ces actions sont irréversibles. Soyez prudent.
      </SectionSubtitle>

      <DangerBtn type="button" onClick={() => deleteAccount({ setError })}>
        <i className="bi bi-trash3" />
        Supprimer mon compte
      </DangerBtn>
    </Section>
  );
}
