// Shared product data used across pages
export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  category: 'hair' | 'face';
  image: string;
  sizes: string[];
  description: string;
  howToUse: string;
  ingredients: string;
}

export const products: Product[] = [
  {
    id: 'hair-oil',
    name: 'Hair Oil',
    tagline: 'Nourishing botanical blend for lustrous locks',
    price: '₹499',
    originalPrice: '₹699',
    category: 'hair',
    image: 'https://placehold.co/600x600/7A9471/FAF6EE?text=Hair+Oil',
    sizes: ['50ml', '100ml', '200ml'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Our Hair Oil is crafted from a blend of rare botanical extracts that penetrate deep into the scalp to nourish, strengthen, and revitalize every strand.',
    howToUse:
      'Apply 5–6 drops to your scalp and massage gently in circular motions. Leave on for at least 30 minutes or overnight for best results. Wash off with a mild shampoo. Use 2–3 times a week for optimal results.',
    ingredients:
      'Cocos Nucifera (Coconut) Oil, Argania Spinosa (Argan) Kernel Oil, Ricinus Communis (Castor) Seed Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Vitamin E Tocopherol, Lavandula Angustifolia (Lavender) Essential Oil.',
  },
  {
    id: 'hair-pack',
    name: 'Hair Pack',
    tagline: 'Deep conditioning mask for silky smooth hair',
    price: '₹399',
    originalPrice: '₹549',
    category: 'hair',
    image: 'https://placehold.co/600x600/A8C1A1/2E2A26?text=Hair+Pack',
    sizes: ['100g', '200g'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our Hair Pack is a luxurious deep conditioning treatment infused with natural clays and botanical oils to restore moisture, reduce frizz, and add brilliant shine.',
    howToUse:
      'Apply generously to damp hair from roots to tips. Leave on for 20–30 minutes. Rinse thoroughly with lukewarm water. For best results, use once a week after shampooing.',
    ingredients:
      'Aqua, Kaolin Clay, Butyrospermum Parkii (Shea) Butter, Aloe Barbadensis Leaf Juice, Hydrolyzed Keratin, Panthenol (Pro-Vitamin B5), Citric Acid, Phenoxyethanol.',
  },
  {
    id: 'face-pack',
    name: 'Face Pack',
    tagline: 'Brightening clay mask for radiant, clear skin',
    price: '₹349',
    originalPrice: '₹499',
    category: 'face',
    image: 'https://placehold.co/600x600/C97C5D/FAF6EE?text=Face+Pack',
    sizes: ['50g', '100g'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our Face Pack combines the purifying power of natural clays with the brightening effects of turmeric and vitamin C to give you clear, glowing skin.',
    howToUse:
      'Mix 1–2 teaspoons with rose water or plain water to form a smooth paste. Apply evenly to cleansed face. Leave for 15–20 minutes until partially dry. Rinse off with lukewarm water.',
    ingredients:
      'Kaolin Clay, Multani Mitti (Fuller\'s Earth), Curcuma Longa (Turmeric) Root Powder, Santalum Album (Sandalwood) Powder, Rosa Damascena (Rose) Petal Powder, Citrus Sinensis (Orange Peel) Powder.',
  },
  {
    id: 'face-serum',
    name: 'Face Serum',
    tagline: 'Hydrating vitamin-C serum for youthful glow',
    price: '₹599',
    originalPrice: '₹799',
    category: 'face',
    image: 'https://placehold.co/600x600/5A7453/FAF6EE?text=Face+Serum',
    sizes: ['15ml', '30ml'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our Face Serum is a potent blend of Vitamin C, hyaluronic acid, and plant extracts that work synergistically to brighten, hydrate, and firm your skin for a natural, youthful radiance.',
    howToUse:
      'After cleansing and toning, apply 3–4 drops to your face and neck. Gently press into skin using fingertips. Follow with your moisturizer. Use morning and evening for best results.',
    ingredients:
      'Aqua, Ascorbic Acid (Vitamin C), Sodium Hyaluronate, Niacinamide, Glycerin, Centella Asiatica Extract, Rosa Canina (Rosehip) Seed Oil, Allantoin, Citric Acid.',
  },
];
