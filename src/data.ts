export interface FabricOption {
  id: string;
  name: string;
  type: 'top' | 'backing';
  material: string;
  description: string;
  colorHex: string;
  imageUrl?: string;   // Image URL for realistic pattern card preview
  patternUrl?: string; // Optional SVG pattern representation
  premium: number;     // Extra cost modifier
  properties: string[]; // e.g., ["Breathable", "Stay-dry", "Hypoallergenic"]
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  category?: string;
  hidden?: boolean;
}

export interface SizeOption {
  id: string;
  name: string;
  lengthInches: number;
  widthCm: number;
  description: string;
  priceBase: number;
  bestFor: string;
  colorLabel?: string;
  minLength: number;
  maxLength: number;
}
export interface ShapeOption {
  id: string;
  name: string;
  description: string;
  minLength?: number;
  maxLength?: number;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'moon_rise', name: 'MoonRise - (6-18)', description: 'Elegant contoured hourglass waist with centered wings. Outstanding daily comfort and fit.', minLength: 6, maxLength: 18 },
  { id: 'sunglow', name: 'SunGlow - (6-20)', description: 'Symmetric flared ends for wider coverage at both the front and back, with centered snug wings.', minLength: 6, maxLength: 20 },
  { id: 'staple', name: 'Staple - (7-18)', description: 'Standard straight sides with clean rounded ends. A tidy, classic, and reliable classic shape.', minLength: 7, maxLength: 18 },
  { id: 'mega_pad', name: 'MegaPad - (15-20)', description: 'Asymmetric shape featuring an extra-wide flared back panel, perfect for overnight flow and sleep safety.', minLength: 15, maxLength: 20 }
];

export interface AbsorbencyOption {
  id: string;
  name: string;
  coreLayers: number;
  description: string;
  icon: string;
  priceModifier: number;
  capacityMl: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    description?: string;
    points: {
      size?: string;
      absorbency?: string;
      fabricTop?: string;
    };
  }[];
}

export const SIZE_OPTIONS: SizeOption[] = [
  {
    id: 'liner',
    name: 'Liner',
    lengthInches: 6,
    widthCm: 15,
    description: 'Perfect for spotting, daily freshness, very light flow, or cup backup.',
    priceBase: 5.50,
    bestFor: "A simple place to begin if you’re new to reusable pads.",
    colorLabel: 'emerald',
    minLength: 6,
    maxLength: 9
  },
  {
    id: 'light',
    name: 'Light',
    lengthInches: 8,
    widthCm: 18,
    description: 'Daily pad ideal for initial or concluding light cycle flow.',
    priceBase: 8.00,
    bestFor: 'Light flow days',
    colorLabel: 'rose',
    minLength: 8,
    maxLength: 12
  },
  {
    id: 'moderate',
    name: 'Moderate',
    lengthInches: 10,
    widthCm: 20,
    description: 'Standard daily pad ideal for moderate flow with reliable core.',
    priceBase: 11.00,
    bestFor: 'Medium cycles, daytime',
    colorLabel: 'amber',
    minLength: 10,
    maxLength: 14
  },
  {
    id: 'heavy',
    name: 'Heavy',
    lengthInches: 12,
    widthCm: 22,
    description: 'Thick heavy flow support, secure daytime or bedtime coverage.',
    priceBase: 14.00,
    bestFor: 'Active heavy flow days',
    colorLabel: 'purple',
    minLength: 10,
    maxLength: 14
  },
  {
    id: 'extra_long',
    name: 'Extra Long',
    lengthInches: 15,
    widthCm: 25,
    description: 'Extra long coverage that scales dynamically by inch.',
    priceBase: 15.00,
    bestFor: 'Overnight sleep & maximum coverage',
    colorLabel: 'blue',
    minLength: 15,
    maxLength: 20
  }
];

export const ABSORBENCY_OPTIONS: AbsorbencyOption[] = [
  {
    id: 'standard',
    name: 'Standard core',
    coreLayers: 1,
    description: 'Sleek, low-profile and lightweight cotton core.',
    icon: 'droplet',
    priceModifier: 0.00,
    capacityMl: 10
  },
  {
    id: 'moderate',
    name: 'Moderate dry',
    coreLayers: 2,
    description: 'Dual layer high-absorption bamboo fleece loop channels.',
    icon: 'droplets',
    priceModifier: 1.50,
    capacityMl: 25
  },
  {
    id: 'heavy',
    name: 'Heavy absorbency',
    coreLayers: 3,
    description: 'Triple core layers plus breathable leakproof backing laminate.',
    icon: 'droplets-3',
    priceModifier: 3.00,
    capacityMl: 45
  },
  {
    id: 'super',
    name: 'Super defense',
    coreLayers: 4,
    description: 'Four heavy-duty premium hemp-bamboo blend absorbers.',
    icon: 'shield',
    priceModifier: 4.50,
    capacityMl: 70
  }
];

export const FABRICS_TOP: FabricOption[] = [
  {
    id: 'sunglow',
    name: 'Sunglow Floral',
    type: 'top',
    material: 'Organic cotton',
    description: 'Bright mustard organic cotton floral print.',
    colorHex: '#eac06a',
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&w=400&q=80',
    premium: 0.00,
    properties: ['Ultra-soft Cotton', 'High Breathability', 'No migration'],
    stockStatus: 'in_stock',
    category: 'Flowers'
  },
  {
    id: 'moonrise',
    name: 'Moonrise Indigo',
    type: 'top',
    material: 'Astrological organic knit',
    description: 'Deep navy-blue star and moon motif organic knit.',
    colorHex: '#252e46',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    premium: 0.00,
    properties: ['Anti-pill knit', 'Stain-hiding tone', 'Soothing feel'],
    stockStatus: 'low_stock',
    category: 'Characters'
  },
  {
    id: 'lilac',
    name: 'Lilac Breeze',
    type: 'top',
    material: 'Bamboo velour wash feel',
    description: 'Soft lavender watercolor wash print.',
    colorHex: '#c7bcdf',
    imageUrl: 'https://images.unsplash.com/photo-1550524514-497952e84181?auto=format&fit=crop&w=400&q=80',
    premium: 0.00,
    properties: ['Cooling touch', 'Luxurious feel', 'Stain-resistant'],
    stockStatus: 'in_stock',
    category: 'Flowers'
  },
  {
    id: 'sage',
    name: 'Sage Meadow Rose',
    type: 'top',
    material: 'Premium unbleached flannel',
    description: 'Whispering sage green with soft wild floral rose outlines.',
    colorHex: '#7f9382',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    premium: 0.00,
    properties: ['Earthy organic', 'Flannel grip', 'Hypoallergenic'],
    stockStatus: 'in_stock',
    category: 'Flowers'
  }
];

export const FABRICS_BACKING: FabricOption[] = [
  {
    id: 'organic-cotton',
    name: 'Unbleached Organic Cotton',
    type: 'backing',
    material: 'Solid Organic Cotton Duck Canvas',
    description: 'Extremely slip-resistant raw textured finish keeping pads securely nested inside underwear.',
    colorHex: '#ece2cc',
    premium: 0.00,
    properties: ['Max Slip Resistance', 'Deconstructed Earth' ],
    stockStatus: 'in_stock'
  },
  {
    id: 'waterproof-pul',
    name: 'Leakproof Breathable PUL',
    type: 'backing',
    material: 'Polyurethane Laminate layer',
    description: 'Quiet, heavy-duty liquid leak barriers that prevent spills while permitting steam to dissipate.',
    colorHex: '#6d8374',
    premium: 1.50,
    properties: ['100% Water-repelled', 'No-sweat design'],
    stockStatus: 'in_stock'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'flow-intensity',
    question: "What is your typical flow intensity on your heaviest cycle day?",
    description: "This helps us calculate the ideal number of microfiber bamboo absorbent core layers.",
    options: [
      {
        text: "Very light / spotty backup",
        description: "Mostly pantiliners or backup for menstrual cups",
        points: { size: 'liner', absorbency: 'standard' }
      },
      {
        text: "Moderate / Standard daytime cycles",
        description: "Need reliable coverage without feeling heavy bulk",
        points: { size: 'moderate', absorbency: 'moderate' }
      },
      {
        text: "Heavy / Full saturation risk",
        description: "Frequent trips to restrooms on Day 1 or Day 2",
        points: { size: 'heavy', absorbency: 'heavy' }
      },
      {
        text: "Maximum capacity postpartum or sleeping care",
        description: "Need worry-free overnight confidence with zero bleed-throughs",
        points: { size: 'extra_long', absorbency: 'super' }
      }
    ]
  },
  {
    id: 'raw-sensitivity',
    question: "How would you describe your intimate skin sensitivity level?",
    description: "Determines the perfect top layer fabrics closest to your anatomy.",
    options: [
      {
        text: "High concern (eczema, raw rubbing, or itching)",
        description: "We highly recommend unbleached, raw botanical flannel or soft natural velour",
        points: { fabricTop: 'sunglow' }
      },
      {
        text: "Normal sweat sensitivity during humid summers",
        description: "Soothe your skin with highly breathable or cooling bamboo velour blends",
        points: { fabricTop: 'lilac' }
      },
      {
        text: "Hate seeing stains / Love dark, stress-free maintenance",
        description: "Deep starlight colors easily mask cycle pigments and simplify the washing routine",
        points: { fabricTop: 'moonrise' }
      }
    ]
  },
  {
    id: 'user-lifestyle',
    question: "What activities dominate your cycle days?",
    description: "Selects appropriate backing material to hold the pad layout in perfect position.",
    options: [
      {
        text: "High movement, work commutes, or intensive sports",
        description: "Needs thick cotton backings that grip underwear fibers snug",
        points: { size: 'moderate' }
      },
      {
        text: "Desk jobs, sitting down cozily, or light stretches",
        description: "Slim fluid designs focused on localized core absorption limits",
        points: { size: 'liner' }
      }
    ]
  }
];

export const READY_MADE_STOCKS = [
  {
    id: 'rm-1',
    name: 'Daytime Duo Special',
    description: 'Set of 2 Regular 8" day pads pre-crafted with Sunglow Floral organic top.',
    price: 15.00,
    size: 'Regular Day (8")',
    print: 'Sunglow Floral',
    absorbency: 'Moderate dry',
    quantityLeft: 3,
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&w=150&q=80',
    shape: 'staple'
  },
  {
    id: 'rm-2',
    name: 'Postpartum Night Safeguard',
    description: '1 Heavy 10" pad crafted with stain-masking Moonrise Indigo knit.',
    price: 12.00,
    size: 'Heavy Glow (10")',
    print: 'Moonrise Indigo',
    absorbency: 'Heavy absorbency',
    quantityLeft: 1,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80',
    shape: 'mega_pad'
  }
];

export const WASHING_FAQ = [
  {
    question: "How do I prep my new cloth pad before the first use?",
    answer: "Wash/soak your pad once or twice before initial wear to activate the natural bamboo & organic cotton loops' absorbency."
  },
  {
    question: "How do I manage the washing routine daily?",
    answer: "After use, rinse in clean cold water until it runs clear (never hot as that sets pigments). Toss in laundry with normal detergent, tumble dry low or hang dry. Do NOT use softeners as they coat fibers to reduce dynamic absorbency."
  }
];