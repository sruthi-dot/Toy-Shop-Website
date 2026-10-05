export type AgeGroup = 'all' | '0-2' | '3-5' | '6-8' | '9+';
export type ToyCategory = 'all' | 'Wooden Architecture' | 'Kinetic & STEM' | 'Soft Companions' | 'Wooden Vehicles';
export type PlaySkill = 'Spatial Reasoning' | 'Fine Motor' | 'Imaginative Storytelling' | 'Mechanical Cause & Effect';

export interface ProductVariant {
  id: string;
  name: string;
  finishNote: string;
  priceDelta: number;
}

export interface ToyProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<ToyCategory, 'all'>;
  ageGroup: Exclude<AgeGroup, 'all'>;
  ageLabel: string;
  price: number;
  rating: number;
  reviewCount: number;
  stockStatus: 'In Stock' | 'Limited Batch';
  stockCount: number;
  image: string;
  fallbackType: 'train' | 'blocks' | 'fox' | 'orrery' | 'loom' | 'glider';
  materials: string;
  dimensions: string;
  weight: string;
  safetyStandard: string;
  origin: string;
  playSkills: PlaySkill[];
  description: string;
  includedItems: string[];
  careInstructions: string;
  variants: ProductVariant[];
}

export interface CartItem {
  product: ToyProduct;
  variant: ProductVariant;
  quantity: number;
  giftWrap: boolean;
  giftNote?: string;
}

export interface OrderReceipt {
  orderNumber: string;
  placedAt: string;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'Card Checkout' | 'Cash on Delivery (COD)';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  giftWrapTotal: number;
  total: number;
}

export const HERO_IMAGE = '/src/assets/images/hero_wooden_toy_atelier_1791181839878.jpg';

export const TOY_CATALOG: ToyProduct[] = [
  {
    id: 'nordic-magnetic-express',
    sku: 'KK-TRN-01',
    name: 'Luleå Modular Beechwood Train',
    subtitle: 'Four-car magnetic freight & locomotive system with solid brass axles',
    category: 'Wooden Vehicles',
    ageGroup: '3-5',
    ageLabel: 'Ages 3–5 yrs',
    price: 78,
    rating: 4.9,
    reviewCount: 142,
    stockStatus: 'In Stock',
    stockCount: 18,
    image: '/src/assets/images/toy_modular_wooden_train_1791181853472.jpg',
    fallbackType: 'train',
    materials: 'FSC-certified European steamed beechwood, American black walnut, raw solid brass axles, encapsulated neodymium magnets',
    dimensions: '42.0 × 6.5 × 8.2 cm (coupled)',
    weight: '680 g',
    safetyStandard: 'EN71-1/2/3 & ASTM F963 Certified Non-Toxic',
    origin: 'Turned & finished in Dalarna, Sweden',
    playSkills: ['Mechanical Cause & Effect', 'Fine Motor', 'Imaginative Storytelling'],
    description:
      'Designed without fixed front-or-back orientation, the Luleå Modular Train invites children to assemble locomotives, timber flatbeds, and geometric cargo cars in any sequence. Hidden polarity-matched magnets click together with a satisfying tactile snap while precision brass axles glide effortlessly across hardwood or rug terrain.',
    includedItems: [
      '1 Steamed Beechwood Locomotive Engine',
      '2 Modular Flatbed Chassis with Brass Couplers',
      '6 Interchangeable Walnut & Maple Cargo Blocks',
      'Organic Cotton Drawstring Storage Sack'
    ],
    careInstructions: 'Wipe clean with a damp linen cloth. Recondition annually with food-grade beeswax or jojoba oil.',
    variants: [
      { id: 'natural-walnut', name: 'Raw Beech & Walnut', finishNote: 'Beeswax hand-rubbed finish', priceDelta: 0 },
      { id: 'cobalt-collector', name: 'Atelier Cobalt Edition', finishNote: 'Mineral pigment accents + engraved number', priceDelta: 14 }
    ]
  },
  {
    id: 'bauhaus-arch-stacker',
    sku: 'KK-ARC-02',
    name: 'Weimar Architectural Arch & Block Set',
    subtitle: '28-piece counterbalance geometry and colonnade building system',
    category: 'Wooden Architecture',
    ageGroup: '3-5',
    ageLabel: 'Ages 3–5 yrs',
    price: 94,
    rating: 5.0,
    reviewCount: 98,
    stockStatus: 'In Stock',
    stockCount: 11,
    image: '/src/assets/images/toy_bauhaus_arch_stacker_1791181864738.jpg',
    fallbackType: 'blocks',
    materials: 'Kiln-dried hard rock maple, plant-derived water-based mineral stains (ultramarine, ochre, sage)',
    dimensions: '28.0 × 28.0 × 5.5 cm (in dovetail tray)',
    weight: '1,420 g',
    safetyStandard: 'EN71-3 Saliva-Resistant & Zero-VOC Certified',
    origin: 'Hand-sanded in Black Forest, Germany',
    playSkills: ['Spatial Reasoning', 'Fine Motor', 'Mechanical Cause & Effect'],
    description:
      'Inspired by early twentieth-century architectural study models, the Weimar Arch Set pairs nested Romanesque curves with counterweighted pillars and lintels. Left intentionally un-varnished to preserve the natural velvet tooth of rock maple, pieces grip one another at daring angles for bridges, amphitheaters, and aqueducts.',
    includedItems: [
      '8 Nested Concentric Maple Arches',
      '12 Modular Columns & Cantilever Beams',
      '8 Geometric Counterweight Prisms',
      'Finger-Jointed Birch Presentation Tray'
    ],
    careInstructions: 'Dry brush dust from crevices. Do not submerge in water, as natural wood grain will raise.',
    variants: [
      { id: 'mineral-triad', name: 'Mineral Pigments', finishNote: 'Cobalt, Ochre & Sage water-stain', priceDelta: 0 },
      { id: 'monochrome-maple', name: 'Unstained Raw Maple', finishNote: 'Pure natural grain study', priceDelta: -6 }
    ]
  },
  {
    id: 'fable-linen-woodland-fox',
    sku: 'KK-SFT-03',
    name: 'Sylvan Heirloom Quilted Linen Fox',
    subtitle: 'Weighted organic Belgian flax companion with removable merino scarf',
    category: 'Soft Companions',
    ageGroup: '0-2',
    ageLabel: 'Ages 0–2 yrs',
    price: 62,
    rating: 4.9,
    reviewCount: 215,
    stockStatus: 'In Stock',
    stockCount: 24,
    image: '/src/assets/images/toy_linen_forest_fox_1791181875089.jpg',
    fallbackType: 'fox',
    materials: '100% OEKO-TEX Belgian flax linen, carded Alpine sheep wool stuffing, hand-knitted extra-fine merino scarf',
    dimensions: '34.0 × 14.0 × 9.5 cm',
    weight: '310 g',
    safetyStandard: 'GOTS Organic & EN71 Infant Safe (Embroidered Eyes)',
    origin: 'Sewn in small batches in Vilnius, Lithuania',
    playSkills: ['Imaginative Storytelling', 'Fine Motor'],
    description:
      'Crafted with zero plastic fibers or synthetic foam, our Sylvan Fox warms quickly to a child’s touch because its core is filled with pure carded Alpine wool that naturally absorbs familiar home scents. Articulated gusseted limbs allow the fox to sit upright at tea tables or curl snugly into a stroller pocket.',
    includedItems: [
      '1 Sylvan Quilted Linen Fox Companion',
      '1 Removable Hand-Knit Ochre Merino Scarf',
      'numbered Heirloom Birth Certificate Card'
    ],
    careInstructions: 'Spot clean or hand wash cold in wool wash; press in towel and dry flat away from direct heat.',
    variants: [
      { id: 'ochre-scarf', name: 'Harvest Ochre Scarf', finishNote: 'Rust linen with golden merino knit', priceDelta: 0 },
      { id: 'cobalt-scarf', name: 'Winter Ultramarine Scarf', finishNote: 'Rust linen with deep blue merino knit', priceDelta: 4 }
    ]
  },
  {
    id: 'kepler-brass-planetary-orrery',
    sku: 'KK-STM-04',
    name: 'Kepler Mechanical Brass & Wood Orrery Kit',
    subtitle: 'Hand-cranked gear train solar system assembly for young astronomers',
    category: 'Kinetic & STEM',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8 yrs',
    price: 128,
    rating: 4.9,
    reviewCount: 76,
    stockStatus: 'Limited Batch',
    stockCount: 5,
    image: '/src/assets/images/toy_planetary_brass_orrery_1791181884839.jpg',
    fallbackType: 'orrery',
    materials: 'Precision-milled birch plywood gears, turned hornbeam spheres, solid brushed brass shafts',
    dimensions: '31.0 × 31.0 × 22.5 cm (assembled)',
    weight: '940 g',
    safetyStandard: 'EN71 & CE Mechanical Toy Certified (No Glue Required)',
    origin: 'Engineered in Zurich, Switzerland',
    playSkills: ['Mechanical Cause & Effect', 'Spatial Reasoning', 'Fine Motor'],
    description:
      'A real working planetary gear reduction table built by children’s own hands—without a single drop of glue or solder. As young builders slot the birchwood spur gears onto solid brass arbors, they witness how compound gear ratios translate a single turn of the ashwood crank into the distinct orbital speeds of Mercury, Venus, Earth, and Mars.',
    includedItems: [
      '42 Precision-Cut Birchwood Gear & Frame Components',
      '8 Hand-Painted Mineral Tone Planetary Spheres',
      '9 Solid Brass Axles & Knurled Thumb Nuts',
      'Illustrated 36-Page Field Guide to Celestial Mechanics'
    ],
    careInstructions: 'Lubricate wooden gear teeth sparingly with dry graphite pencil lead if friction increases over years of use.',
    variants: [
      { id: 'inner-planets', name: 'Standard 4-Planet Gear Train', finishNote: 'Mercury through Mars + Moon', priceDelta: 0 },
      { id: 'grand-orrery', name: 'Grand 8-Planet Observatory', finishNote: 'Includes outer gas giants & brass ring Saturn', priceDelta: 36 }
    ]
  },
  {
    id: 'soro-botanical-weaving-loom',
    sku: 'KK-STM-05',
    name: 'Sorø Tabletop Tapestry & Botanical Loom',
    subtitle: 'Pre-warped solid ash frame loom with plant-dyed merino roving',
    category: 'Kinetic & STEM',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8 yrs',
    price: 68,
    rating: 4.8,
    reviewCount: 64,
    stockStatus: 'In Stock',
    stockCount: 15,
    image: '/src/assets/images/toy_bauhaus_arch_stacker_1791181864738.jpg',
    fallbackType: 'loom',
    materials: 'European white ash frame, cherrywood shuttles, madder & indigo dyed Norwegian wool yarn',
    dimensions: '36.0 × 26.0 × 4.0 cm',
    weight: '520 g',
    safetyStandard: 'EN71 Certified & OEKO-TEX Standard 100 Yarns',
    origin: 'Crafted in Aarhus, Denmark',
    playSkills: ['Fine Motor', 'Spatial Reasoning', 'Imaginative Storytelling'],
    description:
      'Designed with a rotating heddle bar that separates warp threads in a single twist, the Sorø Loom removes the frustration of tangles while teaching true over-under textile engineering. Children weave wall hangings, doll blankets, or dried meadow grasses directly into their wool tapestries.',
    includedItems: [
      '1 Solid White Ash Frame Loom with Rotating Heddle',
      '2 Hand-Polished Cherrywood Shuttles & Comb',
      '5 Skeins of Botanical-Dyed Norwegian Wool (180m total)',
      ' Brass Hanging Dowel & Pattern Primer'
    ],
    careInstructions: 'Frame may be wiped dry. Refill yarn bundles available year-round.',
    variants: [
      { id: 'meadow-palette', name: 'Nordic Meadow Skeins', finishNote: 'Sage, Ochre, Raw Cream & Indigo', priceDelta: 0 },
      { id: 'fjord-palette', name: 'Maritime Fjord Skeins', finishNote: 'Cobalt, Slate, Terracotta & Birch', priceDelta: 0 }
    ]
  },
  {
    id: 'aalto-kinetic-balance-glider',
    sku: 'KK-ARC-06',
    name: 'Aalto Counterweight Pendulum Glider',
    subtitle: 'Zero-gravity wooden bird mobile & desk equilibrium sculpture',
    category: 'Wooden Architecture',
    ageGroup: '9+',
    ageLabel: 'Ages 9+ yrs',
    price: 84,
    rating: 4.9,
    reviewCount: 89,
    stockStatus: 'Limited Batch',
    stockCount: 7,
    image: '/src/assets/images/toy_planetary_brass_orrery_1791181884839.jpg',
    fallbackType: 'glider',
    materials: 'Steam-bent Finnish birch veneer, turned brass counterweights, oiled walnut fulcrum pedestal',
    dimensions: '48.0 × 34.0 × 29.0 cm',
    weight: '460 g',
    safetyStandard: 'EN71 Certified Collector & Educational Kinetic Object',
    origin: 'Steam-bent in Jyväskylä, Finland',
    playSkills: ['Mechanical Cause & Effect', 'Spatial Reasoning'],
    description:
      'Resting by the tip of its brass beak on a narrow walnut spire, the Aalto Glider demonstrates center-of-mass physics in hypnotic slow motion. Adjusting the sliding brass wing weights alters the bird’s wingbeat period from a brisk 2-second oscillation to a 9-second banking glide.',
    includedItems: [
      '1 Steam-Bent Birch Wing Assembly',
      '2 Sliding Knurled Brass Wing Counterweights',
      '1 Turned Black Walnut Pedestal Spire',
      'Physics Equilibrium Experiment Cards'
    ],
    careInstructions: 'Keep brass contact point clean and dry for frictionless oscillation.',
    variants: [
      { id: 'natural-birch', name: 'Natural Birch & Brass', finishNote: 'Classic architectural finish', priceDelta: 0 },
      { id: 'smoked-oak', name: 'Smoked Oak & Brass', finishNote: 'Deep ebonized timber finish', priceDelta: 12 }
    ]
  }
];

export interface GiftRecommendationReason {
  ageMatch: string;
  skillFocus: string;
  longevityNote: string;
}
