import { FoodIcon, FoodRow, Stamp, StampSvg } from "../../Admin.styles";

export default function AdminPageCircle() {
  return (
    <FoodRow aria-hidden="true">
      <FoodIcon viewBox="0 0 48 48">
        {/* Assiette + couverts */}
        <circle
          cx="24"
          cy="24"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="24"
          cy="24"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M10 14 V24 M10 14 Q10 18 8 18 M10 14 Q10 18 12 18"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M38 14 V30 Q38 32 36 32"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </FoodIcon>

      <FoodIcon viewBox="0 0 48 48">
        {/* Pain */}
        <path
          d="M10 28 Q10 14 24 14 Q38 14 38 28 Q38 34 24 34 Q10 34 10 28 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M17 20 Q18 24 16 28"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 18 Q25 23 23 28"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M31 20 Q32 24 30 28"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </FoodIcon>

      <FoodIcon viewBox="0 0 48 48">
        {/* Pomme */}
        <path
          d="M24 18 C16 18 14 26 16 32 C18 37 22 38 24 36 C26 38 30 37 32 32 C34 26 32 18 24 18 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M24 18 Q23 13 27 11"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M27 11 Q31 10 32 13"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </FoodIcon>

      <FoodIcon viewBox="0 0 48 48">
        {/* Panier de légumes */}
        <path
          d="M12 22 H36 L33 36 H15 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M16 22 Q16 14 24 14 Q32 14 32 22"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M18 26 V32 M24 26 V32 M30 26 V32"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </FoodIcon>
    </FoodRow>
  );
}
