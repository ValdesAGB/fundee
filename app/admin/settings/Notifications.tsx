import {
  Section,
  SectionSubtitle,
  SectionTitle,
  Toggle,
  ToggleDesc,
  ToggleInfo,
  ToggleLabel,
  ToggleRow,
} from "./Settings.styles";

export default function Notifications({
  notifications,
  setNotifications,
}: any) {
  return (
    <>
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
      </Section>
    </>
  );
}
