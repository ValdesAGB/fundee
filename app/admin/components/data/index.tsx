/* ── Typewriter phrases ─────────────────────────────────── */
export const PHRASES = [
  { before: "Le bon repas,\nau bon ", accent: "moment." },
  { before: "Moins de gaspi,\nplus de ", accent: "saveurs." },
  { before: "Vos invendus\nméritent ", accent: "mieux." },
  { before: "Récupérez,\nrégalez-", accent: "vous." },
];

/* ── Ticket items pool ──────────────────────────────────── */
export const ALL_ITEMS = [
  { name: "Panier boulangerie", old: "3 200", price: "1 200" },
  { name: "Panier restaurant", old: "5 000", price: "2 000" },
  { name: "Panier épicerie", old: "2 500", price: "900" },
  { name: "Plateau fromages", old: "4 500", price: "1 800" },
  { name: "Panier pâtisserie", old: "3 800", price: "1 400" },
  { name: "Légumes du marché", old: "2 000", price: "750" },
  { name: "Box sushi", old: "6 000", price: "2 200" },
  { name: "Viennoiseries", old: "2 800", price: "1 000" },
  { name: "Panier traiteur", old: "5 500", price: "2 100" },
  { name: "Fruits de saison", old: "1 800", price: "650" },
];

export const TICK_DURATION = 3500; // ms entre chaque rotation ticket
export const TYPE_SPEED = 55; // ms par caractère
export const ERASE_SPEED = 30;
export const PAUSE_AFTER = 2200; // ms avant d'effacer

/* ── SVG food icons ─────────────────────────────────────── */
export const Bowl = () => (
  <svg viewBox="0 0 110 110" fill="none" width="100%" height="100%">
    <ellipse cx="55" cy="72" rx="42" ry="10" fill="#0d3528" />
    <path d="M13 52 Q13 85 55 85 Q97 85 97 52Z" fill="#1a5c3e" />
    <path
      d="M13 52 Q13 85 55 85 Q97 85 97 52Z"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
    />
    <rect x="20" y="44" width="70" height="12" rx="6" fill="#0b4a34" />
    <rect
      x="20"
      y="44"
      width="70"
      height="12"
      rx="6"
      stroke="#8fae96"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M35 38 Q33 30 35 22 Q37 14 35 6"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M55 36 Q53 28 55 20 Q57 12 55 4"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M75 38 Q73 30 75 22 Q77 14 75 6"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
    <circle cx="40" cy="58" r="5" fill="#e8a33d" />
    <circle cx="55" cy="56" r="4" fill="#c97b53" />
    <circle cx="70" cy="59" r="5" fill="#e8a33d" opacity="0.8" />
    <circle cx="48" cy="62" r="3" fill="#8fae96" />
    <circle cx="63" cy="61" r="3" fill="#8fae96" opacity="0.7" />
  </svg>
);

export const Baguette = () => (
  <svg viewBox="0 0 110 110" fill="none" width="100%" height="100%">
    <path
      d="M15 75 Q18 55 30 40 Q45 22 75 18 Q95 15 100 20 Q105 28 90 42 Q75 58 55 70 Q38 80 20 82 Z"
      fill="#c97b53"
    />
    <path
      d="M15 75 Q18 55 30 40 Q45 22 75 18 Q95 15 100 20 Q105 28 90 42 Q75 58 55 70 Q38 80 20 82 Z"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1.5"
    />
    <path
      d="M30 62 Q50 42 78 28"
      fill="none"
      stroke="#f6f2e7"
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M35 55 Q50 38 72 26"
      fill="none"
      stroke="#1a5c3e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 6"
    />
    <ellipse
      cx="55"
      cy="45"
      rx="3"
      ry="1.5"
      fill="#f6f2e7"
      opacity="0.4"
      transform="rotate(-35 55 45)"
    />
    <ellipse
      cx="65"
      cy="38"
      rx="3"
      ry="1.5"
      fill="#f6f2e7"
      opacity="0.4"
      transform="rotate(-35 65 38)"
    />
    <ellipse
      cx="45"
      cy="54"
      rx="3"
      ry="1.5"
      fill="#f6f2e7"
      opacity="0.3"
      transform="rotate(-35 45 54)"
    />
  </svg>
);

export const Carottes = () => (
  <svg viewBox="0 0 110 110" fill="none" width="100%" height="100%">
    <path d="M35 25 Q30 50 28 75 Q32 78 36 75 Q40 50 42 25 Z" fill="#e8a33d" />
    <path
      d="M35 25 Q30 50 28 75 Q32 78 36 75 Q40 50 42 25 Z"
      fill="none"
      stroke="#c97b53"
      strokeWidth="1"
    />
    <path
      d="M30 45 Q35 43 40 45"
      fill="none"
      stroke="#c97b53"
      strokeWidth="1"
    />
    <path
      d="M29 58 Q35 56 41 58"
      fill="none"
      stroke="#c97b53"
      strokeWidth="1"
    />
    <path d="M35 25 Q28 15 22 10 Q30 12 35 25Z" fill="#8fae96" />
    <path d="M35 25 Q38 12 45 8 Q40 15 35 25Z" fill="#8fae96" opacity="0.8" />
    <path d="M35 25 Q32 10 35 5 Q38 12 35 25Z" fill="#8fae96" opacity="0.9" />
    <path d="M68 30 Q63 52 61 78 Q65 81 69 78 Q73 52 77 30 Z" fill="#c97b53" />
    <path
      d="M68 30 Q63 52 61 78 Q65 81 69 78 Q73 52 77 30 Z"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1"
    />
    <path
      d="M63 50 Q68 48 73 50"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1"
    />
    <path
      d="M62 63 Q68 61 74 63"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1"
    />
    <path d="M68 30 Q61 18 55 14 Q63 17 68 30Z" fill="#8fae96" opacity="0.9" />
    <path d="M68 30 Q73 16 81 12 Q75 19 68 30Z" fill="#8fae96" />
    <path d="M68 30 Q66 14 69 8 Q71 16 68 30Z" fill="#8fae96" opacity="0.8" />
  </svg>
);

export const Panier = () => (
  <svg viewBox="0 0 110 110" fill="none" width="100%" height="100%">
    <path
      d="M28 55 Q28 25 55 20 Q82 25 82 55"
      fill="none"
      stroke="#c97b53"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M15 55 Q12 85 55 90 Q98 85 95 55Z" fill="#1a5c3e" />
    <path
      d="M15 55 Q12 85 55 90 Q98 85 95 55Z"
      fill="none"
      stroke="#c97b53"
      strokeWidth="2"
    />
    <path d="M15 55 L95 55" stroke="#c97b53" strokeWidth="1.5" />
    <path d="M17 65 L93 65" stroke="#c97b53" strokeWidth="1" opacity="0.6" />
    <path d="M20 75 L90 75" stroke="#c97b53" strokeWidth="1" opacity="0.5" />
    <path d="M28 55 L22 90" stroke="#c97b53" strokeWidth="1" opacity="0.4" />
    <path d="M42 55 L38 90" stroke="#c97b53" strokeWidth="1" opacity="0.4" />
    <path d="M55 55 L55 90" stroke="#c97b53" strokeWidth="1" opacity="0.4" />
    <path d="M68 55 L72 90" stroke="#c97b53" strokeWidth="1" opacity="0.4" />
    <path d="M82 55 L88 90" stroke="#c97b53" strokeWidth="1" opacity="0.4" />
    <circle cx="38" cy="50" r="7" fill="#e8a33d" />
    <circle cx="55" cy="48" r="8" fill="#c97b53" />
    <circle cx="72" cy="50" r="7" fill="#8fae96" />
    <path
      d="M50 42 Q55 35 60 42"
      fill="none"
      stroke="#8fae96"
      strokeWidth="2"
    />
  </svg>
);

export const Feuille = () => (
  <svg viewBox="0 0 90 110" fill="none" width="100%" height="100%">
    <path
      d="M45 95 Q42 70 30 50 Q15 28 20 10 Q35 20 45 40 Q55 20 70 10 Q75 28 60 50 Q48 70 45 95Z"
      fill="#1a5c3e"
    />
    <path
      d="M45 95 Q42 70 30 50 Q15 28 20 10 Q35 20 45 40 Q55 20 70 10 Q75 28 60 50 Q48 70 45 95Z"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
    />
    <path
      d="M45 95 L45 15"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <path
      d="M45 70 Q35 58 22 52"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1"
      opacity="0.5"
    />
    <path
      d="M45 55 Q35 44 24 40"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1"
      opacity="0.5"
    />
    <path
      d="M45 70 Q55 58 68 52"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1"
      opacity="0.5"
    />
    <path
      d="M45 55 Q55 44 66 40"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1"
      opacity="0.5"
    />
    <path d="M32 52 Q20 46 18 35 Q28 38 32 52Z" fill="#8fae96" opacity="0.6" />
    <path d="M58 52 Q70 46 72 35 Q62 38 58 52Z" fill="#8fae96" opacity="0.6" />
  </svg>
);

export const Poivron = () => (
  <svg viewBox="0 0 100 110" fill="none" width="100%" height="100%">
    <path
      d="M50 20 L50 8"
      fill="none"
      stroke="#8fae96"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M50 12 Q42 6 36 8"
      fill="none"
      stroke="#8fae96"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M50 20 Q25 22 20 45 Q16 65 30 80 Q40 92 50 90 Q60 92 70 80 Q84 65 80 45 Q75 22 50 20Z"
      fill="#c97b53"
    />
    <path
      d="M50 20 Q25 22 20 45 Q16 65 30 80 Q40 92 50 90 Q60 92 70 80 Q84 65 80 45 Q75 22 50 20Z"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1.5"
    />
    <path
      d="M50 88 Q38 75 35 60"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <path
      d="M50 88 Q62 75 65 60"
      fill="none"
      stroke="#e8a33d"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <path
      d="M32 35 Q40 28 52 30"
      fill="none"
      stroke="#f6f2e7"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.25"
    />
  </svg>
);

export const bgItems = [
  {
    Icon: Bowl,
    top: "6%",
    left: "2%",
    size: 160,
    delay: 0,
    dur: 14,
    opacity: 0.35,
  },
  {
    Icon: Baguette,
    top: "10%",
    right: "3%",
    size: 150,
    delay: 2,
    dur: 16,
    opacity: 0.3,
  },
  {
    Icon: Carottes,
    top: "52%",
    left: "0%",
    size: 140,
    delay: 1,
    dur: 12,
    opacity: 0.32,
  },
  {
    Icon: Panier,
    bottom: "8%",
    left: "5%",
    size: 170,
    delay: 3,
    dur: 18,
    opacity: 0.28,
  },
  {
    Icon: Feuille,
    top: "28%",
    right: "1%",
    size: 130,
    delay: 0.5,
    dur: 15,
    opacity: 0.3,
  },
  {
    Icon: Poivron,
    bottom: "15%",
    right: "3%",
    size: 150,
    delay: 1.5,
    dur: 13,
    opacity: 0.3,
  },
  {
    Icon: Bowl,
    top: "72%",
    right: "10%",
    size: 110,
    delay: 4,
    dur: 17,
    opacity: 0.22,
  },
  {
    Icon: Carottes,
    top: "42%",
    left: "5%",
    size: 100,
    delay: 2.5,
    dur: 11,
    opacity: 0.25,
  },
];

export const stats = [
  { number: "−60%", label: "en moyenne" },
  { number: "3", label: "paniers / jour" },
  { number: "120+", label: "commerces" },
];
