import { Spinner } from "../components/dots/Loader";
import {
  AddCategoryBtn,
  Brand,
  BrandDot,
  BrandName,
  Column,
  ErrorBox,
  Field,
  FieldInput,
  FieldLabel,
  FieldTextarea,
  Form,
  LoginLink,
  Row,
  SubmitBtn,
  Subtitle,
  Title,
} from "./Register.styles";

export default function Formulaire({
  handleSubmit,
  handleChange,
  error,
  loading,
  handlePhoneKeyDown,
  categories,
  selectedCategories,
  handleCategoryToggle,
  newCategoryName,
  setNewCategoryName,
  handleAddCustomCategory,
}: any) {
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Brand>
          <BrandDot />
          <BrandName>Fudee</BrandName>
        </Brand>

        <Title>Créer votre compte</Title>
        <Subtitle>Rejoignez la plateforme dès aujourd'hui.</Subtitle>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Row>
          <Column>
            <FieldLabel>Nom du business</FieldLabel>
            <FieldInput
              type="text"
              name="name"
              placeholder="Nom du business"
              onChange={handleChange}
              required
            />
          </Column>
          <Column>
            <FieldLabel>Téléphone</FieldLabel>
            <FieldInput
              type="text"
              name="phone"
              placeholder="+229 00 00 00 00"
              onChange={handleChange}
              onKeyDown={handlePhoneKeyDown}
            />
          </Column>
        </Row>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldInput
            type="email"
            name="email"
            placeholder="email@business.com"
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea
            name="description"
            placeholder="Description du business"
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel>Adresse physique</FieldLabel>
          <FieldInput
            type="text"
            name="address"
            placeholder="Adresse du business"
            onChange={handleChange}
          />
        </Field>

        {/* ── Catégories ── */}
        <Field>
          <FieldLabel>Catégories de votre business</FieldLabel>
          <p style={{ fontSize: 12, color: "#888", margin: "4px 0 8px 0" }}>
            Sélectionnez les catégories qui décrivent votre activité. Vous
            pourrez les modifier plus tard dans les paramètres.
          </p>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}
          >
            {categories.length === 0 ? (
              <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
                Aucune catégorie existante. Ajoutez-en une ci-dessous.
              </p>
            ) : (
              categories.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: "1px solid #ddd",
                    background: selectedCategories.includes(cat.id)
                      ? "#ff6b00"
                      : "#fff",
                    color: selectedCategories.includes(cat.id)
                      ? "#fff"
                      : "#333",
                    cursor: "pointer",
                    fontSize: 14,
                    transition: "all 0.2s",
                  }}
                >
                  {cat.icon && (
                    <span style={{ marginRight: 6 }}>{cat.icon}</span>
                  )}
                  {cat.name}
                </button>
              ))
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <FieldInput
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ajouter une catégorie personnalisée..."
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
            />
            <AddCategoryBtn type="button" onClick={handleAddCustomCategory}>
              + Ajouter
            </AddCategoryBtn>
          </div>
        </Field>

        <Row>
          <Column>
            <FieldLabel>Mot de passe</FieldLabel>
            <FieldInput
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </Column>
          <Column>
            <FieldLabel>Confirmer Mot de passe</FieldLabel>
            <FieldInput
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </Column>
        </Row>

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? <Spinner /> : "S'inscrire"}
        </SubmitBtn>

        <LoginLink>
          Déjà un compte ? <a href="/admin/login">Se connecter</a>
        </LoginLink>
      </Form>
    </>
  );
}
