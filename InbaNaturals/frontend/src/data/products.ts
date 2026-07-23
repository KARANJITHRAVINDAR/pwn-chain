// Shared product data used across pages
import hairOilImg from '../assets/images/products/hair-oil-main.jpg';
import hairOilImg2 from '../assets/images/products/hair-oil-2.jpg';
import hairPackImg from '../assets/images/products/hair-pack-main.jpg';
import hairPackImg2 from '../assets/images/products/hair-pack-2.jpg';
import facePackImg from '../assets/images/products/face-pack-main.jpg';
import facePackImg2 from '../assets/images/products/face-pack-2.jpg';
import faceSerumImg from '../assets/images/products/face-serum-main.jpg';
import faceSerumImg2 from '../assets/images/products/face-serum-2.jpg';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  category: 'hair' | 'face';
  image: string;
  secondaryImage: string;
  sizes: string[];
  description: string;
  howToUse: string;
  ingredients: string;
}

export const products: Product[] = [
  {
    id: 'hair-oil',
    name: 'Abha Herbal Hair Oil',
    tagline: 'Indian Gooseberry & Kunthala Blend — Luxe & Vibrant',
    price: '₹499',
    originalPrice: '₹699',
    category: 'hair',
    image: hairOilImg,
    secondaryImage: hairOilImg2,
    sizes: ['100ml', '200ml'],
    description:
      'Inspired by ancient Ayurvedic traditions, Abha Herbal Hair Oil is a premium botanical blend infused with Indian Gooseberry (Amla) and the revitalising Kunthala herb complex. Cold-pressed in small batches with coconut, argan, and castor oils, it penetrates deep into the scalp to strengthen roots, reduce hair fall, and restore natural lustre. Enriched with rosemary leaf extract and vitamin E, this luxurious oil brings back the dark, vibrant shine your hair deserves.',
    howToUse:
      'Warm 5–6 drops between your palms and massage gently into the scalp in circular motions. Work through the lengths of your hair. Leave on for at least 30 minutes or overnight for deep conditioning. Wash off with a mild sulphate-free shampoo. Use 2–3 times a week for optimal results.',
    ingredients:
      'Cocos Nucifera (Coconut) Oil, Phyllanthus Emblica (Indian Gooseberry / Amla) Extract, Argania Spinosa (Argan) Kernel Oil, Ricinus Communis (Castor) Seed Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Eclipta Prostrata (Bhringraj) Extract, Vitamin E Tocopherol, Lavandula Angustifolia (Lavender) Essential Oil.',
  },
  {
    id: 'hair-pack',
    name: 'Clear Scalp Anti-Dandruff Hair Pack',
    tagline: 'Deep-cleansing herbal mask for a flake-free, healthy scalp',
    price: '₹399',
    originalPrice: '₹549',
    category: 'hair',
    image: hairPackImg,
    secondaryImage: hairPackImg2,
    sizes: ['100g', '200g'],
    description:
      'The Clear Scalp Anti-Dandruff Hair Pack is a potent herbal treatment formulated with fenugreek seed powder, neem leaf extract, and natural clays to gently exfoliate the scalp, control excess oil, and eliminate dandruff at its root. Suitable for all hair types, this hand-mixed, cruelty-free mask soothes irritation, restores scalp pH balance, and leaves hair feeling silky and revitalised from root to tip.',
    howToUse:
      'Mix 2–3 tablespoons of the pack with curd or water to form a smooth paste. Apply generously to damp scalp and hair from roots to tips. Leave on for 20–30 minutes. Rinse thoroughly with lukewarm water followed by a mild shampoo. For best results, use once a week.',
    ingredients:
      'Trigonella Foenum-Graecum (Fenugreek / Methi) Seed Powder, Azadirachta Indica (Neem) Leaf Extract, Kaolin Clay, Aloe Barbadensis Leaf Juice, Melaleuca Alternifolia (Tea Tree) Oil, Butyrospermum Parkii (Shea) Butter, Hydrolyzed Keratin, Panthenol (Pro-Vitamin B5), Citric Acid.',
  },
  {
    id: 'face-pack',
    name: 'Vitamin C Glow Face Pack',
    tagline: 'Brightening clay mask for radiant, lit-from-within skin',
    price: '₹349',
    originalPrice: '₹499',
    category: 'face',
    image: facePackImg,
    secondaryImage: facePackImg2,
    sizes: ['50g', '100g'],
    description:
      'Our Vitamin C Glow Face Pack harnesses the brightening power of stable Vitamin C, turmeric root, and natural clay to deliver a visible glow in just 4 weeks of regular use. The formula gently draws out impurities, fades dark spots, and evens skin tone while lemon and ginger extracts energise tired skin. Dermatologically tested and cruelty-free — no quick fixes, just real, sustained radiance.',
    howToUse:
      'Mix 1–2 teaspoons with rose water or plain water to form a smooth paste. Apply evenly to a cleansed face, avoiding the eye area. Leave for 15–20 minutes until partially dry. Rinse off with lukewarm water and pat dry. Follow with your favourite moisturiser. Use 2–3 times a week for best results.',
    ingredients:
      'Ascorbic Acid (Vitamin C), Kaolin Clay, Multani Mitti (Fuller\'s Earth), Curcuma Longa (Turmeric) Root Powder, Citrus Limon (Lemon) Peel Extract, Zingiber Officinale (Ginger) Root Extract, Saccharum Officinarum (Sugarcane) Extract, Santalum Album (Sandalwood) Powder, Citrus Sinensis (Orange Peel) Powder.',
  },
  {
    id: 'face-serum',
    name: 'Botanical Radiance Face Serum',
    tagline: 'Multi-oil elixir with plant actives for youthful, dewy skin',
    price: '₹599',
    originalPrice: '₹799',
    category: 'face',
    image: faceSerumImg,
    secondaryImage: faceSerumImg2,
    sizes: ['15ml', '30ml'],
    description:
      'The Botanical Radiance Face Serum is a lightweight, fast-absorbing elixir housed in amber glass to preserve potency. Formulated with cold-pressed rosehip seed oil, hyaluronic acid, niacinamide, and centella asiatica extract, it deeply hydrates, reduces fine lines, and boosts collagen production. The dropper-dispensed serum locks in moisture for up to 24 hours, leaving skin dewy, plump, and naturally luminous.',
    howToUse:
      'After cleansing and toning, dispense 3–4 drops onto your fingertips. Gently press and pat into your face and neck — avoid rubbing. Allow 30 seconds to absorb, then follow with your daily moisturiser or SPF. Use every morning and evening for best results.',
    ingredients:
      'Aqua, Ascorbic Acid (Vitamin C), Sodium Hyaluronate (Hyaluronic Acid), Niacinamide, Glycerin, Centella Asiatica Extract, Rosa Canina (Rosehip) Seed Oil, Squalane, Allantoin, Tocopherol (Vitamin E), Citric Acid.',
  },
];
