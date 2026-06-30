import { Spinner } from "../components/dots/Loader";
import { BUSINESS_CATEGORIES } from "./data";
import {
  Brand,
  BrandDot,
  BrandName,
  Column,
  ErrorBox,
  Field,
  FieldInput,
  FieldLabel,
  FieldSelect,
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
  formData,
  handlePhoneKeyDown,
}: {
  handleSubmit: any;
  handleChange: any;
  error: any;
  loading: any;
  formData: any;
  handlePhoneKeyDown: any;
}) {
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
          <FieldLabel>Catégorie d'entreprise</FieldLabel>
          <FieldSelect
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {BUSINESS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FieldSelect>
        </Field>

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
