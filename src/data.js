import { Leaf, Droplet, Sun, ShieldCheck, Truck, Star } from 'lucide-react';

// --- 1. Notification Bar ---
export const notifications = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "BUY 2 GET 1 FREE ON ALL OIL SHOTS",
  "100% NATURAL, CHEMICAL-FREE INGREDIENTS"
];

// --- 2. Hero Slider ---
export const heroSlides = [
  {
    id: 1,
    tag: "New Launch",
    title: "Rosemary Oil Shots",
    subtitle: "Visible Hair Growth in 4 Weeks",
    features: ["Precise 20% Dose", "Promotes hair follicle", "Fights hair thinning"],
    image: "https://www.brillare.co.in/cdn/shop/files/Rosemary-Oil-Shots-For-Visible-Hair-Growth-Front-1_360x.jpg?v=1706698662",
    bgColor: "bg-[#E8DFD6]",
    buttonText: "Shop Now"
  },
  {
    id: 2,
    tag: "Bestseller",
    title: "Vitamin C Face Serum",
    subtitle: "For Bright, Glowing Skin",
    features: ["10% Pure Vitamin C", "Reduces Pigmentation", "Boosts Collagen"],
    image: "https://www.brillare.co.in/cdn/shop/files/10_-Vitamin-C-Face-Serum-Front_360x.jpg?v=1706699151",
    bgColor: "bg-[#F3E9E2]",
    buttonText: "Explore Range"
  },
  {
    id: 3,
    tag: "Clinical Care",
    title: "Hair Fall Control",
    subtitle: "Reduces Hair Fall in 15 Days",
    features: ["Onion & Bakuchiol", "Strengthens Roots", "Zero Dilution"],
    image: "https://www.brillare.co.in/cdn/shop/files/Onion-Oil-Shots-For-Hair-Fall-Reduction-Front-1_360x.jpg?v=1706698468",
    bgColor: "bg-[#E0E6E1]",
    buttonText: "View Kit"
  }
];

// --- 3. Shop By Concern ---
export const concerns = [
  { title: "Hair Growth", image: "https://media.istockphoto.com/id/502624589/photo/long-straight-hair.jpg?s=612x612&w=0&k=20&c=ecp4gezSBSA9UBhV4kdasuXHtqn_msdM8-UMd1KmIp0=" },
  { title: "Hair Fall", image: "https://media.istockphoto.com/id/1345475766/photo/woman-have-damaged-and-broken-hair-loss-hair-dry-problem-concept.jpg?s=612x612&w=0&k=20&c=4Yzv2YXMKWkzfFsSmSPuEcFup3MvH4oJzhLYevKv8m8=" },
  { title: "Dandruff", image: "https://truedermasa.com/cdn/shop/articles/How-to-Use-Serum-on-Hair-What-Are-the-Benefits-Tips-by-true-derma.jpg?v=1728374619" },
  { title: "Dry & Damaged", image: "https://media.istockphoto.com/id/1345845425/photo/young-woman-hair-care-stock-photo.jpg?s=612x612&w=0&k=20&c=uH3NHZRAmB0iHkP5puQsBe9E-1ZZRXXHjmniqQ5RO8o=" },
  { title: "Pigmentation", image: "https://media.istockphoto.com/id/1535891417/photo/cosmetics-skin-care-concept-photo-of-close-up-woman-perfect-face-with-hydrated-skin.jpg?s=612x612&w=0&k=20&c=rFREkDzzwrVEc4jT5atDz-LG3emqp_8QAB1qwscP3G0=" },
  { title: "Acne Control", image: "https://media.istockphoto.com/id/1341830352/photo/shot-of-a-young-woman-washing-her-face-in-her-bathroom.jpg?s=612x612&w=0&k=20&c=nqf2-82oiu7AJyBmZJBiFWYcv1nIYM7dcbLeMN7MLMI=" },
];

// --- 5. Ingredient Spotlight (Static) ---
export const ingredients = [
  {
    id: 'rosemary',
    name: 'Rosemary',
    iconName: 'Leaf',
    title: 'The Hair Growth Powerhouse',
    desc: 'Clinically proven to block DHT and stimulate hair follicles.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    stats: ['Blocks DHT', 'Boosts Circulation', 'Strengthens Roots']
  },
  {
    id: 'vitaminc',
    name: 'Vitamin C',
    iconName: 'Sun',
    title: 'The Glow Booster',
    desc: 'Neutralizes free radicals, reduces pigmentation, and boosts collagen.',
    image: 'https://media.istockphoto.com/id/2262619554/photo/dropper-bottle-creating-shadow-on-wooden-table.jpg?s=612x612&w=0&k=20&c=sDTvOUMsRfEo-ViLldEedt49jP0IsAoYAVPL7xHmQXc=',
    stats: ['Brightens Skin', 'Fades Spots', 'Anti-Aging']
  },
  {
    id: 'teatree',
    name: 'Tea Tree',
    iconName: 'Droplet',
    title: 'The Dandruff Killer',
    desc: 'Eliminates dandruff-causing fungus and soothes itchy scalps.',
    image: 'https://media.istockphoto.com/id/612374040/vector/essential-oil-ad-template.jpg?s=612x612&w=0&k=20&c=niiNG2U3lhqPIbI7_fy9DarJjhx-xyPq-TywnArOw94=',
    stats: ['Anti-Fungal', 'Soothes Itch', 'Clears Scalp']
  }
];

// --- 6. Bundles (Static for Homepage) ---
export const bundles = [
  {
    id: 1,
    title: "Hair Growth Bundle",
    subtitle: "The ultimate 3-step ritual to stop hair fall and boost new growth.",
    badge: "Best Seller",
    badgeColor: "text-brand-gold",
    saveTag: "Save 25%",
    image: "https://images.unsplash.com/photo-1556228578-8d8448ad1d4d?auto=format&fit=crop&w=800&q=80",
    price: 2385,
    items: [
      { name: "Rosemary Oil Shots", size: "48ml", price: "₹795", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=100" },
      { name: "Rosemary Shampoo", size: "200ml", price: "₹595", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=100" },
      { name: "Scalp Serum", size: "30ml", price: "₹995", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100" }
    ]
  },
  {
    id: 2,
    title: "Brightening Bundle",
    subtitle: "Get glowing, even-toned skin with pure Vitamin C.",
    badge: "New Launch",
    badgeColor: "text-brand-gold",
    saveTag: "Save 30%",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
    price: 2085,
    items: [
      { name: "Vitamin C Face Wash", size: "100ml", price: "₹495", img: "https://images.unsplash.com/photo-1556228720-191738e4a2e5?w=100" },
      { name: "10% Vitamin C Serum", size: "30ml", price: "₹895", img: "https://images.unsplash.com/photo-1556228578-8d8448ad1d4d?w=100" },
      { name: "Liquid Moisturizer", size: "50ml", price: "₹695", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100" }
    ]
  }
];

// --- 7. Reviews ---
export const reviews = [
  { name: "Priyanshi Y.", title: "It's really worth hype", body: "My over all experience is so good", product: "Rosemary Oil Shots" },
  { name: "Aditya S.", title: "Oil shots review", body: "It really helped decreasing significant dandruff from my scalp", product: "Tea Tree Oil" },
  { name: "Dhanraj V.", title: "A great bodywash", body: "It has a rich, creamy consistency that feels more like a lotion than a soap.", product: "Lavender Body Wash" }
];

export const pressLogos = [
  { name: "FEMINA", style: "font-serif font-bold" },
  { name: "GRAZIA", style: "font-serif font-bold" },
  { name: "VOGUE", style: "font-serif font-bold italic" },
  { name: "ELLE", style: "font-serif font-bold" },
  { name: "COSMOPOLITAN", style: "font-sans font-bold" },
  { name: "HARPERS BAZAAR", style: "font-serif font-bold" }
];

// --- 8. Blog ---
export const blogArticles = [
  {
    id: 1,
    title: "Why Rosemary is Better Than Minoxidil for Hair Growth",
    category: "Hair Science",
    date: "Feb 18, 2026",
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Understanding the Skin Cycling Routine for Acne",
    category: "Skincare 101",
    date: "Feb 10, 2026",
    image: "https://media.istockphoto.com/id/1058385164/photo/relaxed-woman-applying-moisturizer-cream-in-cheek.jpg?s=612x612&w=0&k=20&c=u1Rg-nBP7pd-PnkY6NprUkYdlvo4wDUQ37f6UPLujtw="
  },
  {
    id: 3,
    title: "The Truth About Sulfates and Parabens",
    category: "Ingredients",
    date: "Jan 28, 2026",
    image: "data:image/jpeg;base64,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"
  }
];

// --- 9. FAQs ---
export const faqs = [
  { q: "Are your products truly 100% natural?", a: "Yes. We promise Zero Dilution." },
  { q: "How long does it take to see results?", a: "Visible results in 2-4 weeks." },
  { q: "Is the Vitamin C serum safe?", a: "Absolutely. Potent yet gentle." },
];

// --- 10. Ritual Kits ---
export const ritualKits = [
  {
    title: "Ultimate Rosemary Hair Growth Kit",
    price: "₹2,385",
    mrp: "₹3,180",
    image: "https://images.unsplash.com/photo-1556228578-8d8448ad1d4d?auto=format&fit=crop&w=600&q=80",
    save: "Save 25%"
  },
  {
    title: "Complete Hair Fall Control Kit",
    price: "₹1,599",
    mrp: "₹2,285",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80",
    save: "Save 30%"
  }
];