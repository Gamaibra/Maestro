export interface MenuItem {
  id: string;
  nameFr: string;
  nameEn?: string;
  price: number;
  category: 'menu' | 'boissons';
  imageUrl?: string;
  thumbnailUrl?: string;
  images?: string[];
  descriptionFr?: string;
  descriptionEn?: string;
  createdAt?: number | string;
}

export interface CategoryInfo {
  id: 'menu' | 'boissons';
  labelFr: string;
  labelEn: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'menu', labelFr: 'Menu', labelEn: 'Menu' },
  { id: 'boissons', labelFr: 'Boissons', labelEn: 'Drinks' },
];

const createPlaceholderImage = (
  title: string,
  viewNote: string,
  fromColor: string,
  toColor: string,
  accentColor: string = '#F2C21B'
) => {
  const svg = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fromColor}"/>
        <stop offset="100%" stop-color="${toColor}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="48%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <circle cx="400" cy="230" r="260" fill="url(#glow)"/>
    <g transform="translate(400, 220) scale(3.4)" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <circle cx="0" cy="-22" r="3.2" stroke-width="2.2" fill="${fromColor}"/>
      <path d="M0 -18.8 V-16" stroke-width="2.2"/>
      <path d="M-28 6 C-28 -12 -16 -16 0 -16 C16 -16 28 -12 28 6 Z" stroke-width="2.6" fill="${fromColor}" fill-opacity="0.5"/>
      <rect x="-32" y="6" width="64" height="4.5" rx="2.25" stroke-width="2.2" fill="${fromColor}"/>
      <path d="M-36 14 C-16 17.5 16 17.5 36 14" stroke-width="2"/>
    </g>
    <text x="400" y="415" font-family="'Baloo 2', sans-serif, system-ui" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${title}</text>
    <text x="400" y="458" font-family="'Baloo 2', sans-serif, system-ui" font-size="20" font-weight="600" fill="${accentColor}" text-anchor="middle" letter-spacing="0.5">${viewNote}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'frite-alloco-salade-viande-grillee',
    nameFr: 'Frite alloco salade viande grillée',
    nameEn: 'Plantain fries, salad & grilled meat',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Bananes plantains mûres frites à la couleur dorée, accompagnées d’une salade fraîche croquante et de morceaux de viande tendre généreusement marinés et braisés.',
    descriptionEn:
      'Golden sweet fried plantains (alloco) served with a fresh crunchy garden salad and tender seasoned grilled meat cuts.',
    images: [
      createPlaceholderImage('Frite alloco salade viande grillée', 'Vue d’ensemble · Assiette complète', '#7A0E1C', '#32050D'),
      createPlaceholderImage('Alloco croustillant & Viande braisée', 'Gros plan · Marinade maison', '#9E2A2B', '#3E0A14'),
      createPlaceholderImage('Saveurs d’Abidjan · Garniture fraîche', 'Détails · Sauces & condiments', '#5A0D18', '#14134F'),
    ],
  },
  {
    id: 'haricot',
    nameFr: 'Haricot',
    nameEn: 'Savory African stewed beans',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Haricots mijotés lentement à l’africaine dans une sauce onctueuse relevée d’épices parfumées, huile rouge et oignons fondants.',
    descriptionEn:
      'Slow-simmered African red beans in a fragrant spiced sauce with rich palm oil and caramelized onions.',
  },
  {
    id: 'lafri',
    nameFr: 'Lafri',
    nameEn: 'Authentic spiced Lafri rice',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Riz Lafri traditionnel cuisiné avec un mélange savoureux d’aromates, légumes et épices authentiques pour un arôme fumé unique.',
    descriptionEn:
      'Traditional Lafri rice cooked with a distinct blend of aromatic herbs, vegetables, and authentic spices with a rich smoky profile.',
  },
  {
    id: 'riz-arachide-sauce-tomate',
    nameFr: 'Riz arachide sauce tomate',
    nameEn: 'Peanut & tomato sauce rice',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Riz blanc parfumé nappé d’une sauce veloutée à la pâte d’arachide torréfiée et coulis de tomates fraîches mijoté avec soin.',
    descriptionEn:
      'Fragrant steamed rice served with a velvety peanut butter and tomato sauce, slow-simmered with traditional seasoning.',
  },
  {
    id: 'riz-sauce-de-feuille',
    nameFr: 'Riz sauce de feuille',
    nameEn: 'Fragrant leaf sauce with rice',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Sauce traditionnelle aux feuilles vertes finement hachées et mijotées avec des épices d’Afrique, servie avec du riz chaud.',
    descriptionEn:
      'Traditional green leaf stew simmered with rich African aromatics, served hot alongside steamed rice.',
  },
  {
    id: 'riz-gombo-grille',
    nameFr: 'Riz gombo grillé',
    nameEn: 'Grilled okra sauce with rice',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Gombos frais légèrement braisés puis incorporés dans une sauce onctueuse, accompagnée de son riz blanc parfumé.',
    descriptionEn:
      'Fresh lightly charred okra folded into a flavorful savoury sauce, served with steaming fragrant white rice.',
  },
  {
    id: 'soupe-de-poulet-africain',
    nameFr: 'Soupe de poulet africain',
    nameEn: 'Traditional African chicken soup',
    price: 35,
    category: 'menu',
    descriptionFr:
      'Poulet fermier mijoté dans un bouillon aromatique généreux, relevé au gingembre frais, piments doux et herbes médicinales africaines.',
    descriptionEn:
      'Hearty African free-range chicken simmered in an aromatic clear broth with fresh ginger, sweet peppers, and village herbs.',
    images: [
      createPlaceholderImage('Soupe de poulet africain', 'Bouillon épicé mijoté · Poulet fermier', '#8A1424', '#2C060D'),
      createPlaceholderImage('Bouillon traditionnel & Aromates', 'Herbes sauvages · Gingembre frais', '#5E0E19', '#200540'),
    ],
  },
  {
    id: 'soupe-de-poisson',
    nameFr: 'Soupe de poisson',
    nameEn: 'Spiced aromatic fresh fish soup',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Poisson frais poché dans un court-bouillon épicé aux tomates fraîches, persil africain et jus de citron vert.',
    descriptionEn:
      'Fresh catch gently simmered in a light zesty broth infused with ripe tomatoes, African parsley, and lime.',
  },
  {
    id: 'soupe-de-patte-de-boeuf',
    nameFr: 'Soupe de patte de bœuf',
    nameEn: 'Slow-simmered beef trotters soup',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Patte de bœuf fondante cuite pendant des heures dans un bouillon riche en collagène, parfumé aux épices traditionnelles fortifiantes.',
    descriptionEn:
      'Melt-in-your-mouth beef trotters simmered for hours into a rich collagen broth packed with authentic invigorating spices.',
  },
  {
    id: 'atieke-poisson-braise',
    nameFr: 'Atiéké poisson braisé',
    nameEn: 'Attiéké with braised fish',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Semoule de manioc fermenté cuite vapeur (attiéké) servie avec un poisson braisé aux braises de bois, assaisonné de piments, tomates et oignons frais.',
    descriptionEn:
      'Steamed fermented cassava couscous served with whole charcoal-braised fish, seasoned with fresh sliced onions and sweet peppers.',
    images: [
      createPlaceholderImage('Atiéké poisson braisé', 'Poisson entier braisé au charbon', '#7E1220', '#250409'),
      createPlaceholderImage('Attiéké traditionnel d’Abidjan', 'Semoule légère de manioc & condiments', '#9E2435', '#3A0812'),
      createPlaceholderImage('Sauce pimentée maison & Garniture', 'Oignons, tomates fraîches & citron', '#6A101C', '#14134F'),
    ],
  },
  {
    id: 'garba',
    nameFr: 'Garba',
    nameEn: 'Traditional Ivorian Garba',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Le classique ivoirien par excellence : attiéké fin garni de thon frit assaisonné, oignons hachés, piments frais et filet d’huile dorée.',
    descriptionEn:
      'The iconic street-food favorite: fine attiéké paired with crispy fried tuna steaks, diced onions, and fresh chili peppers.',
  },
  {
    id: 'foutou-sauce-graine-aubergine',
    nameFr: 'Foutou sauce graine aubergine',
    nameEn: 'Foutou with palm nut & eggplant sauce',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Boule de foutou banane moelleuse accompagnée d’une riche sauce de graines de palme mijotée avec des aubergines africaines fondantes.',
    descriptionEn:
      'Smooth pounded plantain foutou served in a rich palm nut cream sauce slow-cooked with tender African eggplants.',
  },
  {
    id: 'atieke-choucouya-mouton',
    nameFr: 'Atiéké choucouya mouton',
    nameEn: 'Attiéké with choucouya mutton',
    price: 35,
    category: 'menu',
    descriptionFr:
      'Morceaux de mouton grillés à sec façon choucouya, parfumés à la poudre de cankan, accompagnés d’attiéké frais.',
    descriptionEn:
      'Wood-grilled diced mutton spiced with authentic West African dry rub (cankan), paired with steaming attiéké.',
  },
  {
    id: 'atieke-choucouya-poulet',
    nameFr: 'Atiéké choucouya poulet',
    nameEn: 'Attiéké with choucouya chicken',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Poulet fermier grillé à la flamme, coupé en morceaux et relevé au cankan épicé, servi avec de l’attiéké moelleux.',
    descriptionEn:
      'Flame-grilled spiced chicken chunks seasoned with aromatic cankan spices, served with tender fresh attiéké.',
  },
  {
    id: 'placali',
    nameFr: 'Placali',
    nameEn: 'Authentic cassava Placali dish',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Pâte de manioc fermentée à la texture élastique réconfortante, traditionnellement dégustée avec une sauce gombo ou sauce graine.',
    descriptionEn:
      'Silky pounded cassava dough with a comforting elastic texture, traditionally savored with rich okra or palm seed stews.',
  },
  {
    id: 'atieke-poisson-grille',
    nameFr: 'Atiéké poisson grillé',
    nameEn: 'Attiéké with fresh grilled fish',
    price: 25,
    category: 'menu',
    descriptionFr:
      'Poisson délicatement grillé avec nos aromates secrets, accompagné d’attiéké et de crudités croquantes.',
    descriptionEn:
      'Delicately seasoned grilled fish infused with house herbs, served with light attiéké and fresh vegetables.',
  },
  {
    id: 'tchep-poisson',
    nameFr: 'Tchep poisson',
    nameEn: 'Thieboudienne fish & rice (Tchep)',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Riz rouge sénégalais cuit dans le court-bouillon de mérou avec chou, carotte, manioc et herbes fraîches mijotées.',
    descriptionEn:
      'Authentic Senegalese red rice simmered in aromatic fish stock with hearty cabbage, carrots, and sweet cassava.',
  },
  {
    id: 'tchep-poulet',
    nameFr: 'Tchep poulet',
    nameEn: 'Thieboudienne chicken & rice (Tchep)',
    price: 30,
    category: 'menu',
    descriptionFr:
      'Le régal du Tchep décliné au poulet doré mijoté dans une sauce tomate parfumée aux légumes du marché.',
    descriptionEn:
      'Flavor-packed West African spiced rice cooked with succulent golden browned chicken and market-fresh vegetables.',
  },
];
