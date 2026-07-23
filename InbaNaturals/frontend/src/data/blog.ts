import clayImg from '../assets/images/blogs/clay.jpg';
import hairoilImg from '../assets/images/blogs/hairoil.png';
import morningglowImg from '../assets/images/blogs/morningglow.jpg';
import rosemeryImg from '../assets/images/blogs/rosemery.jpg';
import serumImg from '../assets/images/blogs/serum.jpg';
import weekendImg from '../assets/images/blogs/weekend.jpg';

export interface BlogPost {
  id: string;
  title: string;
  category: 'Hair Care' | 'Skin Care' | 'Wellness';
  excerpt: string;
  image: string;
  author: string;
  date: string;
  body: string[];
  pullQuote?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '5-benefits-natural-hair-oil',
    title: '5 Benefits of Natural Hair Oil You Need to Know',
    category: 'Hair Care',
    excerpt: 'Discover why switching to a natural botanical hair oil can restore deep hydration, reduce hair fall, and add a brilliant natural shine to your hair.',
    image: hairoilImg,
    author: 'Ananya Founder',
    date: 'July 10, 2026',
    body: [
      'For centuries, botanical hair oils have been used as a foundational hair ritual. Modern hair care is full of synthetics, silicones, and synthetic coatings that provide short-term slip but long-term build-up. Making the switch to a botanical formulation can restore hair at a cellular level.',
      'As you can see from our rich golden blend, one of the principal benefits of botanical oils is deep hydration. Unlike synthetic silicone oils, natural oils like cold-pressed coconut, argan, and castor oils possess fatty acids that penetrate deep into the hair shaft, repairing damage from styling and UV exposure.',
      'Additionally, natural oils support scalp health. Regular massage stimulates blood circulation, bringing vital nutrients to hair follicles. Botanical extracts like rosemary and tea tree offer mild antimicrobial benefits, keeping dandruff and dry scalp flakes at bay.',
      'Regular oiling acts as a protective shield against styling heat and environmental pollution. By sealing the outer cuticle layer, natural hair oils prevent frizz and moisture loss during humid summer days.',
    ],
    pullQuote: 'A healthy scalp is the soil from which beautiful, lustrous hair grows. Feed it with pure botanical goodness.',
  },
  {
    id: 'ayurvedic-clay-skincare-guide',
    title: 'Ayurvedic Clay: The Ultimate Purifying Facial Treatment',
    category: 'Skin Care',
    excerpt: 'Ayurvedic clays like Multani Mitti and Kaolin have been used for centuries to detoxify skin, balance excess sebum, and reveal a clear glow.',
    image: clayImg,
    author: 'Ananya Founder',
    date: 'June 28, 2026',
    body: [
      'In a world full of chemical peels and active serums, the gentle, earthy touch of natural clays remains one of the most effective ways to detoxify the skin. Ancient Ayurvedic texts detail the purifying benefits of earth clays for pulling impurities out of pores.',
      'Multani Mitti (Fuller\'s Earth) is renowned for its outstanding oil-absorbing properties, making it the perfect remedy for acne-prone skin. As pictured, this earthy powder gently draws out blackheads, sebum, and micro-particles, reducing acne triggers naturally.',
      'Kaolin clay is much gentler, making it perfect for sensitive or dry skin. It mildly exfoliates the skin surface, removing dead skin cells without stripping natural hydration. When paired with botanical powders like sandalwood and orange peel, clay masks brighten skin tone instantly.',
      'For best results, mix clay face packs with organic rose water, raw honey, or plain yogurt to create a smooth, rich paste. This customizes the pack for your unique skin needs, leaving it clear, soft, and beautifully glowing.',
    ],
    pullQuote: 'Earthy clays offer a natural suction effect, cleansing your pores deeply without stripping the skin\'s natural hydration barrier.',
  },
  {
    id: 'skincare-serums-demystified',
    title: 'Skincare Serums Demystified: Vitamin C vs Hyaluronic Acid',
    category: 'Skin Care',
    excerpt: 'Unsure how to choose or layer skincare serums? Learn how Vitamin C and Hyaluronic Acid work together to build bright, youthful skin.',
    image: serumImg,
    author: 'Dr. Shruti Sharma',
    date: 'June 15, 2026',
    body: [
      'Active face serums are the concentrated powerhouses of any skincare routine. Because their molecules are smaller than those of traditional moisturizers, these beautiful, lightweight elixirs penetrate deeper into the skin layers to deliver target ingredients.',
      'Vitamin C is a legendary antioxidant that protects skin cells from free radical damage, builds collagen, and brightens dark spots. When used consistently in the morning, it acts as a secondary layer of defense against sun damage.',
      'Hyaluronic Acid is the ultimate hydration molecule, capable of holding up to 1000 times its weight in water. It binds moisture to the skin surface, instantly plumping fine lines and calming redness.',
      'For maximum benefits, layer them! Apply a few drops of Vitamin C first on clean dry skin, follow with Hyaluronic Acid for deep moisture lock, and finish with a botanical moisturizer to seal the active ingredients in place.',
    ],
    pullQuote: 'Serums do the heavy lifting in skincare. Combining antioxidants and humectants is the key to a youthful, natural glow.',
  },
  {
    id: 'rosemary-oil-hair-growth',
    title: 'Rosemary Oil: The Miracle Herb for Hair Density',
    category: 'Hair Care',
    excerpt: 'Clinical research shows rosemary extract can be as effective as standard treatments for increasing hair density. Learn how to use it safely.',
    image: rosemeryImg,
    author: 'Dr. Shruti Sharma',
    date: 'June 02, 2026',
    body: [
      'Rosemary (Rosmarinus Officinalis) has taken the beauty community by storm. While it feels like a modern trend, these fragrant green sprigs have been utilized in hair washes for centuries across Mediterranean cultures to combat thinning.',
      'Scientific studies show that rosemary leaf oil improves cellular regeneration and micro-capillary circulation in the scalp. This brings fresh oxygen and nutrients to dormant hair follicles, encouraging new growth.',
      'Because pure rosemary essential oil is highly concentrated, it must always be diluted. We blend therapeutic-grade rosemary extract with cold-pressed carrier oils like coconut and argan to ensure safe, irritation-free scalp application.',
    ],
    pullQuote: 'Rosemary extract stimulates the hair roots directly, revitalizing thinning strands and promoting healthy, dense hair growth.',
  },
  {
    id: 'diy-botanical-weekend-rituals',
    title: 'DIY Botanical Weekend Rituals for Slow Beauty',
    category: 'Wellness',
    excerpt: 'Slow down and treat yourself to a restorative weekend beauty ritual. Try these simple, relaxing plant-based self-care ideas.',
    image: weekendImg,
    author: 'Ananya Founder',
    date: 'May 20, 2026',
    body: [
      'Self-care is not about quick fixes; it is a ritual of slowing down. Weekend beauty rituals allow you to reconnect with your body and mind, creating moments of peace using natural ingredients to restore skin and hair balance.',
      'Start your ritual by clearing your space, bringing in some fresh florals, and lighting a natural beeswax candle. Warm some botanical hair oil between your palms and massage it slowly into your scalp, leaving it to deeply condition your locks.',
      'While the oil works, mix your face pack with rose water and apply it to your face. Close your eyes, lay back with cucumber slices over your eyelids, and let the soothing botanical clays absorb oil and calm your skin.',
    ],
    pullQuote: 'Slow beauty is a mindfulness practice. It is about honouring your body with natural ingredients and taking time for yourself.',
  },
  {
    id: 'morning-skincare-routine-glow',
    title: 'The Perfect 4-Step Morning Routine for Radiant Skin',
    category: 'Skin Care',
    excerpt: 'Start your day with a simple morning routine designed to protect, hydrate, and maintain your skin\'s natural glow all day.',
    image: morningglowImg,
    author: 'Ananya Founder',
    date: 'May 05, 2026',
    body: [
      'A morning routine is all about defense and protection. During the day, your skin is exposed to UV rays, pollution, and climate shifts. Waking up to fresh light and our simple 4-step routine is designed to prepare your skin barrier for the day ahead.',
      'Step 1 is a gentle cleanse. Use lukewarm water and a soap-free cleanser to wash away night residue without stripping natural lipids. Step 2 is a botanical toner to balance skin pH and hydrate.',
      'Step 3 is applying a concentrated Vitamin C and Hyaluronic Acid serum to brighten and plump. Step 4 is sealing everything with a lightweight moisturizer, followed by SPF protection to keep that gorgeous morning glow intact.',
    ],
  },
];
