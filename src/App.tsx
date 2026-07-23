import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Check, 
  Compass, 
  Heart, 
  Palette, 
  ShoppingCart, 
  Shield, 
  Leaf, 
  RefreshCw, 
  HelpCircle, 
  Plus, 
  Minus,
  Send,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Sparkle,
  Search,
  ZoomIn,
  Maximize2,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Store,
  MessageSquare,
  X,
  ShoppingBag,
  Sparkle as SparkleIcon,
  HelpCircle as QuestionIcon,
  MessageCircle,
  Mail,
  Instagram,
  Facebook,
  Scissors,
  Menu
} from 'lucide-react';
import { 
  FABRICS_TOP, 
  FABRICS_BACKING, 
  SIZE_OPTIONS, 
  ABSORBENCY_OPTIONS, 
  SHAPE_OPTIONS,
  READY_MADE_STOCKS,
  WASHING_FAQ,
  FabricOption,
  SizeOption,
  AbsorbencyOption
} from './data';
import { PadShape } from './components/PadShapes';
import customizerDbFallback from './customizer-db.json';
import { AdminUnified } from './components/AdminUnified';
import { SizingGuideView } from './components/SizingGuideView';
import { BenefitsPage } from './components/BenefitsPage';
import { AboutPage } from './components/AboutPage';
import { WhyClothPadsPage } from './components/WhyClothPadsPage';
import { ContactPage } from './components/ContactPage';
import { BlogPage } from './components/BlogPage';
import { FaqPage } from './components/FaqPage';
import { UnifiedCard } from './components/UnifiedCard';

// Category map to R2 tag folders / prefixes (case-insensitive keys)
const CATEGORY_TO_TAG_MAP: Record<string, string> = {
  'flowers': 'floral',
  'flower': 'floral',
  'animals': 'animal',
  'animal': 'animal',
  'characters': 'character',
  'character': 'character',
  'halloween': 'halloween',
  'solid': 'solid',
  'organic solid': 'solid',
  'organic solids': 'solid',
  'new arrivals': 'newarrival',
  'new arrival': 'newarrival',
  'leaving soon': 'cat-leaving',
  'kimmi': 'kimmi',
  'geoed': 'geoed',
  'abstract': 'abstract'
};

const getCategoryTag = (categoryName: string): string => {
  const clean = categoryName.trim().toLowerCase();
  return CATEGORY_TO_TAG_MAP[clean] || clean;
};

const isShapeAllowed = (sh: string, len: number): boolean => {
  if (sh === 'moon_rise') return len >= 6 && len <= 18;
  if (sh === 'sunglow') return len >= 6 && len <= 20;
  if (sh === 'staple') return len >= 7 && len <= 18;
  if (sh === 'mega_pad') return len >= 15 && len <= 20;
  return true;
};

const getFallbackShapeForLength = (len: number): string => {
  if (len >= 6 && len <= 18) return 'moon_rise';
  if (len >= 6 && len <= 20) return 'sunglow';
  if (len >= 7 && len <= 18) return 'staple';
  if (len >= 15 && len <= 20) return 'mega_pad';
  return 'sunglow';
};

const getOptimizedImageUrl = (url: string | undefined | null, size: 'thumbnail' | 'detail' = 'detail'): string => {
  const isLowBandwidth = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('low_bandwidth_mode') === 'true';
  
  const placeholders = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400', // Yellow/cream botanical
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400', // Pastel floral pink
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', // Fine linen beige
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400', // Pink shibori tie-dye
    'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=400', // Abstract paint strokes pink/lilac
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400', // Navy and gold abstract geometric
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400', // Peach beach pastel
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=400', // Green woodland forest
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400', // Playful pastel clouds/sky
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400', // Watercolor botanical garden teal
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=400', // Indigo blue textured tie-dye
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400', // Warm purple/red blend texture
    'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=400', // Orange-pink sunset silk
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=400', // Dark emerald pine forest
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400', // Midnight navy galaxy sky
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400', // Sage green tea ceramic pattern
    'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=400', // Vibrant hot pink botanical
    'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&q=80&w=400', // Sun yellow daisy pattern
    'https://images.unsplash.com/photo-1570473541596-2654ed0ec3a1?auto=format&fit=crop&q=80&w=400', // Golden cheetah spot print
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=400', // Speckled black and white terrazzo
    'https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&q=80&w=400', // Warm abstract sand swirl
    'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&q=80&w=400', // Pastel grid retro check pattern
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', // Cute cat hand-drawn vector texture
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400', // Symmetric green mandala
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400', // Kawaii doodle pattern
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=400', // Bold Memphis geometric paint
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400', // Cute watercolor leaves and dinos
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400', // Dark starry magical night witchy print
    'https://images.unsplash.com/photo-1508349679140-341a496830e6?auto=format&fit=crop&q=80&w=400', // Cute autumnal pumpkins pattern
    'https://images.unsplash.com/photo-1509248990006-ee3f97bb64b7?auto=format&fit=crop&q=80&w=400', // Playful cute white ghosts print
    'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&q=80&w=400', // Japanese sakura cherry blossom
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=400', // Fruity fresh peach pattern
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400', // Sweet strawberry summer pattern
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', // Soft pastel mint organic sage texture
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400', // Solid terracotta clay rustic linen
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400', // Acrylic pastel fluid marble swirl
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400', // Abstract pastel terrazzo tile chips
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=400', // Soft warm bamboo knit canvas
    'https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&q=80&w=400', // Bright coral hand-dyed pattern
    'https://images.unsplash.com/photo-1590244921951-3ac8751576d8?auto=format&fit=crop&q=80&w=400'  // Retro daisy pastel purple/yellow
  ];

  if (isLowBandwidth || !url || url.includes('your-r2-bucket.com') || url.includes('/api/placeholder') || url === 'placeholder') {
    const activeUrl = url || 'placeholder-seed-fallback';
    const hash = activeUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = Math.abs(hash) % placeholders.length;
    return placeholders[index];
  }

  return url;
};

const HERO_SWATCHES = [
  {
    category: 'Flowers',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=200',
    label: 'Flowers'
  },
  {
    category: 'Kimmi',
    imageUrl: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&q=80&w=200',
    label: 'Kimmi'
  },
  {
    category: 'Characters',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=200',
    label: 'Characters'
  },
  {
    category: 'Geoed',
    imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=200',
    label: 'Abstract'
  },
  {
    category: 'Halloween',
    imageUrl: 'https://images.unsplash.com/photo-1508349679140-341a496830e6?auto=format&fit=crop&q=80&w=200',
    label: 'Halloween'
  },
  {
    category: 'Animal',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=200',
    label: 'Animal'
  }
];

interface CartItem {
  id: string;
  sizeName: string;
  pricePerUnit: number;
  lengthInches: number;
  printName: string;
  absorbencyName: string;
  backingName: string;
  shapeName: string;
  quantity: number;
  totalPrice: number;
  isReadyMade?: boolean;
  imageUrl?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const NONE_FABRIC: FabricOption = {
  id: 'none',
  name: 'No Pattern Selected',
  type: 'top',
  material: 'None Selected',
  description: 'Please select a top pattern fabric.',
  colorHex: '#fafafa',
  imageUrl: '',
  premium: 0,
  properties: []
};

const ShopLogoSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Curved Text Paths */}
      <path id="header-text-path-top" d="M 21,100 A 79,79 0 0,1 179,100" fill="none" />
      <path id="header-text-path-bottom" d="M 179,100 A 79,79 0 0,1 21,100" fill="none" />

      {/* Soft Watercolor Blur Filter */}
      <filter id="watercolor-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Watercolor Gradients */}
      <radialGradient id="rose-watercolor-base" cx="45%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#FFF0F6" stopOpacity="0.9" />
        <stop offset="35%" stopColor="#FFA6D4" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#E05C97" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#922B50" stopOpacity="0" />
      </radialGradient>

      <radialGradient id="rose-petal-dark" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8A1C44" />
        <stop offset="40%" stopColor="#C43D71" />
        <stop offset="85%" stopColor="#EAA3CE" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#EAA3CE" stopOpacity="0" />
      </radialGradient>
      
      <radialGradient id="rose-petal-light" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFF2F8" />
        <stop offset="65%" stopColor="#FFA6D4" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#E05C97" stopOpacity="0.4" />
      </radialGradient>
      
      <radialGradient id="rose-petal-medium" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFEAF2" />
        <stop offset="70%" stopColor="#F796C8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C43D71" stopOpacity="0.2" />
      </radialGradient>

      <linearGradient id="leaf-wc-green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D9EAD3" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#A3C3A5" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#6C8D6F" stopOpacity="0.6" />
      </linearGradient>

      <linearGradient id="leaf-wc-grey" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CED8E2" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#9FB3C8" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#7B8C9D" stopOpacity="0.6" />
      </linearGradient>

      <linearGradient id="lavender-bud-wc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EAA3CE" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7A1335" stopOpacity="0.95" />
      </linearGradient>
    </defs>

    {/* Concentric Decorative Borders */}
    <circle cx="100" cy="100" r="95" fill="none" stroke="#EAA3CE" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="91.5" fill="none" stroke="#D1D5DB" strokeWidth="0.8" strokeOpacity="0.8" />
    <circle cx="100" cy="100" r="67.5" fill="none" stroke="#D1D5DB" strokeWidth="0.8" strokeOpacity="0.8" />
    <circle cx="100" cy="100" r="64" fill="none" stroke="#EAA3CE" strokeWidth="1.2" />

    {/* Typography along Circular Paths */}
    <text fontFamily="'Playfair Display', 'Georgia', serif" fontWeight="500" fontSize="13.5" fill="#1C1D1F" letterSpacing="0.8">
      <textPath href="#header-text-path-top" startOffset="50%" textAnchor="middle">Wonder Pads Reusables</textPath>
    </text>

    <text fontFamily="'Alice', 'Georgia', serif" fontWeight="400" fontSize="8.2" fill="#3F3F46" letterSpacing="0.4">
      <textPath href="#header-text-path-bottom" startOffset="50%" textAnchor="middle">your one stop shop for healthy menstruation</textPath>
    </text>

    {/* Separation Dots on Left and Right (Radius 79) */}
    <circle cx="21" cy="100" r="2.2" fill="#1C1D1F" />
    <circle cx="179" cy="100" r="2.2" fill="#1C1D1F" />

    {/* Watercolor Rose Illustration (Centered at 100, 103) */}
    <g transform="translate(100, 103)" filter="url(#watercolor-blur)">
      {/* Back Leaves (Grey/Lavender & Soft Green) */}
      <path d="M -15,10 C -35,28 -50,18 -52,2 C -42,-8 -25,-4 -15,10 Z" fill="url(#leaf-wc-grey)" opacity="0.8" />
      <path d="M 15,10 C 35,28 50,18 52,2 C 42,-8 25,-4 15,10 Z" fill="url(#leaf-wc-grey)" opacity="0.8" />
      <path d="M -5,15 C -8,32 -3,45 2,48 C 7,45 10,32 5,15 Z" fill="url(#leaf-wc-grey)" opacity="0.85" />
      <path d="M -20,2 C -38,5 -44,-8 -35,-15 C -25,-12 -20,-6 -20,2 Z" fill="url(#leaf-wc-grey)" opacity="0.75" />
      <path d="M 20,2 C 38,5 44,-8 35,-15 C 25,-12 20,-6 20,2 Z" fill="url(#leaf-wc-grey)" opacity="0.75" />
      
      <path d="M -15,-12 C -26,-28 -35,-22 -38,-10 C -28,-2 -18,-5 -15,-12 Z" fill="url(#leaf-wc-green)" opacity="0.8" />
      <path d="M 15,-12 C 26,-28 35,-22 38,-10 C 28,-2 18,-5 15,-12 Z" fill="url(#leaf-wc-green)" opacity="0.8" />
      <path d="M -3,-20 C -5,-30 0,-34 3,-30 C 5,-25 2,-20 -3,-20 Z" fill="url(#leaf-wc-green)" opacity="0.85" />
      
      {/* Left Bud Sprig */}
      <path d="M -15,-5 C -25,-18 -32,-28 -34,-32" fill="none" stroke="#8EA490" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M -34,-32 C -36,-30 -33,-28 -34,-32 Z" fill="#8EA490" />
      <path d="M -34,-32 C -38,-38 -36,-44 -31,-42 C -27,-40 -29,-36 -34,-32 Z" fill="#E892BD" />
      <path d="M -33,-33 C -36,-37 -34,-40 -32,-39 Z" fill="#FFAAD8" />
      
      {/* Right Lavender Berry Sprig */}
      <path d="M 15,-5 C 25,-18 34,-28 41,-32" fill="none" stroke="#8EA490" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="21" cy="-14" r="2.5" fill="#20253B" opacity="0.9" />
      <circle cx="26" cy="-20" r="2.8" fill="#1C2136" opacity="0.95" />
      <circle cx="32" cy="-26" r="2.5" fill="#20253B" opacity="0.9" />
      <circle cx="37" cy="-31" r="2.2" fill="#1A1F33" opacity="0.95" />
      <circle cx="42" cy="-35" r="1.8" fill="#2D334E" opacity="0.9" />

      {/* Rose Bloom (Centered) */}
      <circle cx="0" cy="4" r="24" fill="url(#rose-watercolor-base)" />
      
      {/* Overlapping Petals */}
      <path d="M -22,10 C -22,24 22,24 22,10 C 22,2 -22,2 -22,10 Z" fill="url(#rose-petal-medium)" opacity="0.85" />
      <path d="M -25,0 C -34,-8 -15,-18 -8,-10 C -4,-4 -14,8 -25,0 Z" fill="url(#rose-petal-medium)" opacity="0.9" />
      <path d="M 25,0 C 34,-8 15,-18 8,-10 C 4,-4 14,8 25,0 Z" fill="url(#rose-petal-medium)" opacity="0.9" />
      <path d="M -15,-8 C -15,-20 15,-20 15,-8 C 15,0 -15,0 -15,-8 Z" fill="url(#rose-petal-medium)" opacity="0.85" />
      
      <path d="M -14,4 C -20,-2 -14,-10 -6,-6 C -2,-4 -6,10 -14,4 Z" fill="url(#rose-petal-light)" opacity="0.9" />
      <path d="M 14,4 C 20,-2 14,-10 6,-6 C 2,-4 6,10 14,4 Z" fill="url(#rose-petal-light)" opacity="0.9" />
      <path d="M -12,10 C -12,16 12,16 12,10 C 12,6 -12,6 -12,10 Z" fill="url(#rose-petal-light)" opacity="0.95" />

      {/* Heart of the rose & Spiral details */}
      <circle cx="0" cy="4" r="7" fill="url(#rose-petal-dark)" />
      <path d="M -6,2 C -6,-2 6,-2 6,2 C 6,6 -3,7 -5,4 C -5,2 1,1 1,3" fill="none" stroke="#7A1335" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M -3,3 C -3,0 3,0 3,3 C 3,5 -2,6 -3,4" fill="none" stroke="#922B50" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M -5,0 C -5,-4 5,-4 5,0 C 5,3 -2,4 -3,2" fill="none" stroke="#EAA3CE" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
    </g>
  </svg>
);

const ShopLogo = ({ url }: { url?: string }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (url) {
      setImgSrc(url);
      setHasError(false);
    } else {
      setImgSrc('/logo.png');
      setHasError(false);
    }
  }, [url]);

  const handleImageError = () => {
    if (url && imgSrc === url) {
      // If the custom URL failed, fall back to default logo.png search
      setImgSrc('/logo.png');
    } else if (imgSrc === '/logo.png') {
      setImgSrc('/logo.jpg');
    } else if (imgSrc === '/logo.jpg') {
      setImgSrc('/logo.jpeg');
    } else if (imgSrc === '/logo.jpeg') {
      setImgSrc('/logo.svg');
    } else if (imgSrc === '/assets/logo.png') {
      setImgSrc('/assets/logo.jpg');
    } else if (imgSrc === '/assets/logo.jpg') {
      setImgSrc('/assets/logo.svg');
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imgSrc) {
    return <ShopLogoSVG />;
  }

  return (
    <img
      src={getOptimizedImageUrl(imgSrc, 'thumbnail')}
      alt="Wonder Pads Reusables Logo"
      className="w-full h-full object-contain select-none"
      referrerPolicy="no-referrer"
      onError={handleImageError}
    />
  );
};

const getJustSizeNumber = (sizeStr: string): string => {
  if (!sizeStr) return '';
  // Try to find something inside parenthesis first, like (6") or (6) or (6.5") or (12") or (12)
  const parenMatch = sizeStr.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const content = parenMatch[1].trim();
    return content;
  }
  // Otherwise, look for a number with optional quotes or inches
  const numMatch = sizeStr.match(/(\d+(?:\.\d+)?\s*(?:”|"|inch|in)?)/i);
  if (numMatch) {
    return numMatch[1].trim();
  }
  return sizeStr;
};

const getForInfo = (desc: string, defaultBestFor: string) => {
  if (!desc) return defaultBestFor;
  const bracketIndex = desc.indexOf('(');
  if (bracketIndex !== -1) {
    return desc.substring(0, bracketIndex).trim();
  }
  return desc;
};

const renderFormattedDescription = (desc: string) => {
  if (!desc) return null;
  const bracketIndex = desc.indexOf('(');
  if (bracketIndex !== -1 && desc.endsWith(')')) {
    const tipPart = desc.substring(bracketIndex + 1, desc.length - 1).trim();
    return (
      <div className="text-[10.5px] text-zinc-600 leading-relaxed text-left bg-stone-50/70 p-2.5 rounded-xl border border-zinc-150/60 shadow-3xs">
        <p className="text-[10px] text-[#556B55] italic font-bold flex items-start gap-1 pl-0.5">
          <span>💡</span>
          <span>{tipPart}</span>
        </p>
      </div>
    );
  }
  return (
    <p className="text-[10px] text-zinc-550 leading-relaxed text-left bg-stone-50/70 p-2.5 rounded-xl border border-zinc-150/60 shadow-3xs font-medium">
      {desc}
    </p>
  );
};

const STANDARD_DESCRIPTIONS: Record<string, string> = {
  'Liner': 'For: Daily freshness, spotting, very light days, or as backup for cups and tampons. (A simple place to begin if you’re new to reusable pads.)',
  'Light': 'For: Light flow days, the beginning or end of your period, spotting, or everyday backup. (Comfortable, slim, and easy to wash. Perfect for lighter days.)',
  'Moderate': 'For: Regular flow days when you need dependable everyday protection. (A balanced choice for most period days, combining comfort with reliable absorbency.)',
  'Heavy': 'For: Heavy flow days, longer wear, or extra confidence when you need it most. (Designed with added absorbency while remaining soft, breathable, and comfortable.)',
  'Extra long': 'For: Overnight use, postpartum recovery, or anyone who prefers extra length and coverage. (Maximum coverage and confidence for your heaviest moments.)'
};

const RTS_NAME_MAP: Record<string, string> = {
  'Liner': '🌿 Liner',
  'Light': '🌸 Light',
  'Moderate': '🌺 Moderate',
  'Heavy': '🌹 Heavy',
  'Extra long': '🌼 Extra Long'
};

const renderDescriptionWithBrackets = (description: string) => {
  if (!description) return null;
  const match = description.match(/^(.*?)\((.*?)\)$/s);
  if (match) {
    return (
      <div className="space-y-1.5 text-left">
        <p className="text-sm sm:text-[14px] text-zinc-600 leading-relaxed font-medium">
          {match[1].trim()}
        </p>
        <p className="text-[11px] sm:text-[12px] text-brand-taupe font-semibold italic bg-brand-cream/30 p-2 rounded-xl border border-brand-cream/50 leading-relaxed">
          ✨ {match[2].trim()}
        </p>
      </div>
    );
  }
  return (
    <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed">
      {description}
    </p>
  );
};

const getRtsTypeFromItem = (item: any): 'Liner' | 'Light' | 'Moderate' | 'Heavy' | 'Extra Long' => {
  const normName = (item.name || '').toLowerCase();
  
  if (normName.includes('liner')) {
    return 'Liner';
  }
  if (normName.includes('extra long') || normName.includes('extra-long') || normName.includes('long')) {
    return 'Extra Long';
  }
  if (normName.includes('light')) {
    return 'Light';
  }
  if (normName.includes('moderate')) {
    return 'Moderate';
  }
  if (normName.includes('heavy')) {
    return 'Heavy';
  }
  
  // Fallback by price
  const price = Number(item.price);
  if (price === 5.5) return 'Liner';
  if (price === 8) return 'Light';
  if (price === 11) return 'Moderate';
  if (price === 14) return 'Heavy';
  if (price === 15) return 'Extra Long';
  
  return 'Moderate'; // default fallback
};

const getRtsOrderIndex = (category: string) => {
  switch (category) {
    case 'Liner': return 0;
    case 'Light': return 1;
    case 'Moderate': return 2;
    case 'Heavy': return 3;
    case 'Extra Long': return 4;
    default: return 5;
  }
};

interface FannedCardStackProps {
  images: string[];
  onClick?: () => void;
  hideImages?: boolean;
  type?: 'fabric' | 'rts';
}

const FannedCardStack = ({ images, onClick, hideImages, type }: FannedCardStackProps) => {
  const validImages = images.filter(Boolean);
  if (validImages.length === 0 || hideImages) {
    return (
      <div 
        onClick={onClick}
        className="relative w-40 h-28 sm:w-48 sm:h-32 flex flex-col items-center justify-center bg-[#fdfbf7] rounded-3xl border border-dashed border-zinc-300 shadow-inner-sm p-4 cursor-pointer select-none"
      >
        <span className="text-2xl mb-1">{type === 'rts' ? '📦' : '🎨'}</span>
        <span className="text-zinc-500 text-[9px] font-extrabold tracking-widest uppercase font-sans">
          {type === 'rts' ? 'Ready Stock' : 'Fabric Catalog'}
        </span>
      </div>
    );
  }

  // Extract up to 5 unique images
  const displayImages: string[] = [];
  if (validImages.length === 1) {
    displayImages.push(validImages[0], validImages[0], validImages[0], validImages[0], validImages[0]);
  } else if (validImages.length === 2) {
    displayImages.push(validImages[0], validImages[1], validImages[0], validImages[1], validImages[0]);
  } else if (validImages.length === 3) {
    displayImages.push(validImages[1], validImages[2], validImages[0], validImages[1], validImages[2]);
  } else if (validImages.length === 4) {
    displayImages.push(validImages[2], validImages[3], validImages[0], validImages[1], validImages[2]);
  } else {
    displayImages.push(validImages[2], validImages[3], validImages[4], validImages[1], validImages[0]);
  }

  const cardStyles = [
    {
      // Backmost Left
      className: "absolute w-[68px] h-[86px] sm:w-[78px] sm:h-[100px] bg-white rounded-xl shadow-md border-[2px] border-white overflow-hidden transition-transform duration-300 group-hover:scale-105",
      style: {
        transform: "rotate(-20deg) translate(-26px, 4px)",
        zIndex: 1,
      }
    },
    {
      // Backmost Right
      className: "absolute w-[68px] h-[86px] sm:w-[78px] sm:h-[100px] bg-white rounded-xl shadow-md border-[2px] border-white overflow-hidden transition-transform duration-300 group-hover:scale-105",
      style: {
        transform: "rotate(20deg) translate(26px, 4px)",
        zIndex: 2,
      }
    },
    {
      // Inner Left
      className: "absolute w-[68px] h-[86px] sm:w-[78px] sm:h-[100px] bg-white rounded-xl shadow-md border-[2px] border-white overflow-hidden transition-transform duration-300 group-hover:scale-105",
      style: {
        transform: "rotate(-10deg) translate(-13px, 2px)",
        zIndex: 3,
      }
    },
    {
      // Inner Right
      className: "absolute w-[68px] h-[86px] sm:w-[78px] sm:h-[100px] bg-white rounded-xl shadow-md border-[2px] border-white overflow-hidden transition-transform duration-300 group-hover:scale-105",
      style: {
        transform: "rotate(10deg) translate(13px, 2px)",
        zIndex: 4,
      }
    },
    {
      // Front Center
      className: "absolute w-[68px] h-[86px] sm:w-[78px] sm:h-[100px] bg-white rounded-xl shadow-lg border-[2.5px] border-white overflow-hidden transition-transform duration-300 group-hover:scale-[1.06] z-10",
      style: {
        transform: "rotate(0deg) translate(0, 0)",
      }
    }
  ];

  return (
    <div 
      onClick={onClick}
      className="relative w-44 h-28 sm:w-48 sm:h-32 flex items-center justify-center cursor-pointer select-none group"
    >
      {cardStyles.map((cfg, idx) => (
        <div 
          key={idx} 
          className={cfg.className} 
          style={cfg.style}
        >
          <img 
            src={getOptimizedImageUrl(displayImages[idx], 'thumbnail')} 
            alt="Sneak peek" 
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}
    </div>
  );
};

export default function App() {
  // Master unified 6-step state wizard representation:
  // 1: OPTIONS, 2: QUIZ, 3: FABRICS, 4: SIZES, 5: VISUALIZER, 6: CHECKOUT
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCheckoutPage, setIsCheckoutPage] = useState<boolean>(false);
  const [isWhatsAppExpanded, setIsWhatsAppExpanded] = useState<boolean>(false);

  // Client shopping basket (cart) state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartFloatingExpanded, setIsCartFloatingExpanded] = useState<boolean>(false);

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Walkthrough Tour State
  const [tourStep, setTourStep] = useState<number | null>(null);

  const startTour = () => {
    setTourStep(1);
    setSelectedOptionTab(null);
    setShowCareModal(false);
    showToast("✨ Welcome to WonderPads Interactive Tour!", 'success');
  };

  const handleNextTourStep = () => {
    if (tourStep === null) return;
    const nextStep = tourStep + 1;
    if (nextStep > 5) {
      setTourStep(null);
      setSelectedOptionTab(null);
      setShowCareModal(false);
      showToast("🌸 Tour completed! You are ready to design your own pad.", 'success');
    } else {
      setTourStep(nextStep);
      if (nextStep === 2) {
        setSelectedOptionTab(null);
        setShowCareModal(false);
      } else if (nextStep === 3) {
        setSelectedOptionTab('bespoke');
        setShowCareModal(false);
        setTimeout(() => {
          const visContainer = document.getElementById('step-2');
          if (visContainer) {
            visContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else if (nextStep === 4) {
        setSelectedOptionTab(null);
        setTimeout(() => {
          const el = document.getElementById('wash-care-guide');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else if (nextStep === 5) {
        setTimeout(() => {
          const summaryEl = document.getElementById('custom-order-summary-panel');
          if (summaryEl) {
            summaryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep === null || tourStep === 1) return;
    const prevStep = tourStep - 1;
    setTourStep(prevStep);
    if (prevStep === 1 || prevStep === 2) {
      setSelectedOptionTab(null);
    } else if (prevStep === 3) {
      setSelectedOptionTab('bespoke');
      setTimeout(() => {
        const visContainer = document.getElementById('step-2');
        if (visContainer) {
          visContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else if (prevStep === 4) {
      setSelectedOptionTab(null);
      setTimeout(() => {
        const el = document.getElementById('wash-care-guide');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const handleSkipTour = () => {
    setTourStep(null);
    setSelectedOptionTab(null);
    setShowCareModal(false);
    showToast("✨ Tour closed. Feel free to explore!", 'info');
  };



  // Dynamic collections from customizer-db.json with fallback
  const [fabricsTop, setFabricsTop] = useState<FabricOption[]>((customizerDbFallback.fabricsTop as FabricOption[]) || FABRICS_TOP);
  const [fabricsBacking, setFabricsBacking] = useState<FabricOption[]>((customizerDbFallback.fabricsBacking as FabricOption[]) || FABRICS_BACKING);
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>(customizerDbFallback.sizeOptions || SIZE_OPTIONS);
  const [absorbencyOptions, setAbsorbencyOptions] = useState<AbsorbencyOption[]>(customizerDbFallback.absorbencyOptions || ABSORBENCY_OPTIONS);
  const [readyMadeStocks, setReadyMadeStocks] = useState<any[]>(customizerDbFallback.readyMadeStocks || READY_MADE_STOCKS);
  const [activeRtsCategoryTab, setActiveRtsCategoryTab] = useState<string | null>(null);
  const [expandedRtsIds, setExpandedRtsIds] = useState<Record<string, boolean>>({});

  // Memoize Ready Stock mapping & sorting to prevent redundant loop iterations on every state change/scroll
  const activeRtsItems = useMemo(() => {
    return readyMadeStocks.filter((pack) => !pack.hidden);
  }, [readyMadeStocks]);

  const rtsWithCategories = useMemo(() => {
    return activeRtsItems.map(item => {
      const category = getRtsTypeFromItem(item);
      return { ...item, computedCategory: category };
    });
  }, [activeRtsItems]);

  // Sort them strictly: Liner -> Light -> Moderate -> Heavy -> Extra Long, and then by size ascending (7 inch, 8 inch, etc.)
  const sortedRtsItems = useMemo(() => {
    return [...rtsWithCategories].sort((a, b) => {
      const orderA = getRtsOrderIndex(a.computedCategory);
      const orderB = getRtsOrderIndex(b.computedCategory);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Parse size in inches to sort numerically ascending
      const parseSizeInches = (sizeStr: string | undefined | null): number => {
        if (!sizeStr) return 0;
        const match = sizeStr.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
      };
      const sizeA = parseSizeInches(a.size || a.sizeLabel);
      const sizeB = parseSizeInches(b.size || b.sizeLabel);
      if (sizeA !== sizeB) {
        return sizeA - sizeB;
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [rtsWithCategories]);

  // Pre-mapped lists of images for FannedCardStack to avoid looping on every render
  const fabricsTopImages = useMemo(() => {
    return fabricsTop.map(f => f.imageUrl).filter((url): url is string => !!url);
  }, [fabricsTop]);

  const sortedRtsItemsImages = useMemo(() => {
    return sortedRtsItems.map(item => item.imageUrl).filter((url): url is string => !!url);
  }, [sortedRtsItems]);

  // Memoized Ready-to-Ship categories lists and statistics
  const rtsCategoriesList = useMemo(() => {
    return [
      { id: 'Liner', label: '🌿 Liners', count: sortedRtsItems.filter(item => item.computedCategory === 'Liner').length },
      { id: 'Light', label: '🌸 Lights', count: sortedRtsItems.filter(item => item.computedCategory === 'Light').length },
      { id: 'Moderate', label: '🌺 Moderates', count: sortedRtsItems.filter(item => item.computedCategory === 'Moderate').length },
      { id: 'Heavy', label: '🌹 Heavy', count: sortedRtsItems.filter(item => item.computedCategory === 'Heavy').length },
      { id: 'Extra Long', label: '🌼 Extra Long', count: sortedRtsItems.filter(item => item.computedCategory === 'Extra Long').length },
      { id: 'All', label: '✨ All', count: sortedRtsItems.length }
    ];
  }, [sortedRtsItems]);

  const filteredRtsItems = useMemo(() => {
    if (activeRtsCategoryTab === 'All') return sortedRtsItems;
    if (!activeRtsCategoryTab) return [];
    return sortedRtsItems.filter(item => item.computedCategory === activeRtsCategoryTab);
  }, [sortedRtsItems, activeRtsCategoryTab]);

  const allRtsImages = useMemo(() => {
    return sortedRtsItems.map(item => item.imageUrl).filter(Boolean);
  }, [sortedRtsItems]);

  const [shapeOptions, setShapeOptions] = useState<any[]>(SHAPE_OPTIONS);
  const [washingFaq, setWashingFaq] = useState<any[]>(WASHING_FAQ);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  // Categories config editable by admin
  const DEFAULT_CATEGORIES = [
    'Flowers',
    'Kimmi',
    'Characters',
    'Geoed',
    'Halloween',
    'Animal',
    'Organic solid',
    'New arrivals',
    'Leaving soon'
  ];
  const [categories, setCategories] = useState<string[]>(customizerDbFallback.settings?.categories || DEFAULT_CATEGORIES);
  const [editingCategoriesText, setEditingCategoriesText] = useState((customizerDbFallback.settings?.categories || DEFAULT_CATEGORIES).join('\n'));
  const [shopLogoUrl, setShopLogoUrl] = useState<string>(customizerDbFallback.settings?.shopLogoUrl || '');
  const [merchantEmail, setMerchantEmail] = useState<string>((customizerDbFallback.settings as any)?.merchantEmail || 'ecowonderpads@gmail.com');
  const [merchantPhone, setMerchantPhone] = useState<string>((customizerDbFallback.settings as any)?.merchantPhone || '6583397556');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>('Flowers');

  // User Search/Filter states for Customizer Step 2
  const [searchTop, setSearchTop] = useState('');
  const [searchBacking, setSearchBacking] = useState('');

  // R2 / Media Storage Photos (cached or retrieved from bucket)
  const [mediaPhotos, setMediaPhotos] = useState<any[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null); // For fullscreen lightbox preview
  const [zoomedFabric, setZoomedFabric] = useState<any | null>(null); // For fabric pattern zoom lightbox preview

  // GitHub integration states loaded from/saved to localStorage
  // Note: the GitHub token itself is no longer handled here - it lives only
  // as a server-side secret (GITHUB_PAT) and is never sent to or stored in the browser.
  const [ghOwner, setGhOwner] = useState(() => localStorage.getItem('gh_sync_owner') || 'nilam1978');
  const [ghRepo, setGhRepo] = useState(() => localStorage.getItem('gh_sync_repo') || 'wonder-pads');
  const [ghBranch, setGhBranch] = useState(() => localStorage.getItem('gh_sync_branch') || 'main');
  const [ghCommitMsg, setGhCommitMsg] = useState('Update customizer-db.json from Admin Panel');
  const [isPublishingToGithub, setIsPublishingToGithub] = useState(false);

  // Admin UI States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'fabrics' | 'rts' | 'sizes' | 'general'>('fabrics');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const [lowBandwidthMode, setLowBandwidthMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('low_bandwidth_mode') === 'true';
    }
    return false;
  });
  const [hideLookbookInBackOffice, setHideLookbookInBackOffice] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('hide_lookbook_back_office');
        if (stored !== null) {
          return stored !== 'false';
        }
      }
    } catch (e) {
      console.warn('localStorage access failed in state init:', e);
    }
    return true;
  });

  const toggleLowBandwidthMode = () => {
    const newVal = !lowBandwidthMode;
    setLowBandwidthMode(newVal);
    localStorage.setItem('low_bandwidth_mode', String(newVal));
    setAdminSuccess(`Low Bandwidth Mode is now ${newVal ? 'ENABLED' : 'DISABLED'}. Placeholder images active.`);
    setTimeout(() => setAdminSuccess(''), 4000);
  };

  // Secret flower shortcut states
  const [flowerTaps, setFlowerTaps] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleFlowerTap = () => {
    const now = Date.now();
    if (now - lastTapTime > 3000) {
      setFlowerTaps(1);
    } else {
      const nextTaps = flowerTaps + 1;
      setFlowerTaps(nextTaps);
      if (nextTaps >= 5) {
        setFlowerTaps(0);
        setIsAdminOpen(true);
        setAdminError('');
        setAdminSuccess('');
      }
    }
    setLastTapTime(now);
  };

  // Add Fabric Form States
  const [newFabName, setNewFabName] = useState('');
  const [newFabCategory, setNewFabCategory] = useState('Flowers');
  const [newFabMaterial, setNewFabMaterial] = useState('');
  const [newFabPremium, setNewFabPremium] = useState('0.00');
  const [newFabProperties, setNewFabProperties] = useState('');
  const [newFabStock, setNewFabStock] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [newFabImageUrl, setNewFabImageUrl] = useState('');
  const [isUploadingFab, setIsUploadingFab] = useState(false);
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);
  const [adminFabricsSubTab, setAdminFabricsSubTab] = useState<'top' | 'backing'>('top');
  const [expandedAdminFabricCategories, setExpandedAdminFabricCategories] = useState<Record<string, boolean>>({});
  const [expandedAdminRtsCategories, setExpandedAdminRtsCategories] = useState<Record<string, boolean>>({});
  const [isAddFabFormExpanded, setIsAddFabFormExpanded] = useState(false);

  // Edit Fabric Form States
  const [editingFabric, setEditingFabric] = useState<FabricOption | null>(null);
  const [editFabName, setEditFabName] = useState('');
  const [editFabCategory, setEditFabCategory] = useState('Flowers');
  const [editFabMaterial, setEditFabMaterial] = useState('');
  const [editFabPremium, setEditFabPremium] = useState('0.00');
  const [editFabProperties, setEditFabProperties] = useState('');
  const [editFabStock, setEditFabStock] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [editFabImageUrl, setEditFabImageUrl] = useState('');
  const [editFabHidden, setEditFabHidden] = useState(false);
  const [isUploadingEditFab, setIsUploadingEditFab] = useState(false);

  // R2 Storage Bulk Import States
  const [bulkImportTag, setBulkImportTag] = useState('wpfabrics');
  const [bulkImportCategoryTag, setBulkImportCategoryTag] = useState('floral');
  const [bulkImportType, setBulkImportType] = useState<string>('New arrivals');
  const [bulkImportMaterial, setBulkImportMaterial] = useState('Cotton Woven');
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // Add RTS Form States
  const [newRtsName, setNewRtsName] = useState('');
  const [newRtsDescription, setNewRtsDescription] = useState('');
  const [newRtsPrice, setNewRtsPrice] = useState('15.00');
  const [newRtsSize, setNewRtsSize] = useState('Regular Day (8")');
  const [newRtsPrint, setNewRtsPrint] = useState('Sunglow Floral');
  const [newRtsAbsorbency, setNewRtsAbsorbency] = useState('Moderate dry');
  const [newRtsQuantity, setNewRtsQuantity] = useState('1');
  const [newRtsImageUrl, setNewRtsImageUrl] = useState('');
  const [isUploadingRts, setIsUploadingRts] = useState(false);
  const [editingRtsId, setEditingRtsId] = useState<string | null>(null);
  const [isAddRtsFormExpanded, setIsAddRtsFormExpanded] = useState(false);
  const [newRtsNotes, setNewRtsNotes] = useState('');

  // Restructured Admin View State variables
  const [adminView, setAdminView] = useState<'add' | 'edit' | 'settings'>('add');
  const [activeAddType, setActiveAddType] = useState<'fabric' | 'pad' | 'size' | 'faq' | 'blog'>('fabric');
  const [adminEditSearch, setAdminEditSearch] = useState('');
  const [adminEditingItem, setAdminEditingItem] = useState<{ type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', data: any } | null>(null);

  // Size option states
  const [newSizeId, setNewSizeId] = useState('');
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizeLength, setNewSizeLength] = useState('8');
  const [newSizePrice, setNewSizePrice] = useState('11.00');
  const [newSizeDescription, setNewSizeDescription] = useState('');

  // FAQ states
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Blog states
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImageUrl, setNewBlogImageUrl] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('WonderPads');

  // Advanced / Bulk state toggle
  const [showAdvancedImport, setShowAdvancedImport] = useState(false);

  // Erase confirmation states
  const [showEraseConfirmationModal, setShowEraseConfirmationModal] = useState(false);
  const [eraseConfirmationInput, setEraseConfirmationInput] = useState('');

  // RTS R2 Bulk Tag Sync States
  const [rtsBulkImportTag, setRtsBulkImportTag] = useState('pads');
  const [rtsBulkImportCategoryTag, setRtsBulkImportCategoryTag] = useState('liner');
  const [rtsBulkImportCategory, setRtsBulkImportCategory] = useState('liner');
  const [isRtsBulkImporting, setIsRtsBulkImporting] = useState(false);
  const [rtsBulkDefaultPrice, setRtsBulkDefaultPrice] = useState('0.00');
  const [rtsBulkDefaultQty, setRtsBulkDefaultQty] = useState('1');
  const [isR2Mock, setIsR2Mock] = useState(false);
  const [missingR2Vars, setMissingR2Vars] = useState<string[]>(['R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'VITE_R2_PUBLIC_URL']);
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    mode?: string;
    projectId?: string;
    error?: string;
    explanation?: string;
    envDetected?: {
      FIREBASE_PROJECT_ID: boolean;
      FIREBASE_SERVICE_ACCOUNT_KEY: boolean;
    };
  } | null>(null);

  // General tab states
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [activePassword, setActivePassword] = useState('wonderpads2026');
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  // Fetch live collections on component mount
  useEffect(() => {
    fetch('/api/db')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load customizer database');
      })
      .then((data) => {
        if (data) {
          if (Array.isArray(data.fabricsTop) && data.fabricsTop.length > 0) setFabricsTop(data.fabricsTop);
          if (Array.isArray(data.fabricsBacking) && data.fabricsBacking.length > 0) setFabricsBacking(data.fabricsBacking);
          if (Array.isArray(data.sizeOptions) && data.sizeOptions.length > 0) setSizeOptions(data.sizeOptions);
          if (Array.isArray(data.absorbencyOptions)) setAbsorbencyOptions(data.absorbencyOptions);
          if (Array.isArray(data.readyMadeStocks)) setReadyMadeStocks(data.readyMadeStocks);
          if (Array.isArray(data.shapeOptions)) setShapeOptions(data.shapeOptions);
          if (Array.isArray(data.washingFaq)) setWashingFaq(data.washingFaq);
          if (Array.isArray(data.blogPosts)) setBlogPosts(data.blogPosts);
          if (data.settings) {
            if (Array.isArray(data.settings.categories)) {
              setCategories(data.settings.categories);
              setEditingCategoriesText(data.settings.categories.join('\n'));
            }
            if (data.settings.shopLogoUrl) {
              setShopLogoUrl(data.settings.shopLogoUrl);
            }
            if (data.settings.merchantEmail) {
              setMerchantEmail(data.settings.merchantEmail);
            }
            if (data.settings.merchantPhone) {
              setMerchantPhone(data.settings.merchantPhone);
            }
            if (data.settings.hideLookbookInBackOffice !== undefined) {
              setHideLookbookInBackOffice(!!data.settings.hideLookbookInBackOffice);
            }
          }
        }
      })
      .catch((err) => console.error('Error fetching live customizer-db:', err));
  }, []);

  // Fetch Firebase Status on boot
  useEffect(() => {
    fetch('/api/firebase-status')
      .then((res) => res.json())
      .then((data) => setFirebaseStatus(data))
      .catch((err) => console.error('Error fetching firebase-status:', err));
  }, []);

  // Check localStorage for saved admin session on boot
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAdminUrl = params.get('admin') === 'true';
    const savedPass = localStorage.getItem('admin_session_auth');
    if (savedPass) {
      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: savedPass })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActivePassword(savedPass);
          setIsAdminAuthenticated(true);
          if (isAdminUrl) {
            setIsAdminOpen(true);
          }
        } else {
          localStorage.removeItem('admin_session_auth');
        }
      })
      .catch((err) => console.error('Error verifying admin session:', err));
    } else if (isAdminUrl) {
      setIsAdminOpen(true);
    }
  }, []);

  // Keyboard listener to dismiss zoomed image modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedImageUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Media R2 photos when library is LIVE (not hidden)
  useEffect(() => {
    if (hideLookbookInBackOffice) {
      setIsLoadingPhotos(false);
      return;
    }
    setIsLoadingPhotos(true);
    fetch('/api/media/photos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load media photos');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.photos)) {
          setMediaPhotos(data.photos);
          if ('isMock' in data) {
            setIsR2Mock(!!data.isMock);
          }
          if (data && Array.isArray(data.missingVars)) {
            setMissingR2Vars(data.missingVars);
          } else {
            setMissingR2Vars([]);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch media photos from backend:', err);
        setPhotoError(err.message);
      })
      .finally(() => {
        setIsLoadingPhotos(false);
      });
  }, [hideLookbookInBackOffice]);

  // Save changes to database helper
  const saveDatabase = async (updatedDb: any) => {
    try {
      const finalDb = {
        fabricsTop: updatedDb.fabricsTop !== undefined ? updatedDb.fabricsTop : fabricsTop,
        fabricsBacking: updatedDb.fabricsBacking !== undefined ? updatedDb.fabricsBacking : fabricsBacking,
        sizeOptions: updatedDb.sizeOptions !== undefined ? updatedDb.sizeOptions : sizeOptions,
        absorbencyOptions: updatedDb.absorbencyOptions !== undefined ? updatedDb.absorbencyOptions : absorbencyOptions,
        readyMadeStocks: updatedDb.readyMadeStocks !== undefined ? updatedDb.readyMadeStocks : readyMadeStocks,
        shapeOptions: updatedDb.shapeOptions !== undefined ? updatedDb.shapeOptions : shapeOptions,
        washingFaq: updatedDb.washingFaq !== undefined ? updatedDb.washingFaq : washingFaq,
        blogPosts: updatedDb.blogPosts !== undefined ? updatedDb.blogPosts : blogPosts,
        settings: {
          ...updatedDb.settings,
          adminPassword: updatedDb.settings?.adminPassword || activePassword,
          categories: updatedDb.settings?.categories || categories,
          shopLogoUrl: updatedDb.settings?.shopLogoUrl || shopLogoUrl,
          merchantEmail: updatedDb.settings?.merchantEmail || merchantEmail,
          merchantPhone: updatedDb.settings?.merchantPhone || merchantPhone,
          hideLookbookInBackOffice: updatedDb.settings?.hideLookbookInBackOffice !== undefined
            ? updatedDb.settings?.hideLookbookInBackOffice
            : hideLookbookInBackOffice
        }
      };
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': activePassword
        },
        body: JSON.stringify(finalDb),
      });
      if (res.ok) {
        setAdminSuccess('Changes saved successfully to backend!');
        setTimeout(() => setAdminSuccess(''), 3000);
        return true;
      } else {
        throw new Error('Server responded with error');
      }
    } catch (err: any) {
      console.error('Error saving database:', err);
      setAdminError('Failed to save changes: ' + err.message);
      return false;
    }
  };

  // Restructured Administrative Form Handlers
  const resetAddFormStates = () => {
    setNewFabName('');
    setNewFabCategory('Flowers');
    setNewFabMaterial('');
    setNewFabPremium('0.00');
    setNewFabProperties('');
    setNewFabStock('in_stock');
    setNewFabImageUrl('');

    setNewRtsName('');
    setNewRtsDescription('');
    setNewRtsPrice('15.00');
    setNewRtsSize('Regular Day (8")');
    setNewRtsPrint('');
    setNewRtsAbsorbency('Moderate dry');
    setNewRtsQuantity('1');
    setNewRtsImageUrl('');
    setNewRtsNotes('');

    setNewSizeId('');
    setNewSizeName('');
    setNewSizeLabel('');
    setNewSizeLength('8');
    setNewSizePrice('11.00');
    setNewSizeDescription('');

    setNewFaqQuestion('');
    setNewFaqAnswer('');

    setNewBlogTitle('');
    setNewBlogContent('');
    setNewBlogImageUrl('');
    setNewBlogAuthor('WonderPads');

    setShowAdvancedImport(false);
  };

  const handleAddNewItem = async () => {
    setAdminError('');
    setAdminSuccess('');
    
    if (activeAddType === 'fabric') {
      if (!newFabName.trim()) {
        setAdminError('Fabric print name is required.');
        return;
      }
      const isBacking = newFabCategory === 'Backing Fabric';
      const computedId = 'fab-' + Date.now();
      const newFab: any = {
        id: computedId,
        name: newFabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: newFabMaterial.trim() || 'Cotton Woven',
        description: 'Wonder Premium Pattern',
        colorHex: '#ffffff',
        imageUrl: newFabImageUrl.trim() || 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200',
        premium: parseFloat(newFabPremium) || 0,
        properties: newFabProperties.split(',').map((s: string) => s.trim()).filter(Boolean),
        stockStatus: newFabStock,
        category: isBacking ? 'Backing Fabric' : newFabCategory,
        hidden: false
      };
      
      const updatedTops = isBacking ? fabricsTop : [...fabricsTop, newFab];
      const updatedBackings = isBacking ? [...fabricsBacking, newFab] : fabricsBacking;
      
      if (!isBacking) setFabricsTop(updatedTops);
      else setFabricsBacking(updatedBackings);
      
      const success = await saveDatabase({ fabricsTop: updatedTops, fabricsBacking: updatedBackings });
      if (success) {
        setAdminSuccess('Fabric print added successfully!');
        resetAddFormStates();
      }
    } 
    else if (activeAddType === 'pad') {
      if (!newRtsAbsorbency) {
        setAdminError('Product Type / absorbency is required.');
        return;
      }
      const computedId = 'rts-' + Date.now();
      const defaultRtsImage = 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200';
      const calculatedName = RTS_NAME_MAP[newRtsAbsorbency] || newRtsAbsorbency;
      const freshRts = {
        id: computedId,
        name: calculatedName,
        description: newRtsDescription.trim() || 'Pre-crafted limited release pack ready for immediate dispatch',
        price: parseFloat(newRtsPrice) || 15.00,
        quantityLeft: parseInt(newRtsQuantity) || 1,
        size: newRtsSize || '8 inch',
        sizeLabel: newRtsSize || '8 inch',
        print: newRtsPrint.trim() || '',
        printLabel: newRtsPrint.trim() || '',
        absorbency: newRtsAbsorbency,
        absorbencyLabel: newRtsAbsorbency,
        imageUrl: newRtsImageUrl.trim() || defaultRtsImage,
        adminNotes: newRtsNotes.trim(),
        hidden: false
      };
      const updatedRts = [...readyMadeStocks, freshRts];
      setReadyMadeStocks(updatedRts);
      const success = await saveDatabase({ readyMadeStocks: updatedRts });
      if (success) {
        setAdminSuccess('Ready-Made Pad added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'size') {
      if (!newSizeId.trim() || !newSizeName.trim()) {
        setAdminError('Size ID and Name are required.');
        return;
      }
      const cleanId = newSizeId.trim().toLowerCase().replace(/\s+/g, '_');
      if (sizeOptions.some((s: any) => s.id === cleanId)) {
        setAdminError(`Size ID "${cleanId}" already exists.`);
        return;
      }
      const newSz: any = {
        id: cleanId,
        name: newSizeName.trim(),
        lengthInches: parseFloat(newSizeLength) || 8,
        basePrice: parseFloat(newSizePrice) || 11.00,
        description: newSizeDescription.trim(),
        displayLabel: newSizeLabel.trim() || `${newSizeName.trim()} (${newSizeLength} inch)`
      };
      const updatedSizes = [...sizeOptions, newSz];
      setSizeOptions(updatedSizes);
      const success = await saveDatabase({ sizeOptions: updatedSizes });
      if (success) {
        setAdminSuccess('Pad Size added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'faq') {
      if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
        setAdminError('Question and Answer are required.');
        return;
      }
      const newF = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      };
      const updatedFaqs = [...washingFaq, newF];
      setWashingFaq(updatedFaqs);
      const success = await saveDatabase({ washingFaq: updatedFaqs });
      if (success) {
        setAdminSuccess('FAQ Question added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'blog') {
      if (!newBlogTitle.trim() || !newBlogContent.trim()) {
        setAdminError('Blog Title and Content are required.');
        return;
      }
      const computedId = 'blog-' + Date.now();
      const newB = {
        id: computedId,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        imageUrl: newBlogImageUrl.trim() || 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: newBlogAuthor.trim() || 'WonderPads'
      };
      const updatedBlogs = [...blogPosts, newB];
      setBlogPosts(updatedBlogs);
      const success = await saveDatabase({ blogPosts: updatedBlogs });
      if (success) {
        setAdminSuccess('Blog Post added successfully!');
        resetAddFormStates();
      }
    }
  };

  const startEditingUnifiedItem = (type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', item: any) => {
    setAdminError('');
    setAdminSuccess('');
    setAdminEditingItem({ type, data: item });
    
    if (type === 'fabric') {
      setNewFabName(item.name || '');
      setNewFabCategory(item.type === 'backing' ? 'Backing Fabric' : (item.category || 'Flowers'));
      setNewFabMaterial(item.material || '');
      setNewFabPremium((item.premium || 0).toString());
      setNewFabProperties((item.properties || []).join(', '));
      setNewFabStock(item.stockStatus || 'in_stock');
      setNewFabImageUrl(item.imageUrl || '');
    }
    else if (type === 'pad') {
      setNewRtsName(item.name || '');
      setNewRtsDescription(item.description || '');
      setNewRtsPrice((item.price || 15.00).toString());
      setNewRtsSize(item.size || '8 inch');
      setNewRtsPrint(item.print || '');
      setNewRtsAbsorbency(item.absorbency || 'Moderate dry');
      setNewRtsQuantity((item.quantityLeft || 1).toString());
      setNewRtsImageUrl(item.imageUrl || '');
      setNewRtsNotes(item.adminNotes || '');
    }
    else if (type === 'size') {
      setNewSizeId(item.id || '');
      setNewSizeName(item.name || '');
      setNewSizeLabel(item.displayLabel || '');
      setNewSizeLength((item.lengthInches || 8).toString());
      setNewSizePrice((item.basePrice || 11.00).toString());
      setNewSizeDescription(item.description || '');
    }
    else if (type === 'faq') {
      setNewFaqQuestion(item.question || '');
      setNewFaqAnswer(item.answer || '');
    }
    else if (type === 'blog') {
      setNewBlogTitle(item.title || '');
      setNewBlogContent(item.content || '');
      setNewBlogImageUrl(item.imageUrl || '');
      setNewBlogAuthor(item.author || 'WonderPads');
    }
  };

  const handleSaveUnifiedEdit = async () => {
    if (!adminEditingItem) return;
    setAdminError('');
    setAdminSuccess('');
    const { type, data } = adminEditingItem;
    
    if (type === 'fabric') {
      if (!newFabName.trim()) {
        setAdminError('Fabric print name is required.');
        return;
      }
      const isBacking = newFabCategory === 'Backing Fabric';
      const updatedFab = {
        ...data,
        name: newFabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: newFabMaterial.trim() || 'Cotton Woven',
        imageUrl: newFabImageUrl.trim() || data.imageUrl,
        premium: parseFloat(newFabPremium) || 0,
        properties: newFabProperties.split(',').map((s: string) => s.trim()).filter(Boolean),
        stockStatus: newFabStock,
        category: isBacking ? 'Backing Fabric' : newFabCategory
      };
      
      let updatedTop = fabricsTop.filter(x => x.id !== data.id);
      let updatedBacking = fabricsBacking.filter(x => x.id !== data.id);
      
      if (updatedFab.type === 'top') {
        updatedTop.push(updatedFab);
      } else {
        updatedBacking.push(updatedFab);
      }
      
      setFabricsTop(updatedTop);
      setFabricsBacking(updatedBacking);
      
      const success = await saveDatabase({ fabricsTop: updatedTop, fabricsBacking: updatedBacking });
      if (success) {
        setAdminSuccess('Fabric print updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'pad') {
      if (!newRtsAbsorbency) {
        setAdminError('Product Type is required.');
        return;
      }
      const calculatedName = RTS_NAME_MAP[newRtsAbsorbency] || newRtsAbsorbency;
      const updatedRtsItem = {
        ...data,
        name: calculatedName,
        description: newRtsDescription.trim(),
        price: parseFloat(newRtsPrice) || 15.00,
        quantityLeft: parseInt(newRtsQuantity) || 1,
        size: newRtsSize || '8 inch',
        sizeLabel: newRtsSize || '8 inch',
        print: newRtsPrint.trim(),
        printLabel: newRtsPrint.trim(),
        absorbency: newRtsAbsorbency,
        absorbencyLabel: newRtsAbsorbency,
        imageUrl: newRtsImageUrl.trim() || data.imageUrl,
        adminNotes: newRtsNotes.trim()
      };
      
      const updatedList = readyMadeStocks.map(x => x.id === data.id ? updatedRtsItem : x);
      setReadyMadeStocks(updatedList);
      
      const success = await saveDatabase({ readyMadeStocks: updatedList });
      if (success) {
        setAdminSuccess('Ready-Made Pad updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'size') {
      if (!newSizeName.trim()) {
        setAdminError('Size name is required.');
        return;
      }
      const updatedSizeItem = {
        ...data,
        name: newSizeName.trim(),
        lengthInches: parseFloat(newSizeLength) || 8,
        basePrice: parseFloat(newSizePrice) || 11.00,
        description: newSizeDescription.trim(),
        displayLabel: newSizeLabel.trim() || `${newSizeName.trim()} (${newSizeLength} inch)`
      };
      
      const updatedList = sizeOptions.map(x => x.id === data.id ? updatedSizeItem : x);
      setSizeOptions(updatedList);
      
      const success = await saveDatabase({ sizeOptions: updatedList });
      if (success) {
        setAdminSuccess('Pad Size updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'faq') {
      if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
        setAdminError('Question and Answer are required.');
        return;
      }
      const updatedFaqItem = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      };
      
      // Since FAQs don't have IDs, we match by the original question text
      const updatedList = washingFaq.map(x => x.question === data.question ? updatedFaqItem : x);
      setWashingFaq(updatedList);
      
      const success = await saveDatabase({ washingFaq: updatedList });
      if (success) {
        setAdminSuccess('FAQ updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'blog') {
      if (!newBlogTitle.trim() || !newBlogContent.trim()) {
        setAdminError('Blog Title and Content are required.');
        return;
      }
      const updatedBlogItem = {
        ...data,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        imageUrl: newBlogImageUrl.trim() || data.imageUrl,
        author: newBlogAuthor.trim() || 'WonderPads'
      };
      
      const updatedList = blogPosts.map(x => x.id === data.id ? updatedBlogItem : x);
      setBlogPosts(updatedList);
      
      const success = await saveDatabase({ blogPosts: updatedList });
      if (success) {
        setAdminSuccess('Blog Post updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
  };

  const toggleHideLookbookInBackOffice = async (val: boolean) => {
    setHideLookbookInBackOffice(val);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('hide_lookbook_back_office', String(val));
      }
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
    
    // Auto-save instantly to the backend database
    const success = await saveDatabase({
      fabricsTop,
      fabricsBacking,
      sizeOptions,
      absorbencyOptions,
      readyMadeStocks,
      shapeOptions,
      washingFaq,
      settings: {
        adminPassword: activePassword,
        categories,
        shopLogoUrl,
        merchantEmail,
        merchantPhone,
        hideLookbookInBackOffice: val
      }
    });
    if (success) {
      setAdminSuccess(`R2 Storage photo library is now ${val ? 'HIDDEN' : 'LIVE'}!`);
      setTimeout(() => setAdminSuccess(''), 3000);
    }
    return success;
  };

  // Publish changes to GitHub helper
  const publishToGithub = async () => {
    if (!ghOwner || !ghRepo) {
      setAdminError('Please fill in your GitHub Owner and Repository name in the GitHub Sync section.');
      return;
    }

    setIsPublishingToGithub(true);
    setAdminSuccess('');
    setAdminError('');

    try {
      // First, save the current local state to the backend database to make sure it's up to date!
      const currentDbPayload = {
        fabricsTop,
        fabricsBacking,
        sizeOptions,
        absorbencyOptions,
        readyMadeStocks,
        shapeOptions,
        washingFaq,
        settings: {
          adminPassword: activePassword,
          categories,
          shopLogoUrl,
          merchantEmail,
          merchantPhone
        }
      };

      const saveOk = await saveDatabase(currentDbPayload);
      if (!saveOk) {
        throw new Error('Could not pre-save database changes to backend before publishing.');
      }

      // Now call our new endpoint to push the file to GitHub
      const res = await fetch('/api/github/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': activePassword
        },
        body: JSON.stringify({
          owner: ghOwner,
          repo: ghRepo,
          branch: ghBranch,
          commitMessage: ghCommitMsg
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save GitHub configuration locally to avoid retyping in future sessions
        // (the token itself is never stored here - it lives server-side only)
        localStorage.setItem('gh_sync_owner', ghOwner);
        localStorage.setItem('gh_sync_repo', ghRepo);
        localStorage.setItem('gh_sync_branch', ghBranch);

        setAdminSuccess(`Successfully published changes directly to GitHub! Commit: ${data.commitSha.substring(0, 7)}`);
      } else {
        throw new Error(data.error || 'GitHub publish failed.');
      }
    } catch (err: any) {
      console.error('Error publishing to GitHub:', err);
      setAdminError('Failed to publish: ' + err.message);
    } finally {
      setIsPublishingToGithub(false);
    }
  };

  // Helper to begin editing a fabric
  const startEditingFabric = (fab: FabricOption) => {
    setEditingFabric(fab);
    setEditFabName(fab.name);
    setEditFabCategory(fab.type === 'backing' ? 'Backing Fabric' : (fab.category || 'Flowers'));
    setEditFabMaterial(fab.material || '');
    setEditFabPremium((fab.premium || 0).toFixed(2));
    setEditFabProperties((fab.properties || []).join(', '));
    setEditFabStock(fab.stockStatus || 'in_stock');
    setEditFabImageUrl(fab.imageUrl || '');
    setEditFabHidden(!!fab.hidden);
    setAdminError('');
    setAdminSuccess('');
  };

  // Helper to toggle a fabric's hidden/live status with a single tap
  const toggleFabricVisibility = async (fab: FabricOption) => {
    const isTop = fab.type === 'top';
    const listToUpdate = isTop ? fabricsTop : fabricsBacking;
    const updatedList = listToUpdate.map(f => f.id === fab.id ? { ...f, hidden: !f.hidden } : f);
    
    if (isTop) {
      setFabricsTop(updatedList);
    } else {
      setFabricsBacking(updatedList);
    }
    
    await saveDatabase({
      fabricsTop: isTop ? updatedList : fabricsTop,
      fabricsBacking: isTop ? fabricsBacking : updatedList,
      sizeOptions,
      absorbencyOptions,
      readyMadeStocks,
      shapeOptions,
      washingFaq,
      settings: { adminPassword: activePassword }
    });
  };

  // Helper to toggle an RTS item's hidden/live status with a single tap
  const toggleRtsVisibility = async (item: any) => {
    const updated = readyMadeStocks.map(r => r.id === item.id ? { ...r, hidden: !r.hidden } : r);
    setReadyMadeStocks(updated);
    
    await saveDatabase({
      fabricsTop,
      fabricsBacking,
      sizeOptions,
      absorbencyOptions,
      readyMadeStocks: updated,
      shapeOptions,
      washingFaq,
      settings: { adminPassword: activePassword }
    });
  };

  // Save changes to edited fabric
  const handleSaveFabricEdit = async () => {
    if (!editingFabric) return;
    if (!editFabName.trim()) {
      setAdminError('Fabric name cannot be empty.');
      return;
    }

    const isNewBacking = editFabCategory === 'Backing Fabric';
    const updatedFabric: FabricOption = {
      ...editingFabric,
      name: editFabName,
      type: isNewBacking ? 'backing' : 'top',
      category: isNewBacking ? 'Backing Fabric' : editFabCategory,
      material: editFabMaterial || 'Cotton Woven',
      premium: parseFloat(editFabPremium) || 0,
      properties: editFabProperties.split(',').map(s => s.trim()).filter(Boolean),
      stockStatus: editFabStock,
      imageUrl: editFabImageUrl || editingFabric.imageUrl,
      hidden: editFabHidden
    };

    let updatedTop = [...fabricsTop];
    let updatedBacking = [...fabricsBacking];

    // Remove from both lists to allow safe type migration or replacement
    updatedTop = updatedTop.filter(x => x.id !== editingFabric.id);
    updatedBacking = updatedBacking.filter(x => x.id !== editingFabric.id);

    // Insert into correct list
    if (updatedFabric.type === 'top') {
      updatedTop.push(updatedFabric);
    } else {
      updatedBacking.push(updatedFabric);
    }

    // Update states
    setFabricsTop(updatedTop);
    setFabricsBacking(updatedBacking);

    const success = await saveDatabase({
      fabricsTop: updatedTop,
      fabricsBacking: updatedBacking,
      sizeOptions,
      absorbencyOptions,
      readyMadeStocks,
      shapeOptions,
      washingFaq,
      settings: {
        adminPassword: activePassword,
        categories
      }
    });

    if (success) {
      setAdminSuccess('Fabric updated successfully!');
      setEditingFabric(null); // Exit edit mode
    } else {
      setAdminError('Failed to save changes.');
    }
  };

  // Bulk Import & Synchronize fabrics from R2 Storage by tag name
  const handleBulkTagImport = async () => {
    if (!bulkImportTag.trim()) {
      setAdminError('R2 Bucket Tag name cannot be empty.');
      return;
    }
    try {
      setIsBulkImporting(true);
      setAdminError('');
      
      const tagInfo = bulkImportCategoryTag.trim()
        ? `master tag "${bulkImportTag}" and category tag "${bulkImportCategoryTag}"`
        : `tag "${bulkImportTag}"`;

      setAdminSuccess(`Fetching assets for ${tagInfo}...`);
      
      const queryTag = encodeURIComponent(bulkImportTag.trim());
      const queryCatTag = bulkImportCategoryTag.trim() ? `&categoryTag=${encodeURIComponent(bulkImportCategoryTag.trim())}` : '';
      const res = await fetch(`/api/media/photos?tag=${queryTag}${queryCatTag}`);
      
      if (!res.ok) {
        throw new Error('Failed to query R2 storage API for ' + tagInfo);
      }
      const data = await res.json();
      if (data && 'isMock' in data) {
        setIsR2Mock(!!data.isMock);
      }
      if (data && Array.isArray(data.missingVars)) {
        setMissingR2Vars(data.missingVars);
      } else {
        setMissingR2Vars([]);
      }
      if (!data || !Array.isArray(data.photos) || data.photos.length === 0) {
        throw new Error(`No photos found in R2 storage matching ${tagInfo}.`);
      }

      let importedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      const isBacking = bulkImportType === 'Backing Fabric';
      const currentList = isBacking ? fabricsBacking : fabricsTop;
      const updatedList = [...currentList];

      const updatedCategoriesSet = new Set(categories);
      let categoriesAdded = false;

      // Helper helper to clean, match, or dynamically create standard & custom categories
      const getAutoCategory = (rawName: string): string => {
        const lower = rawName.trim().toLowerCase();
        
        // Match common synonyms of active categories
        if (lower === 'floral' || lower === 'florals' || lower === 'flower' || lower === 'flowers') {
          return 'Flowers';
        }
        if (lower === 'animal' || lower === 'animals') {
          return 'Animal';
        }
        if (lower === 'character' || lower === 'characters') {
          return 'Characters';
        }
        if (lower === 'organic solid' || lower === 'organic solids' || lower === 'solid' || lower === 'solids') {
          return 'Organic solid';
        }
        if (lower === 'new arrival' || lower === 'new arrivals') {
          return 'New arrivals';
        }
        if (lower === 'leaving soon') {
          return 'Leaving soon';
        }
        if (lower === 'geoed' || lower === 'geo') {
          return 'Geoed';
        }
        if (lower === 'halloween') {
          return 'Halloween';
        }
        if (lower === 'kimmi') {
          return 'Kimmi';
        }

        // Search case-insensitively in current categories list
        const matched = Array.from(updatedCategoriesSet).find(c => c.toLowerCase() === lower);
        if (matched) return matched;

        // Auto-create category: clean and format nicely to Title Case
        const formatted = rawName.trim()
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        
        updatedCategoriesSet.add(formatted);
        categoriesAdded = true;
        return formatted;
      };

      for (const p of data.photos) {
        let itemCategory = bulkImportType;

        // Auto-detect category from R2 key folder OR prefix
        if (!isBacking) {
          const keyParts = p.public_id.split('/');
          
          if (keyParts.length > 2) {
            // Case 1: Subfolders present (e.g., wpfabrics/Flowers/Vintage Rose.jpg)
            const subfolder = keyParts[1].trim();
            if (subfolder && subfolder.toLowerCase() !== 'backing fabric') {
              itemCategory = getAutoCategory(subfolder);
            }
          } else if (keyParts.length === 2) {
            // Case 2: Folder name is the first part (e.g., MyFolder1/Daisies.jpg)
            const folderName = keyParts[0].trim();
            if (folderName && folderName.toLowerCase() !== 'wpfabrics' && folderName.toLowerCase() !== 'backing fabric') {
              itemCategory = getAutoCategory(folderName);
            } else {
              // Files uploaded directly (e.g., wpfabrics/Florals_01.jpg)
              const filenameWithExt = keyParts[1];
              const dotIndex = filenameWithExt.lastIndexOf('.');
              const filename = dotIndex !== -1 ? filenameWithExt.substring(0, dotIndex) : filenameWithExt;
              
              // Extract the prefix portion before first space, underscore, dash, or number
              // e.g. "Florals_01" -> "Florals", "Kimmi-abc" -> "Kimmi", "Abstract 03" -> "Abstract"
              let prefix = filename.split(/[\s_#-]/)[0];
              const letterNumberMatch = filename.match(/^([A-Za-z]+)(\d+)/);
              if (letterNumberMatch) {
                prefix = letterNumberMatch[1];
              }
              
              if (prefix && prefix.length > 2) {
                itemCategory = getAutoCategory(prefix);
              }
            }
          }
        }

        const cleanName = p.filename
          ? p.filename
            .substring(0, p.filename.lastIndexOf('.')) // strip extension if present
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase())
          : 'Wonder Fabric ' + p.public_id.split('/').pop();

        const computedId = cleanName.toLowerCase().replace(/\s+/g, '-');
        
        // Find if this item already exists in the list (by URL or by ID)
        const existingIndex = updatedList.findIndex(item => item.imageUrl === p.secure_url || item.id === computedId);

        if (existingIndex !== -1) {
          const existingItem = { ...updatedList[existingIndex] };
          const newProperties = bulkImportCategoryTag.trim()
            ? ['R2_Storage', bulkImportTag, bulkImportCategoryTag]
            : ['R2_Storage', bulkImportTag];
            
          // Preserve existing category, material, and properties if they are already defined to prevent overwriting manual edits (such as the "Batik" category) during bulk sync
          const hasExistingCategory = !!existingItem.category;
          const isCategoryChanged = !hasExistingCategory && (existingItem.category !== itemCategory);
          const isMaterialChanged = !existingItem.material && (existingItem.material !== (bulkImportMaterial || 'Cotton Woven'));
          const isPropertiesChanged = !existingItem.properties && (JSON.stringify(existingItem.properties) !== JSON.stringify(newProperties));
          
          if (isCategoryChanged || isMaterialChanged || isPropertiesChanged || existingItem.hidden) {
            if (!hasExistingCategory) {
              existingItem.category = itemCategory;
            }
            if (!existingItem.material) {
              existingItem.material = bulkImportMaterial || 'Cotton Woven';
            }
            if (!existingItem.properties) {
              existingItem.properties = newProperties;
            }
            existingItem.hidden = false; // ensure visible
            existingItem.description = existingItem.description || `Wonder Premium Pattern, batch-imported matching ${tagInfo}`;
            updatedList[existingIndex] = existingItem;
            updatedCount++;
          } else {
            skippedCount++;
          }
          continue;
        }

        const newFab: FabricOption = {
          id: computedId,
          name: cleanName,
          type: isBacking ? 'backing' : 'top',
          material: bulkImportMaterial || 'Cotton Woven',
          description: `Wonder Premium Pattern, batch-imported matching ${tagInfo}`,
          colorHex: '#ffffff',
          imageUrl: p.secure_url,
          premium: 0,
          properties: bulkImportCategoryTag.trim()
            ? ['R2_Storage', bulkImportTag, bulkImportCategoryTag]
            : ['R2_Storage', bulkImportTag],
          stockStatus: 'in_stock',
          category: itemCategory
        };

        updatedList.push(newFab);
        importedCount++;
      }

      if (importedCount === 0 && updatedCount === 0) {
        setAdminSuccess('');
        setAdminError(`All ${skippedCount} items matching ${tagInfo} are already in your catalog!`);
        return;
      }

      if (categoriesAdded) {
        const catArray = Array.from(updatedCategoriesSet);
        setCategories(catArray);
        setEditingCategoriesText(catArray.join('\n'));
      }

      // Update appropriate state
      if (isBacking) {
        setFabricsBacking(updatedList);
      } else {
        setFabricsTop(updatedList);
      }

      // Save database
      const success = await saveDatabase({
        fabricsTop: !isBacking ? updatedList : fabricsTop,
        fabricsBacking: isBacking ? updatedList : fabricsBacking,
        sizeOptions,
        absorbencyOptions,
        readyMadeStocks,
        shapeOptions,
        washingFaq,
        settings: { 
          adminPassword: activePassword,
          categories: Array.from(updatedCategoriesSet)
        }
      });

      if (success) {
        // Merge fetched photos with lookbook
        setMediaPhotos(prev => {
          const combined = [...data.photos, ...prev];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.public_id === v.public_id) === i);
          return unique;
        });

        const summary = [
          importedCount > 0 ? `${importedCount} new fabrics imported` : null,
          updatedCount > 0 ? `${updatedCount} existing fabrics updated` : null,
          skippedCount > 0 ? `${skippedCount} unchanged fabrics skipped` : null
        ].filter(Boolean).join(', ');

        setAdminError('');
        setAdminSuccess(`Success! Synced matching ${tagInfo}: ${summary}.`);
      }
    } catch (err: any) {
      console.error(err);
      setAdminSuccess('');
      setAdminError(err.message || 'An error occurred during bulk import.');
    } finally {
      setIsBulkImporting(false);
    }
  };

  // Bulk Import & Sync RTS Items from R2 Storage by tag name
  const handleRtsBulkTagImport = async () => {
    if (!rtsBulkImportTag.trim()) {
      setAdminError('RTS R2 Master Tag name cannot be empty.');
      return;
    }
    try {
      setIsRtsBulkImporting(true);
      setAdminError('');

      const tagInfo = rtsBulkImportCategoryTag.trim()
        ? `master tag "${rtsBulkImportTag}" and category tag "${rtsBulkImportCategoryTag}"`
        : `tag "${rtsBulkImportTag}"`;

      setAdminSuccess(`Fetching RTS assets for ${tagInfo}...`);
      
      const queryTag = encodeURIComponent(rtsBulkImportTag.trim());
      const queryCatTag = rtsBulkImportCategoryTag.trim() ? `&categoryTag=${encodeURIComponent(rtsBulkImportCategoryTag.trim())}` : '';
      const res = await fetch(`/api/media/photos?tag=${queryTag}${queryCatTag}`);

      if (!res.ok) {
        throw new Error('Failed to query R2 storage API for ' + tagInfo);
      }
      const data = await res.json();
      if (data && 'isMock' in data) {
        setIsR2Mock(!!data.isMock);
      }
      if (data && Array.isArray(data.missingVars)) {
        setMissingR2Vars(data.missingVars);
      } else {
        setMissingR2Vars([]);
      }
      if (!data || !Array.isArray(data.photos) || data.photos.length === 0) {
        throw new Error(`No photos found in R2 storage matching ${tagInfo}.`);
      }

      let importedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      const updatedRts = [...readyMadeStocks];

      for (let i = 0; i < data.photos.length; i++) {
        const p = data.photos[i];
        
        const cleanName = p.filename
          ? p.filename
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase())
          : 'Wonder RTS ' + p.public_id.split('/').pop();

        const computedId = 'rts-' + p.public_id.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '-') || `rts-bulk-${Date.now()}-${i}`;
        
        // Find if this item already exists in readyMadeStocks (by URL or by ID)
        const existingIndex = updatedRts.findIndex(item => item.imageUrl === p.secure_url || item.id === computedId);

        // Determine size, absorbency, description and price based on selected rtsBulkImportCategory
        let guessedSize = 'Regular Day (8")';
        let guessedAbsorbency = 'Moderate dry';
        let rtsDescription = `Pre-crafted limited release pack ready for immediate dispatch, batch-imported matching ${tagInfo}`;

        if (rtsBulkImportCategory === 'liner') {
          guessedSize = 'Light Flow Liner (6.5")';
          guessedAbsorbency = 'Light flow liner';
          rtsDescription = STANDARD_DESCRIPTIONS['Liner'] || rtsDescription;
        } else if (rtsBulkImportCategory === 'light') {
          guessedSize = 'Regular Day (8")';
          guessedAbsorbency = 'Moderate dry';
          rtsDescription = STANDARD_DESCRIPTIONS['Light'] || rtsDescription;
        } else if (rtsBulkImportCategory === 'moderate') {
          guessedSize = 'Regular Day (8")';
          guessedAbsorbency = 'Moderate dry';
          rtsDescription = STANDARD_DESCRIPTIONS['Moderate'] || rtsDescription;
        } else if (rtsBulkImportCategory === 'heavy') {
          guessedSize = 'Heavy Glow (10")';
          guessedAbsorbency = 'Heavy absorbency';
          rtsDescription = STANDARD_DESCRIPTIONS['Heavy'] || rtsDescription;
        } else if (rtsBulkImportCategory === 'extra long') {
          guessedSize = 'Overnight Guard (12")';
          guessedAbsorbency = 'Heavy absorbency';
          rtsDescription = STANDARD_DESCRIPTIONS['Extra long'] || rtsDescription;
        }

        let calculatedRtsName = cleanName;
        if (rtsBulkImportCategory === 'liner') {
          calculatedRtsName = '🌿 Liner';
        } else if (rtsBulkImportCategory === 'light') {
          calculatedRtsName = '🌸 Light';
        } else if (rtsBulkImportCategory === 'moderate') {
          calculatedRtsName = '🌺 Moderate';
        } else if (rtsBulkImportCategory === 'heavy') {
          calculatedRtsName = '🌹 Heavy';
        } else if (rtsBulkImportCategory === 'extra long') {
          calculatedRtsName = '🌼 Extra Long';
        }

        // Extracted print name (defaults to cleaned name minus descriptors)
        let guessedPrint = cleanName
          .replace(/\b(Regular Day|Heavy Glow|Overnight Guard|Light Flow Liner|Maxi Queen|Regular|Day|Heavy|Glow|Overnight|Guard|Light|Flow|Liner|Maxi|Queen|Absorbency|Moderate|Dry|Wet|Pads?|Bundle|Pack|Wonder|Wonder|Custom)\b/gi, '')
          .trim();
        if (!guessedPrint) {
          guessedPrint = cleanName;
        }

        const parsedPrice = parseFloat(rtsBulkDefaultPrice);
        let finalPrice = (rtsBulkDefaultPrice === '' || isNaN(parsedPrice) || parsedPrice === 0) ? 0.00 : parsedPrice;
        
        // If user left price as default 0.00 or empty, we assign a smart default price matching the category base price
        if (finalPrice === 0) {
          if (rtsBulkImportCategory === 'liner') finalPrice = 5.50;
          else if (rtsBulkImportCategory === 'light') finalPrice = 8.00;
          else if (rtsBulkImportCategory === 'moderate') finalPrice = 11.00;
          else if (rtsBulkImportCategory === 'heavy') finalPrice = 14.00;
          else if (rtsBulkImportCategory === 'extra long') finalPrice = 15.00;
        }

        const parsedQty = parseInt(rtsBulkDefaultQty);
        const finalQty = (rtsBulkDefaultQty === '' || isNaN(parsedQty)) ? 0 : parsedQty;

        if (existingIndex !== -1) {
          const existingItem = { ...updatedRts[existingIndex] };
          
          const isQtyChanged = rtsBulkDefaultQty !== '' && !isNaN(parsedQty) && existingItem.quantityLeft !== finalQty;
          const isPriceChanged = rtsBulkDefaultPrice !== '' && !isNaN(parsedPrice) && parsedPrice !== 0 && existingItem.price !== finalPrice;
          const isCategoryOrSettingsChanged = existingItem.size !== guessedSize || existingItem.absorbency !== guessedAbsorbency || existingItem.name !== calculatedRtsName;

          if (isQtyChanged || isPriceChanged || isCategoryOrSettingsChanged) {
            existingItem.name = calculatedRtsName;
            existingItem.description = rtsDescription;
            if (isPriceChanged) existingItem.price = finalPrice;
            if (isQtyChanged) existingItem.quantityLeft = finalQty;
            existingItem.size = guessedSize;
            existingItem.sizeLabel = guessedSize;
            existingItem.print = cleanName;
            existingItem.printLabel = cleanName;
            existingItem.absorbency = guessedAbsorbency;
            existingItem.absorbencyLabel = guessedAbsorbency;
            
            updatedRts[existingIndex] = existingItem;
            updatedCount++;
          } else {
            skippedCount++;
          }
          continue;
        }

        const newRtsItem = {
          id: computedId,
          name: calculatedRtsName,
          description: rtsDescription,
          price: finalPrice,
          quantityLeft: finalQty,
          size: guessedSize,
          sizeLabel: guessedSize,
          print: cleanName,
          printLabel: cleanName,
          absorbency: guessedAbsorbency,
          absorbencyLabel: guessedAbsorbency,
          imageUrl: p.secure_url,
          adminNotes: ''
        };

        updatedRts.push(newRtsItem);
        importedCount++;
      }

      if (importedCount === 0 && updatedCount === 0) {
        setAdminSuccess('');
        setAdminError(`All ${skippedCount} items matching ${tagInfo} are already in your RTS catalog!`);
        return;
      }

      setReadyMadeStocks(updatedRts);

      const success = await saveDatabase({
        fabricsTop,
        fabricsBacking,
        sizeOptions,
        absorbencyOptions,
        readyMadeStocks: updatedRts,
        shapeOptions,
        washingFaq,
        settings: { adminPassword: activePassword }
      });

      if (success) {
        // Also merge into Lookbook/R2 Photos list so it's populated
        setMediaPhotos(prev => {
          const combined = [...data.photos, ...prev];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.public_id === v.public_id) === i);
          return unique;
        });

        const summary = [
          importedCount > 0 ? `${importedCount} new items imported` : null,
          updatedCount > 0 ? `${updatedCount} existing items updated` : null,
          skippedCount > 0 ? `${skippedCount} unchanged items skipped` : null
        ].filter(Boolean).join(', ');

        setAdminError('');
        setAdminSuccess(`Success! Synced RTS matching ${tagInfo}: ${summary}.`);
      }
    } catch (err: any) {
      console.error(err);
      setAdminSuccess('');
      setAdminError(err.message || 'An error occurred during RTS bulk import.');
    } finally {
      setIsRtsBulkImporting(false);
    }
  };

  // Bulk Rename all top fabrics in sequential order (keeping defaults intact, starting patterns from 01 per category)
  const handleBulkSequentialRename = async () => {
    try {
      setAdminError('');
      setAdminSuccess('Running bulk sequential rename...');

      const defaultIds = ['sunglow', 'moonrise', 'lilac', 'sage'];

      // Split into defaults and custom patterns
      const defaults = fabricsTop.filter(f => defaultIds.includes(f.id));
      const patterns = fabricsTop.filter(f => !defaultIds.includes(f.id));

      // Get unique categories present in the custom patterns (or default to 'Flowers' if undefined)
      const categoriesPresent = Array.from(new Set(patterns.map(f => f.category || 'Flowers')));
      
      const renamedPatterns: FabricOption[] = [];

      for (const cat of categoriesPresent) {
        const catPatterns = patterns.filter(f => (f.category || 'Flowers') === cat);
        // Sort patterns alphabetically within this category
        const sorted = [...catPatterns].sort((a, b) => 
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        );
        
        sorted.forEach((fabric, index) => {
          const formattedNum = (index + 1).toString().padStart(2, '0');
          // e.g. "Flowers 01" or "Kimmi 01"
          const safeCatSlug = cat.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          const cleanId = `${safeCatSlug}-${formattedNum}`;
          const cleanName = `${cat} ${formattedNum}`;
          
          renamedPatterns.push({
            ...fabric,
            id: cleanId,
            name: cleanName
          });
        });
      }

      const updatedTop = [...defaults, ...renamedPatterns];

      // Save database
      const success = await saveDatabase({
        fabricsTop: updatedTop,
        fabricsBacking,
        sizeOptions,
        absorbencyOptions,
        readyMadeStocks,
        shapeOptions,
        washingFaq,
        settings: { adminPassword: activePassword }
      });

      if (success) {
        setFabricsTop(updatedTop);
        setAdminError('');
        setAdminSuccess(`Success! All non-standard fabrics have been sequentially renamed by category (e.g. Flowers 01, Kimmi 01).`);
      } else {
        throw new Error('Failed to save updated fabrics list to the cloud database.');
      }
    } catch (err: any) {
      console.error(err);
      setAdminSuccess('');
      setAdminError(err.message || 'An error occurred during bulk renaming.');
    }
  };

  // Upload file helper
  const handleUploadToR2 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/media/upload', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Admin-Password': activePassword
            },
            body: JSON.stringify({ image: base64Data }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data.photo.secure_url);
          } else {
            reject(new Error('R2 upload failed'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Sub-option tab within Step 1 (OPTIONS)
  const [selectedOptionTab, setSelectedOptionTab] = useState<'bespoke' | 'ready' | null>(null);
  const [openInfoCardId, setOpenInfoCardId] = useState<string | null>(null);
  const [landingSubView, setLandingSubView] = useState<'main' | 'make_your_pad'>('main');

  const handleSwatchClick = (categoryName: string) => {
    setSelectedOptionTab('bespoke');
    setCustomFlow('fabric');
    setFabricStep(1);
    setSelectedCategoryFilter(categoryName);
    setTimeout(() => {
      const el = document.getElementById('step-fabric-flow');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 100);
  };
  const [isRtsExpanded, setIsRtsExpanded] = useState<boolean>(false);
  const [isRtsPage, setIsRtsPage] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
  const getScrollToTopBottomClass = () => {
    const hasCart = cart.length > 0 && !isCartFloatingExpanded && !shouldShowCheckout;
    const isBespoke = selectedOptionTab === 'bespoke';
    const isStep3Bespoke = !shouldShowCheckout && isBespoke && activeStep === 3;
    const isStep4Bespoke = !shouldShowCheckout && isBespoke && activeStep === 4;
    
    if (hasCart) {
      if (isStep3Bespoke) return "bottom-48 sm:bottom-52"; // Above mini-cart AND live preview badge
      if (isStep4Bespoke) return "bottom-38 sm:bottom-42"; // Above mini-cart AND fabric swatch
      return "bottom-24 sm:bottom-28"; // Above just the mini-cart
    } else {
      if (isStep3Bespoke) return "bottom-32 sm:bottom-36"; // Above just the live preview badge
      if (isStep4Bespoke) return "bottom-24 sm:bottom-28"; // Above just the fabric swatch
      return "bottom-6 sm:bottom-8"; // Default bottom right position
    }
  };
  const [customFlow, setCustomFlow] = useState<'fabric' | 'size' | null>(null);
  const [fabricStep, setFabricStep] = useState<number>(1);
  const [selectedBespokeSizes, setSelectedBespokeSizes] = useState<string[]>(['light']);
  const [allowMultipleBespokePads, setAllowMultipleBespokePads] = useState<boolean>(false);

  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  const goToBespokeStep3WithSizes = (sizesList: string[]) => {
    if (sizesList.length === 0) {
      showToast("Please select at least one pad size to customize!", "info");
      return;
    }
    const SIZE_ORDER = ['liner', 'light', 'moderate', 'heavy', 'extra_long'];
    const sortedSizes = [...sizesList].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
    // Auto focus on the first selected size in Step 3
    const firstSizeId = sortedSizes[0];
    const firstSizeObj = sizeOptions.find(s => s.id === firstSizeId);
    if (firstSizeObj) {
      setDesignerSize(firstSizeObj);
      setActiveBespokeSizeId(firstSizeId);
      const localShapeId = selectedShapes[firstSizeId] || ((firstSizeId === 'liner' || firstSizeId === 'light') ? 'moon_rise' : 'sunglow');
      setDesignerShape(localShapeId);
    }
    setFabricStep(3);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  const selectActiveSizeTab = (sizeId: string) => {
    setActiveBespokeSizeId(sizeId);
    const szObj = sizeOptions.find(s => s.id === sizeId) || sizeOptions[1] || SIZE_OPTIONS[1];
    const localL = selectedLengths[sizeId] || szObj.lengthInches;
    const localAbsName = selectedAbsorbencies[sizeId] || 'Standard core';
    const localBackingName = selectedBackings[sizeId] || (sizeId === 'liner' ? 'Printed Cotton' : sizeId === 'light' ? 'White softshell fleece' : 'Black softshell fleece');
    const localPrint = selectedPrints[sizeId] || designerPrint.name || 'No Pattern Selected';

    let localShape = selectedShapes[sizeId] || ((sizeId === 'liner' || sizeId === 'light') ? 'moon_rise' : (sizeId === 'moderate' || sizeId === 'heavy') ? 'sunglow' : 'mega_pad');
    if (!isShapeAllowed(localShape, localL)) {
      localShape = getFallbackShapeForLength(localL);
    }

    setDesignerSize({ ...szObj, lengthInches: localL });
    setDesignerShape(localShape);
    setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsName) || ABSORBENCY_OPTIONS[0]);
    setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || fabricsBacking[0] || FABRICS_BACKING[0]);
    setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
  };

  const toggleBespokeSize = (sizeId: string) => {
    setSelectedBespokeSizes(prev => {
      let next;
      if (prev.includes(sizeId)) {
        if (prev.length === 1 && !allowMultipleBespokePads) {
          showToast("Please select at least one pad size to customize!", "info");
          return prev;
        }
        setQuantities(q => ({ ...q, [sizeId]: 0 }));
        next = prev.filter(id => id !== sizeId);
      } else {
        setQuantities(q => ({ ...q, [sizeId]: 1 }));
        next = [...prev, sizeId];
      }
      const SIZE_ORDER = ['liner', 'light', 'moderate', 'heavy', 'extra_long'];
      return next.sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
    });
  };

  const [showKeepFabricPrompt, setShowKeepFabricPrompt] = useState<boolean>(false);

  // Workflow B (Start with Need) specific guided wizard states
  const [selectedNeedAbsorbency, setSelectedNeedAbsorbency] = useState<string>('liner');
  const [selectedNeedLength, setSelectedNeedLength] = useState<number>(6);
  const [selectedNeedShape, setSelectedNeedShape] = useState<string>('moon_rise');
  const [selectedNeedFabric, setSelectedNeedFabric] = useState<FabricOption>(NONE_FABRIC);
  const [selectedNeedQty, setSelectedNeedQty] = useState<number>(1);
  const [selectedNeedBacking, setSelectedNeedBacking] = useState<string>('Printed Cotton');
  const [selectedNeedAbsorbencyLiner, setSelectedNeedAbsorbencyLiner] = useState<string>('Standard core');
  const [needStep, setNeedStep] = useState<number>(1);
  const [searchNeedFabric, setSearchNeedFabric] = useState<string>('');
  const [selectedNeedFabricCategory, setSelectedNeedFabricCategory] = useState<string>('All');

  const [showFabricExplanation, setShowFabricExplanation] = useState<boolean>(false);
  const [showNeedExplanation, setShowNeedExplanation] = useState<boolean>(false);

  const resetConfiguratorState = () => {
    // Reset Workflow A (Fabric-First) states
    setDesignerPrint(NONE_FABRIC);
    setDesignerSize(null);
    setDesignerShape('sunglow');
    setDesignerAbsorbency(ABSORBENCY_OPTIONS[1]);
    if (fabricsBacking.length > 0) {
      setDesignerBacking(fabricsBacking[0] || FABRICS_BACKING[0]);
    }
    
    setQuantities({
      liner: 0,
      light: 0,
      moderate: 0,
      heavy: 0,
      extra_long: 0
    });
    setSelectedPrints({
      liner: 'No Pattern Selected',
      light: 'No Pattern Selected',
      moderate: 'No Pattern Selected',
      heavy: 'No Pattern Selected',
      extra_long: 'No Pattern Selected'
    });
    setSelectedLengths({});
    setSelectedAbsorbencies({
      liner: 'Standard core',
      light: 'Standard core',
      moderate: 'Standard core',
      heavy: 'Standard core',
      extra_long: 'Standard core'
    });
    setSelectedBackings({
      liner: 'Printed Cotton',
      light: 'White softshell fleece',
      moderate: 'Black softshell fleece',
      heavy: 'Black softshell fleece',
      extra_long: 'Black softshell fleece'
    });
    setSelectedShapes({});
    setFabricStep(1);
    setSelectedBespokeSizes(['light']);

    // Reset Workflow B (Need-First) states
    setSelectedNeedAbsorbency('liner');
    setSelectedNeedLength(6);
    setSelectedNeedShape('moon_rise');
    setSelectedNeedFabric(NONE_FABRIC);
    setSelectedNeedQty(1);
    setSelectedNeedBacking('Printed Cotton');
    setSelectedNeedAbsorbencyLiner('Standard core');
    setSelectedNeedPrintIds([]);
    setSelectedNeedLengths({});
    setSelectedNeedShapes({});
    setSelectedNeedAbsorbencies({});
    setSelectedNeedBackings({});
    setNeedQuantities({});
    setActiveNeedPrintId('');
    setNeedStep(1);
  };

  // Multi-print support in Need-First Flow
  const [allowMultipleNeedPrints, setAllowMultipleNeedPrints] = useState<boolean>(false);
  const [selectedNeedPrintIds, setSelectedNeedPrintIds] = useState<string[]>([]);
  const [activeNeedPrintId, setActiveNeedPrintId] = useState<string>('');
  const [selectedNeedLengths, setSelectedNeedLengths] = useState<Record<string, number>>({});
  const [selectedNeedShapes, setSelectedNeedShapes] = useState<Record<string, string>>({});
  const [selectedNeedAbsorbencies, setSelectedNeedAbsorbencies] = useState<Record<string, string>>({});
  const [selectedNeedBackings, setSelectedNeedBackings] = useState<Record<string, string>>({});
  const [needQuantities, setNeedQuantities] = useState<Record<string, number>>({});

  const goToNeedStep3WithPrints = (printsList: string[]) => {
    if (printsList.length === 0) {
      showToast("Please select at least one fabric pattern to customize!", "info");
      return;
    }
    // Auto focus on the first selected print in Step 3
    const firstPrintId = printsList[0];
    setActiveNeedPrintId(firstPrintId);
    
    // Sync with visualizer state
    const firstPrintObj = fabricsTop.find(f => f.id === firstPrintId) || NONE_FABRIC;
    setDesignerPrint(firstPrintObj);

    const szObj = sizeOptions.find(s => s.id === selectedNeedAbsorbency) || sizeOptions[1] || SIZE_OPTIONS[1];
    setDesignerSize(szObj);

    const localLen = selectedNeedLengths[firstPrintId] || szObj.lengthInches;
    const localShape = selectedNeedShapes[firstPrintId] || ((szObj.id === 'liner' || szObj.id === 'light') ? 'moon_rise' : (szObj.id === 'moderate' || szObj.id === 'heavy') ? 'sunglow' : 'mega_pad');
    
    setDesignerShape(localShape);
    
    const localAbs = selectedNeedAbsorbencies[firstPrintId] || (szObj.id === 'liner' ? 'Standard core' : 'Standard core');
    setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbs) || ABSORBENCY_OPTIONS[0]);

    const localBacking = selectedNeedBackings[firstPrintId] || (szObj.id === 'liner' ? 'Printed Cotton' : szObj.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');
    setDesignerBacking(fabricsBacking.find(b => b.name === localBacking) || fabricsBacking[0] || FABRICS_BACKING[0]);

    setNeedStep(3);
  };

  const toggleNeedPrint = (printId: string) => {
    setSelectedNeedPrintIds(prev => {
      let next;
      if (prev.includes(printId)) {
        if (prev.length === 1) {
          showToast("Please select at least one fabric pattern to customize!", "info");
          return prev;
        }
        setNeedQuantities(q => ({ ...q, [printId]: 0 }));
        next = prev.filter(id => id !== printId);
      } else {
        setNeedQuantities(q => ({ ...q, [printId]: 1 }));
        next = [...prev, printId];
      }
      return next;
    });
  };

  const selectActiveNeedPrintTab = (printId: string) => {
    setActiveNeedPrintId(printId);
    const szObj = sizeOptions.find(s => s.id === selectedNeedAbsorbency) || sizeOptions[1] || SIZE_OPTIONS[1];
    const printObj = fabricsTop.find(f => f.id === printId) || NONE_FABRIC;
    setDesignerPrint(printObj);
    setDesignerSize(szObj);

    const localL = selectedNeedLengths[printId] || szObj.lengthInches;
    const localShape = selectedNeedShapes[printId] || ((szObj.id === 'liner' || szObj.id === 'light') ? 'moon_rise' : (szObj.id === 'moderate' || szObj.id === 'heavy') ? 'sunglow' : 'mega_pad');
    setDesignerShape(localShape);

    const localAbs = selectedNeedAbsorbencies[printId] || (szObj.id === 'liner' ? 'Standard core' : 'Standard core');
    setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbs) || ABSORBENCY_OPTIONS[0]);

    const localBacking = selectedNeedBackings[printId] || (szObj.id === 'liner' ? 'Printed Cotton' : szObj.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');
    setDesignerBacking(fabricsBacking.find(b => b.name === localBacking) || fabricsBacking[0] || FABRICS_BACKING[0]);
  };

  const handleAddNeedOptionToBasket = (printId: string) => {
    const qty = needQuantities[printId] || 0;
    if (qty <= 0) return;

    const matchedSize = sizeOptions.find(s => s.id === selectedNeedAbsorbency)!;
    const printObj = fabricsTop.find(f => f.id === printId) || NONE_FABRIC;

    const activeLength = selectedNeedLengths[printId] || matchedSize.lengthInches;
    let shapeId = selectedNeedShapes[printId] || 'moon_rise';
    if (!isShapeAllowed(shapeId, activeLength)) {
      shapeId = getFallbackShapeForLength(activeLength);
    }
    const matchedShape = SHAPE_OPTIONS.find(s => s.id === shapeId) || SHAPE_OPTIONS[0];

    const absVal = selectedNeedAbsorbency === 'liner' ? (selectedNeedAbsorbencies[printId] || 'Standard core') : 'Standard core';
    const backVal = selectedNeedAbsorbency === 'liner' ? (selectedNeedBackings[printId] || 'Printed Cotton') : (selectedNeedAbsorbency === 'light' ? 'White softshell fleece' : 'Black softshell fleece');

    const backingInfo = getBespokeBackingInfo(selectedNeedAbsorbency, backVal);
    const absInfo = getBespokeAbsorbencyInfo(selectedNeedAbsorbency, absVal);
    const sizeBasePrice = getBasePriceForSize(selectedNeedAbsorbency, activeLength, matchedSize.priceBase);

    const pricePerUnit = sizeBasePrice + absInfo.premium + backingInfo.premium;

    const newItem: CartItem = {
      id: `bespoke-need-${printId}-${Date.now()}`,
      sizeName: matchedSize.name,
      pricePerUnit: Number(pricePerUnit.toFixed(2)),
      lengthInches: activeLength,
      printName: printObj.name,
      absorbencyName: absInfo.name,
      backingName: backingInfo.name,
      shapeName: matchedShape.name,
      quantity: qty,
      totalPrice: Number((pricePerUnit * qty).toFixed(2)),
      imageUrl: printObj.imageUrl
    };

    const newCart = [...cart, newItem];
    saveCart(newCart);

    showToast(`Successfully added ${qty}x custom ${matchedSize.name} in ${printObj.name} to your basket!`, 'success');

    // Reset quantity for this print back to 0 on successful add
    setNeedQuantities(prev => ({ ...prev, [printId]: 0 }));

    if (!allowMultipleNeedPrints) {
      setNeedStep(1);
    }

    if (selectedNeedPrintIds.length <= 1) {
      resetConfiguratorState();
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);

  const getStepList = () => {
    return selectedOptionTab === 'ready'
      ? (cart.length > 0
          ? [
              { s: 1, id: 'step-1' },
              { s: 2, id: 'step-rts' },
              { s: 3, id: 'step-5' }
            ]
          : [
              { s: 1, id: 'step-1' },
              { s: 2, id: 'step-rts' }
            ]
        )
      : selectedOptionTab === 'bespoke'
      ? (customFlow === 'size'
          ? (cart.length > 0
              ? [
                  { s: 1, id: 'step-1' },
                  { s: 2, id: 'step-3' }, // Size-First: step 2 is Sizes (step-3 element)
                  { s: 3, id: 'step-2' }, // Size-First: step 3 is Fabrics (step-2 element)
                  { s: 4, id: 'step-5' }
                ]
              : [
                  { s: 1, id: 'step-1' },
                  { s: 2, id: 'step-3' },
                  { s: 3, id: 'step-2' }
                ]
            )
          : (cart.length > 0
              ? [
                  { s: 1, id: 'step-1' },
                  { s: 2, id: 'step-2' }, // Fabric-First: step 2 is Fabrics
                  { s: 3, id: 'step-3' }, // Fabric-First: step 3 is Sizing
                  { s: 4, id: 'step-5' }  // step 4 is Checkout
                ]
              : [
                  { s: 1, id: 'step-1' },
                  { s: 2, id: 'step-2' },
                  { s: 3, id: 'step-3' }
                ]
            )
        )
      : (cart.length > 0
          ? [
              { s: 1, id: 'step-1' },
              { s: 2, id: 'step-5' }
            ]
          : [
              { s: 1, id: 'step-1' }
            ]
        );
  };

  // Scroll to active sub-step heading when fabricStep or needStep changes
  useEffect(() => {
    if (selectedOptionTab !== 'bespoke') return;
    
    let targetId = '';
    if (customFlow === 'fabric') {
      if (fabricStep === 1) targetId = 'fabric-step-1-header';
      else if (fabricStep === 2) targetId = 'fabric-step-2-header';
      else if (fabricStep === 3) targetId = 'fabric-step-3-header';
    } else if (customFlow === 'size') {
      if (needStep === 1) targetId = 'need-step-1-header';
      else if (needStep === 2) targetId = 'need-step-2-header';
      else if (needStep === 3) targetId = 'need-step-3-header';
    }
    
    if (targetId) {
      const headingEl = document.getElementById(targetId);
      if (headingEl) {
        headingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: wait a tick for React render cycle
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [fabricStep, needStep, selectedOptionTab, customFlow]);

  // Reset configurator state when exiting customizer entirely
  useEffect(() => {
    if (isCheckoutPage || selectedOptionTab !== 'bespoke') {
      resetConfiguratorState();
    }
  }, [isCheckoutPage, selectedOptionTab]);

  const scrollToStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    isScrollingRef.current = true;
    
    const stepList = getStepList();

    const matchingStep = stepList.find(x => x.s === stepNumber);
    const targetId = matchingStep ? matchingStep.id : `step-${stepNumber}`;

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 850);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (container.scrollTop > 350) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }

      if (isScrollingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const stepList = getStepList();

          let currentStep = 1;
          let minDistance = Infinity;

          const containerRect = container.getBoundingClientRect();
          const threshold = containerRect.top + 160;

          stepList.forEach((stepObj) => {
            const el = document.getElementById(stepObj.id);
            if (el) {
              const elRect = el.getBoundingClientRect();
              const distance = Math.abs(elRect.top - threshold);
              if (distance < minDistance) {
                minDistance = distance;
                currentStep = stepObj.s;
              }
            }
          });

          if (container.scrollHeight - container.scrollTop - container.clientHeight < 120) {
            currentStep = selectedOptionTab === 'ready'
              ? (cart.length > 0 ? 3 : 2)
              : selectedOptionTab === 'bespoke'
              ? (cart.length > 0 ? 4 : 3)
              : (cart.length > 0 ? 2 : 1);
          }

          setActiveStep(prev => prev !== currentStep ? currentStep : prev);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedOptionTab, cart.length, customFlow]);

  // Selected custom options for active customizer / visualizer (syncs dynamically)
  const [designerPrint, setDesignerPrint] = useState<FabricOption>(NONE_FABRIC); // Default starts as NONE_FABRIC (No Pattern Selected)
  const [designerBacking, setDesignerBacking] = useState<FabricOption>(FABRICS_BACKING[0]); // Default Cotton Canvas
  const [designerSize, setDesignerSize] = useState<SizeOption | null>(null); // Default null, no initial size selected
  const [designerAbsorbency, setDesignerAbsorbency] = useState<AbsorbencyOption>(ABSORBENCY_OPTIONS[1]); // Default Moderate
  const [designerShape, setDesignerShape] = useState<string>('sunglow'); // Default shape option

  useEffect(() => {
    if (fabricsTop.length > 0 && designerPrint.id !== 'none' && !fabricsTop.some(f => f.id === designerPrint.id)) {
      setDesignerPrint(fabricsTop[0] || FABRICS_TOP[0]);
    }
  }, [fabricsTop, designerPrint]);

  useEffect(() => {
    if (fabricsBacking.length > 0 && !fabricsBacking.some(f => f.id === designerBacking.id)) {
      setDesignerBacking(fabricsBacking[0] || FABRICS_BACKING[0]);
    }
  }, [fabricsBacking, designerBacking]);

  useEffect(() => {
    if (designerSize && sizeOptions.length > 0 && !sizeOptions.some(s => s.id === designerSize.id)) {
      setDesignerSize(sizeOptions[0]);
    }
  }, [sizeOptions, designerSize]);

  useEffect(() => {
    if (absorbencyOptions.length > 0 && !absorbencyOptions.some(a => a.id === designerAbsorbency.id)) {
      setDesignerAbsorbency(absorbencyOptions[0]);
    }
  }, [absorbencyOptions, designerAbsorbency]);

  // Keep selectedPrints synchronized with actual loaded fabricsTop patterns
  useEffect(() => {
    if (fabricsTop.length > 0) {
      const firstFabName = fabricsTop[0]?.name || 'No Pattern Selected';
      setSelectedPrints(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(sizeId => {
          const val = next[sizeId];
          if (!fabricsTop.some(f => f.name === val) && val !== 'No Pattern Selected') {
            next[sizeId] = firstFabName;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [fabricsTop]);

  // Real-time customizer sizes configurations state (for Step 4 Specs)
  const [selectedLengths, setSelectedLengths] = useState<Record<string, number>>({});
  const [selectedPrints, setSelectedPrints] = useState<Record<string, string>>({
    liner: 'No Pattern Selected',
    light: 'No Pattern Selected',
    moderate: 'No Pattern Selected',
    heavy: 'No Pattern Selected',
    extra_long: 'No Pattern Selected'
  });
  const [selectedAbsorbencies, setSelectedAbsorbencies] = useState<Record<string, string>>({
    liner: 'Standard core',
    light: 'Standard core',
    moderate: 'Standard core',
    heavy: 'Standard core',
    extra_long: 'Standard core'
  });
  const [selectedBackings, setSelectedBackings] = useState<Record<string, string>>({
    liner: 'Printed Cotton',
    light: 'White softshell fleece',
    moderate: 'Black softshell fleece',
    heavy: 'Black softshell fleece',
    extra_long: 'Black softshell fleece'
  });
  const [selectedShapes, setSelectedShapes] = useState<Record<string, string>>({});
  
  // Quantities for each of the 5 sizes
  const [quantities, setQuantities] = useState<Record<string, number>>({
    liner: 0,
    light: 0,
    moderate: 0,
    heavy: 0,
    extra_long: 0
  });

  // Active accordion size card in Step 4
  const [expandedSizeCard, setExpandedSizeCard] = useState<string | null>('light');
  const [activeBespokeSizeId, setActiveBespokeSizeId] = useState<string>('light');
  const [expandedBespokeCardId, setExpandedBespokeCardId] = useState<string | null>(null);

  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  

  // Step 5 Interactive Visualizer parameters (Morphing shapes)
  const [visualizerSide, setVisualizerSide] = useState<'skin' | 'backing'>('skin');
  const [cardSides, setCardSides] = useState<Record<string, 'topper' | 'backing'>>({});
  const [visualizerWidthSlider, setVisualizerWidthSlider] = useState<number>(70); // px width (60-90)
  const [visualizerLengthSlider, setVisualizerLengthSlider] = useState<number>(220); // px length (180-260)
  const [embroideryText, setEmbroideryText] = useState<string>('');
  const [stitchingPattern, setStitchingPattern] = useState<'wave' | 'quilt' | 'contour'>('quilt');

  // Checkout inputs
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquiryPhone, setInquiryPhone] = useState<string>('');
  const [inquiryAddress, setInquiryAddress] = useState<string>('');
  const [inquiryComments, setInquiryComments] = useState<string>('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState<boolean>(false);
  const [inquiryResult, setInquiryResult] = useState<any | null>(null);
  const shouldShowCheckout = isCheckoutPage || !!inquiryResult;

  // Reset scroll to top when toggling between checkout page, customize screens, or returning to design studio
  useEffect(() => {
    // While inside an active bespoke step flow, the step-header scroll effect above
    // already positions the page correctly for the current step. Forcing a scroll-to-top
    // here at the same time causes the page to visibly snap/jump as the two fight each other.
    // Only force-scroll-to-top for transitions this effect actually owns: entering/leaving
    // checkout, or leaving the bespoke flow entirely.
    if (selectedOptionTab === 'bespoke' && customFlow) {
      return;
    }

    const forceScrollToTop = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      if (document.body) document.body.scrollTop = 0;
      if (document.documentElement) document.documentElement.scrollTop = 0;
    };

    // 1. Scroll immediately on state change
    forceScrollToTop();

    // 2. Scroll on next animation frame after React commits DOM updates
    const rafId = requestAnimationFrame(() => {
      forceScrollToTop();
    });

    // 3. Fallback scroll after 50ms to defeat late layout shifts or image loads
    const timerId = setTimeout(() => {
      forceScrollToTop();
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [shouldShowCheckout, isCheckoutPage, selectedOptionTab, customFlow]);

  // Auto-collapse WhatsApp floating label on mobile after 5 seconds of inactivity
  useEffect(() => {
    if (isWhatsAppExpanded) {
      const timer = setTimeout(() => {
        setIsWhatsAppExpanded(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isWhatsAppExpanded]);

  // Care FAQ accordion states
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedInlineFAQ, setExpandedInlineFAQ] = useState<number | null>(null);
  const [isWashGuideExpanded, setIsWashGuideExpanded] = useState<boolean>(false);
  const [isSilhouetteExpanded, setIsSilhouetteExpanded] = useState<boolean>(false);
  const [isLayersExpanded, setIsLayersExpanded] = useState<boolean>(false);
  const [isTipsExpanded, setIsTipsExpanded] = useState<boolean>(false);
  const [showBackingInfo, setShowBackingInfo] = useState<boolean>(false);
  const [showCareModal, setShowCareModal] = useState<boolean>(false);
  const [isEcoTipExpanded, setIsEcoTipExpanded] = useState<boolean>(false);
  const [showChangeFabricBubble, setShowChangeFabricBubble] = useState<boolean>(false);
  const [isConfirmingClearCart, setIsConfirmingClearCart] = useState<boolean>(false);
  const [isConfirmingFloatingClear, setIsConfirmingFloatingClear] = useState<boolean>(false);
  const [isConfirmingResetData, setIsConfirmingResetData] = useState<boolean>(false);

  // SVG dynamic contour generator based on shape ID and dimensions
  const getVisualizerPathD = (shapeId: string, w: number, l: number) => {
    const hw = w / 2;
    const hl = l / 2;

    switch (shapeId) {
      case 'moon_rise':
        // Elegant organic curves with slightly wider bottom
        return `
          M ${100 - hw}, ${140 - hl + 22}
          C ${100 - hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl + 22}
          C ${100 + hw}, ${140 - hl * 0.3}
            ${100 + hw * 0.72}, ${140 - 32}
            ${100 + hw * 0.72}, ${140 - 22}
          C ${100 + hw * 0.72}, ${140 - 18}
            ${100 + hw + 24}, ${140 - 12}
            ${100 + hw + 24}, ${140}
          C ${100 + hw + 24}, ${140 + 12}
            ${100 + hw * 0.72}, ${140 + 18}
            ${100 + hw * 0.72}, ${140 + 22}
          C ${100 + hw * 0.72}, ${140 + hl * 0.3}
            ${100 + hw * 1.15}, ${140 + hl - 22}
            ${100 + hw * 1.15}, ${140 + hl - 20}
          C ${100 + hw * 1.15}, ${140 + hl}
            ${100 - hw * 1.15}, ${140 + hl}
            ${100 - hw * 1.15}, ${140 + hl - 20}
          C ${100 - hw * 1.15}, ${140 + hl * 0.3}
            ${100 - hw * 0.72}, ${140 + 22}
            ${100 - hw * 0.72}, ${140 + 22}
          C ${100 - hw * 0.72}, ${140 + 18}
            ${100 - hw - 24}, ${140 + 12}
            ${100 - hw - 24}, ${140}
          C ${100 - hw - 24}, ${140 - 12}
            ${100 - hw * 0.72}, ${140 - 18}
            ${100 - hw * 0.72}, ${140 - 22}
          C ${100 - hw * 0.72}, ${140 - hl * 0.3}
            ${100 - hw}, ${140 - hl + 22}
            ${100 - hw}, ${140 - hl + 22}
          Z
        `;
      case 'staple':
        // Precise proportional mapping of the handsewn "Staple" pattern
        // Body width: 2 * hw (around 70px), Wing width: 22px extension
        return `
          M 100, ${140 - hl}
          C ${100 + hw * 0.53}, ${140 - hl}
            ${100 + hw * 0.93}, ${140 - hl + hl * 0.15}
            ${100 + hw}, ${140 - hl + hl * 0.3}
          L ${100 + hw}, ${140 - 50}
          L ${100 + hw + 22}, ${140 - 30}
          L ${100 + hw + 22}, ${140 + 10}
          L ${100 + hw}, ${140 + 30}
          L ${100 + hw}, ${140 + hl - hl * 0.3}
          C ${100 + hw * 0.93}, ${140 + hl - hl * 0.15}
            ${100 + hw * 0.53}, ${140 + hl}
            100, ${140 + hl}
          C ${100 - hw * 0.53}, ${140 + hl}
            ${100 - hw * 0.93}, ${140 + hl - hl * 0.15}
            ${100 - hw}, ${140 + hl - hl * 0.3}
          L ${100 - hw}, ${140 + 30}
          L ${100 - hw - 22}, ${140 + 10}
          L ${100 - hw - 22}, ${140 - 30}
          L ${100 - hw}, ${140 - 50}
          L ${100 - hw}, ${140 - hl + hl * 0.3}
          C ${100 - hw * 0.93}, ${140 - hl + hl * 0.15}
            ${100 - hw * 0.53}, ${140 - hl}
            100, ${140 - hl}
          Z
        `;
      case 'mega_pad':
        // Flare back much wider for extreme night flow
        return `
          M ${100 - hw}, ${140 - hl + 20}
          C ${100 - hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl + 20}
          C ${100 + hw}, ${140 - hl * 0.3}
            ${100 + hw * 0.75}, ${140 - 30}
            ${100 + hw * 0.75}, ${140 - 25}
          C ${100 + hw * 0.75}, ${140 - 20}
            ${100 + hw + 28}, ${140 - 15}
            ${100 + hw + 28}, ${140}
          C ${100 + hw + 28}, ${140 + 15}
            ${100 + hw * 0.75}, ${140 + 20}
            ${100 + hw * 0.75}, ${140 + 25}
          C ${100 + hw * 0.75}, ${140 + hl * 0.3}
            ${100 + hw * 1.45}, ${140 + hl - 24}
            ${100 + hw * 1.45}, ${140 + hl - 20}
          C ${100 + hw * 1.45}, ${140 + hl}
            ${100 - hw * 1.45}, ${140 + hl}
            ${100 - hw * 1.45}, ${140 + hl - 20}
          C ${100 - hw * 1.45}, ${140 + hl * 0.3}
            ${100 - hw * 0.75}, ${140 + 25}
            ${100 - hw * 0.75}, ${140 + 25}
          C ${100 - hw * 0.75}, ${140 + 20}
            ${100 - hw - 28}, ${140 + 15}
            ${100 - hw - 28}, ${140}
          C ${100 - hw - 28}, ${140 - 15}
            ${100 - hw * 0.75}, ${140 - 20}
            ${100 - hw * 0.75}, ${140 - 25}
          C ${100 - hw * 0.75}, ${140 - hl * 0.3}
            ${100 - hw}, ${140 - hl + 20}
            ${100 - hw}, ${140 - hl + 20}
          Z
        `;
      case 'sunglow':
      default:
        // Contoured shape with graceful flared curves exactly matching premium handsewn models
        return `
          M ${100 - hw}, ${140 - hl + 20}
          C ${100 - hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl}
            ${100 + hw}, ${140 - hl + 20}
          C ${100 + hw}, ${140 - hl * 0.3}
            ${100 + hw * 0.74}, ${140 - 32}
            ${100 + hw * 0.74}, ${140 - 22}
          C ${100 + hw * 0.74}, ${140 - 18}
            ${100 + hw + 25}, ${140 - 12}
            ${100 + hw + 25}, ${140}
          C ${100 + hw + 25}, ${140 + 12}
            ${100 + hw * 0.74}, ${140 + 18}
            ${100 + hw * 0.74}, ${140 + 22}
          C ${100 + hw * 0.74}, ${140 + hl * 0.3}
            ${100 + hw}, ${140 + hl - 20}
            ${100 + hw}, ${140 + hl - 20}
          C ${100 + hw}, ${140 + hl}
            ${100 - hw}, ${140 + hl}
            ${100 - hw}, ${140 + hl - 20}
          C ${100 - hw}, ${140 + hl * 0.3}
            ${100 - hw * 0.74}, ${140 + 22}
            ${100 - hw * 0.74}, ${140 + 22}
          C ${100 - hw * 0.74}, ${140 + 18}
            ${100 - hw - 25}, ${140 + 12}
            ${100 - hw - 25}, ${140}
          C ${100 - hw - 25}, ${140 - 12}
            ${100 - hw * 0.74}, ${140 - 18}
            ${100 - hw * 0.74}, ${140 - 22}
          C ${100 - hw * 0.74}, ${140 - hl * 0.3}
            ${100 - hw}, ${140 - hl + 20}
            ${100 - hw}, ${140 - hl + 20}
          Z
        `;
    }
  };

  // SVG dynamic internal absorbent core contour generator based on shape ID and dimensions
  const getVisualizerCorePathD = (shapeId: string, w: number, l: number) => {
    // The stitched core is a central absorbent body that is narrower than the overall pad (typically 24px - 32px wide in the center)
    const cw = Math.min(w * 0.44, 28);
    const hl = l / 2;
    const hcw = cw / 2;

    switch (shapeId) {
      case 'moon_rise': // Moon Rise (contoured peanut shape)
        return `
          M ${100 - hcw * 1.05}, ${140 - hl + 22}
          C ${100 - hcw * 1.05}, ${140 - hl + 10}
            ${100 + hcw * 1.05}, ${140 - hl + 10}
            ${100 + hcw * 1.05}, ${140 - hl + 22}
          C ${100 + hcw * 1.05}, ${140 - hl * 0.25}
            ${100 + hcw * 0.72}, ${140 - 15}
            ${100 + hcw * 0.72}, ${140}
          C ${100 + hcw * 0.72}, ${140 + 15}
            ${100 + hcw * 1.12}, ${140 + hl * 0.25}
            ${100 + hcw * 1.12}, ${140 + hl - 22}
          C ${100 + hcw * 1.12}, ${140 + hl - 10}
            ${100 - hcw * 1.12}, ${140 + hl - 10}
            ${100 - hcw * 1.12}, ${140 + hl - 22}
          C ${100 - hcw * 1.12}, ${140 + hl * 0.25}
            ${100 - hcw * 0.72}, ${140 + 15}
            ${100 - hcw * 0.72}, ${140}
          C ${100 - hcw * 0.72}, ${140 - 15}
            ${100 - hcw * 1.05}, ${140 - hl * 0.25}
            ${100 - hcw * 1.05}, ${140 - hl + 22}
          Z
        `;
      case 'staple': // Staple (rounded rectangle)
        return `
          M ${100 - hcw}, ${140 - hl + 20}
          C ${100 - hcw}, ${140 - hl + 10}
            ${100 + hcw}, ${140 - hl + 10}
            ${100 + hcw}, ${140 - hl + 20}
          L ${100 + hcw}, ${140 + hl - 20}
          C ${100 + hcw}, ${140 + hl - 10}
            ${100 - hcw}, ${140 + hl - 10}
            ${100 - hcw}, ${140 + hl - 20}
          Z
        `;
      case 'mega_pad': // Mega Pad (wider tail core)
        return `
          M ${100 - hcw * 0.9}, ${140 - hl + 22}
          C ${100 - hcw * 0.9}, ${140 - hl + 10}
            ${100 + hcw * 0.9}, ${140 - hl + 10}
            ${100 + hcw * 0.9}, ${140 - hl + 22}
          C ${100 + hcw * 0.9}, ${140 - hl * 0.25}
            ${100 + hcw * 0.7}, ${140 - 15}
            ${100 + hcw * 0.7}, ${140}
          C ${100 + hcw * 0.7}, ${140 + 15}
            ${100 + hcw * 1.48}, ${140 + hl * 0.25}
            ${100 + hcw * 1.48}, ${140 + hl - 22}
          C ${100 + hcw * 1.48}, ${140 + hl - 10}
            ${100 - hcw * 1.48}, ${140 + hl - 10}
            ${100 - hcw * 1.48}, ${140 + hl - 22}
          C ${100 - hcw * 1.48}, ${140 + hl * 0.25}
            ${100 - hcw * 0.7}, ${140 + 15}
            ${100 - hcw * 0.7}, ${140}
          C ${100 - hcw * 0.7}, ${140 - 15}
            ${100 - hcw * 0.9}, ${140 - hl * 0.25}
            ${100 - hcw * 0.9}, ${140 - hl + 22}
          Z
        `;
      case 'sunglow':
      default: // Sunglow (double flare)
        return `
          M ${100 - hcw * 1.1}, ${140 - hl + 22}
          C ${100 - hcw * 1.1}, ${140 - hl + 10}
            ${100 + hcw * 1.1}, ${140 - hl + 10}
            ${100 + hcw * 1.1}, ${140 - hl + 22}
          C ${100 + hcw * 1.1}, ${140 - hl * 0.25}
            ${100 + hcw * 0.75}, ${140 - 15}
            ${100 + hcw * 0.75}, ${140}
          C ${100 + hcw * 0.75}, ${140 + 15}
            ${100 + hcw * 1.1}, ${140 + hl * 0.25}
            ${100 + hcw * 1.1}, ${140 + hl - 22}
          C ${100 + hcw * 1.1}, ${140 + hl - 10}
            ${100 - hcw * 1.1}, ${140 + hl - 10}
            ${100 - hcw * 1.1}, ${140 + hl - 22}
          C ${100 - hcw * 1.1}, ${140 + hl * 0.25}
            ${100 - hcw * 0.75}, ${140 + 15}
            ${100 - hcw * 0.75}, ${140}
          C ${100 - hcw * 0.75}, ${140 - 15}
            ${100 - hcw * 1.1}, ${140 - hl * 0.25}
            ${100 - hcw * 1.1}, ${140 - hl + 22}
          Z
        `;
    }
  };

  // Load basket items from Local Storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('wonder_pads_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((item: any) => {
            const nextItem = { ...item };
            if (typeof nextItem.shapeName === 'string') {
              nextItem.shapeName = nextItem.shapeName.replace(/Sorella/g, 'Wonder');
            }
            if (typeof nextItem.sizeName === 'string') {
              nextItem.sizeName = nextItem.sizeName.replace(/Sorella/g, 'Wonder');
            }
            if (typeof nextItem.printName === 'string') {
              nextItem.printName = nextItem.printName.replace(/Sorella/g, 'Wonder');
            }
            return nextItem;
          });
          setCart(migrated);
        }
      } catch (e) {
        console.error("Cart loading failed: ", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('wonder_pads_cart', JSON.stringify(newCart));
  };

  // Dynamic pricing and custom selections options constants
  const LINER_BACKING_OPTIONS = [
    { id: 'organic-cotton', name: 'Organic Cotton', premium: 0.00, description: 'Natural unbleached organic cotton backing.' },
    { id: 'printed-cotton', name: 'Printed Cotton', premium: 0.00, description: 'Fun color-printed pattern cotton backing.' },
    { id: 'antipill-fleece', name: 'Antipill Fleece (+S$1.00)', premium: 1.00, description: 'Anti-pill cozy fleece grip layer.' }
  ];

  const LINER_ABSORBENCY_OPTIONS = [
    { id: 'standard', name: 'Standard core', premium: 0.00, description: 'Standard sleek, single absorbency cotton layer.' },
    { id: 'add-1-layer', name: '+1 layer (+S$0.50)', premium: 0.50, description: 'Add 1 additional organic absorption layer.' },
    { id: 'add-2-layers', name: '+2 layers (+S$1.00)', premium: 1.00, description: 'Add 2 additional organic absorption layers.' }
  ];

  const getBasePriceForSize = (sizeId: string, lengthInches: number, basePrice: number): number => {
    if (sizeId === 'extra_long') {
      return 15.00 + (lengthInches - 15);
    }
    return basePrice;
  };

  const getBespokeBackingInfo = (sizeId: string, selectionName: string) => {
    if (sizeId === 'liner') {
      const found = LINER_BACKING_OPTIONS.find(b => b.name === selectionName) || LINER_BACKING_OPTIONS[1];
      return { id: found.id, name: found.name, premium: found.premium };
    } else if (sizeId === 'light') {
      return { id: 'white-softshell', name: 'White softshell fleece', premium: 0.00 };
    } else {
      return { id: 'black-softshell', name: 'Black softshell fleece', premium: 0.00 };
    }
  };

  const getBespokeAbsorbencyInfo = (sizeId: string, selectionName: string) => {
    if (sizeId === 'liner') {
      const found = LINER_ABSORBENCY_OPTIONS.find(a => a.name === selectionName) || LINER_ABSORBENCY_OPTIONS[0];
      return { name: found.name, premium: found.premium };
    } else {
      // Absorbent core thickness option removed for light, moderate, heavy and extralong sizes
      return { name: 'Standard core', premium: 0.00 };
    }
  };

  // Helper to dynamically set customizer/visualizer state based on a size option card's selections
  const handleActivateSizeCard = (sz: SizeOption) => {
    const localLength = selectedLengths[sz.id] || sz.lengthInches;
    let localShapeId = selectedShapes[sz.id] || ((sz.id === 'liner' || sz.id === 'light') ? 'moon_rise' : (sz.id === 'moderate' || sz.id === 'heavy') ? 'sunglow' : 'mega_pad');
    if (!isShapeAllowed(localShapeId, localLength)) {
      localShapeId = getFallbackShapeForLength(localLength);
    }
    const localPrint = selectedPrints[sz.id] || 'No Pattern Selected';
    const localAbsorbencyName = selectedAbsorbencies[sz.id] || (sz.id === 'liner' ? 'None' : 'Standard core');
    const localBackingName = selectedBackings[sz.id] || (sz.id === 'liner' ? 'Printed Cotton' : sz.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');

    setDesignerSize({ ...sz, lengthInches: localLength });
    setDesignerShape(localShapeId);
    
    const matchedAbs = ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName);
    if (matchedAbs) setDesignerAbsorbency(matchedAbs);

    const matchedBacking = fabricsBacking.find(b => b.name === localBackingName);
    if (matchedBacking) setDesignerBacking(matchedBacking);

    const matchedPrint = fabricsTop.find(f => f.name === localPrint);
    setDesignerPrint(matchedPrint || NONE_FABRIC);
  };

  // Pricing and Add-to-Basket helpers for Workflow B (Start with Need)
  const getWorkflowBPrice = (): number => {
    const matchedSize = sizeOptions.find(s => s.id === selectedNeedAbsorbency) || sizeOptions[0];
    const basePrice = getBasePriceForSize(selectedNeedAbsorbency, selectedNeedLength, matchedSize.priceBase);
    
    let backingPremium = 0;
    if (selectedNeedAbsorbency === 'liner') {
      const foundBacking = LINER_BACKING_OPTIONS.find(b => b.name === selectedNeedBacking);
      if (foundBacking) backingPremium = foundBacking.premium;
    }
    
    let absPremium = 0;
    if (selectedNeedAbsorbency === 'liner') {
      const foundAbs = LINER_ABSORBENCY_OPTIONS.find(a => a.name === selectedNeedAbsorbencyLiner);
      if (foundAbs) absPremium = foundAbs.premium;
    }
    
    return basePrice + backingPremium + absPremium;
  };

  const handleAddWorkflowBToBasket = () => {
    const matchedSize = sizeOptions.find(s => s.id === selectedNeedAbsorbency) || sizeOptions[0];
    const pricePerUnit = getWorkflowBPrice();
    const matchedShape = SHAPE_OPTIONS.find(s => s.id === selectedNeedShape) || SHAPE_OPTIONS[0];
    
    const printName = selectedNeedFabric.name && selectedNeedFabric.name !== 'No Pattern Selected' 
      ? selectedNeedFabric.name 
      : 'No Pattern Selected';
      
    if (printName === 'No Pattern Selected') {
      showToast(`Please select a fabric pattern from our catalog first!`, 'info');
      return;
    }

    const newItem: CartItem = {
      id: `bespoke-${selectedNeedAbsorbency}-${Date.now()}`,
      sizeName: matchedSize.name,
      pricePerUnit: Number(pricePerUnit.toFixed(2)),
      lengthInches: selectedNeedLength,
      printName: printName,
      absorbencyName: selectedNeedAbsorbency === 'liner' ? selectedNeedAbsorbencyLiner : 'Standard core',
      backingName: selectedNeedAbsorbency === 'liner' ? selectedNeedBacking : (selectedNeedAbsorbency === 'light' ? 'White softshell fleece' : 'Black softshell fleece'),
      shapeName: matchedShape.name,
      quantity: selectedNeedQty,
      totalPrice: Number((pricePerUnit * selectedNeedQty).toFixed(2)),
      imageUrl: selectedNeedFabric.imageUrl
    };

    const newCart = [...cart, newItem];
    saveCart(newCart);

    showToast(`Successfully added ${selectedNeedQty}x custom ${matchedSize.name} configuration to your basket!`, 'success');
    resetConfiguratorState();
  };

  // Add customized pad specs row to basket
  const handleAddSizeOptionToBasket = (sizeId: string, qtyOverride?: number) => {
    const qty = qtyOverride !== undefined ? qtyOverride : quantities[sizeId];
    if (qty <= 0) return;

    const matchedSize = sizeOptions.find(s => s.id === sizeId)!;
    const currentPrintName = selectedPrints[sizeId];
    const printVal = currentPrintName && currentPrintName !== 'No Pattern Selected'
      ? currentPrintName
      : (designerPrint && designerPrint.name !== 'No Pattern Selected' ? designerPrint.name : 'No Pattern Selected');

    if (printVal === 'No Pattern Selected') {
      showToast(`Nilam says to add fabric for ${matchedSize.name}!`, 'info');
      return;
    }

    const absVal = selectedAbsorbencies[sizeId];
    const backVal = selectedBackings[sizeId];
    const activeLength = selectedLengths[sizeId] || matchedSize.lengthInches;
    let shapeId = selectedShapes[sizeId] || 'moon_rise';
    if (!isShapeAllowed(shapeId, activeLength)) {
      shapeId = getFallbackShapeForLength(activeLength);
    }

    const matchedPrint = fabricsTop.find(p => p.name === printVal) || NONE_FABRIC;
    const matchedShape = SHAPE_OPTIONS.find(s => s.id === shapeId) || SHAPE_OPTIONS[0];
    
    const backingInfo = getBespokeBackingInfo(sizeId, backVal);
    const absInfo = getBespokeAbsorbencyInfo(sizeId, absVal);
    const sizeBasePrice = getBasePriceForSize(sizeId, activeLength, matchedSize.priceBase);

    const pricePerUnit = sizeBasePrice + absInfo.premium + backingInfo.premium;

    const newItem: CartItem = {
      id: `bespoke-${sizeId}-${Date.now()}`,
      sizeName: matchedSize.name,
      pricePerUnit: Number(pricePerUnit.toFixed(2)),
      lengthInches: activeLength,
      printName: printVal,
      absorbencyName: absInfo.name,
      backingName: backingInfo.name,
      shapeName: matchedShape.name,
      quantity: qty,
      totalPrice: Number((pricePerUnit * qty).toFixed(2)),
      imageUrl: matchedPrint.imageUrl
    };

    const newCart = [...cart, newItem];
    saveCart(newCart);

    showToast(`Successfully added ${qty}x custom ${matchedSize.name} configuration to your basket!`, 'success');

    if (customFlow === 'fabric') {
      // Temporarily bypass showKeepFabricPrompt per user request
    }
    
    // Reset configuration back to defaults on successful add
    setQuantities(prev => ({ ...prev, [sizeId]: 0 }));
    // Do not force reset print to 'No Pattern Selected' if a designer pattern is selected! Fallback to designer print so they can reorder immediately
    const fallbackPrint = designerPrint && designerPrint.name !== 'No Pattern Selected' ? designerPrint.name : 'No Pattern Selected';
    setSelectedPrints(prev => ({ ...prev, [sizeId]: fallbackPrint }));
    setSelectedLengths(prev => {
      const next = { ...prev };
      delete next[sizeId];
      return next;
    });
    setSelectedAbsorbencies(prev => ({ ...prev, [sizeId]: 'Standard core' }));
    setSelectedBackings(prev => ({ ...prev, [sizeId]: sizeId === 'liner' ? 'Organic Cotton' : sizeId === 'light' ? 'White softshell fleece' : 'Black softshell fleece' }));
    setSelectedShapes(prev => {
      const next = { ...prev };
      delete next[sizeId];
      return next;
    });

    if (selectedBespokeSizes.length <= 1) {
      resetConfiguratorState();
    }
  };

  // Reusable helper function to render customizer size/silhouette option cards
  const renderSizeOptionsCards = () => {
    return (
      <div className="space-y-4">
        {sizeOptions.map((sz) => {
          const currentQty = quantities[sz.id] || 0;
          const localPrint = selectedPrints[sz.id] || 'No Pattern Selected';
          const localAbsorbencyName = selectedAbsorbencies[sz.id] || 'Standard core';
          const localBackingName = selectedBackings[sz.id] || (sz.id === 'liner' ? 'Printed Cotton' : sz.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');
          const backingInfo = getBespokeBackingInfo(sz.id, localBackingName);
          const absInfo = getBespokeAbsorbencyInfo(sz.id, localAbsorbencyName);
          const lengthChamber = selectedLengths[sz.id] || sz.lengthInches;
          let localShapeId = selectedShapes[sz.id] || ((sz.id === 'liner' || sz.id === 'light') ? 'moon_rise' : (sz.id === 'moderate' || sz.id === 'heavy') ? 'sunglow' : 'mega_pad');
          if (!isShapeAllowed(localShapeId, lengthChamber)) {
            localShapeId = getFallbackShapeForLength(lengthChamber);
          }
          const baseSizePrice = getBasePriceForSize(sz.id, lengthChamber, sz.priceBase);
          const baseUnitPrice = baseSizePrice + absInfo.premium + backingInfo.premium;

          const parsedDesc = sz.description || '';
          let mainDesc = parsedDesc;
          let tipPart = '';
          const bracketIndex = parsedDesc.indexOf('(');
          if (bracketIndex !== -1 && parsedDesc.endsWith(')')) {
            mainDesc = parsedDesc.substring(0, bracketIndex).trim();
            tipPart = parsedDesc.substring(bracketIndex + 1, parsedDesc.length - 1).trim();
          }

          const availableShapes = [
            { id: 'moon_rise', name: 'MoonRise', icon: '🌙' },
            { id: 'sunglow', name: 'SunGlow', icon: '☀️' },
            { id: 'staple', name: 'Staple', icon: '📏' },
            { id: 'mega_pad', name: 'MegaPad', icon: '🩸' }
          ].filter(sh => {
            // Mega pad is only for length >= 15 (Extra Long)
            if (sh.id === 'mega_pad') return sz.id === 'extra_long';
            return true;
          });

          const isActiveCanvas = designerSize && designerSize.id === sz.id;

          return (
            <div
              key={sz.id}
              id={`card-trunk-${sz.id}`}
              onClick={() => handleActivateSizeCard(sz)}
              className={`rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                isActiveCanvas 
                  ? 'bg-[#FCF9FD] border-2 border-[#8A5A87] shadow-sm scale-[1.01]' 
                  : 'bg-white border border-zinc-200/80 hover:border-[#8A5A87]/40 shadow-3xs hover:bg-[#FAF8FC]/30'
              }`}
            >
              {/* Top Row: Name and price */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg sm:text-[22px] font-black text-brand-charcoal font-sans tracking-wide">
                    {sz.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenInfoCardId(openInfoCardId === sz.id ? null : sz.id);
                    }}
                    className={`inline-flex items-center justify-center p-1 rounded-full transition-all duration-200 ml-1.5 cursor-pointer align-middle ${
                      openInfoCardId === sz.id
                        ? 'bg-[#8A5A87] text-white shadow-xs scale-105'
                        : 'bg-[#8A5A87]/10 hover:bg-[#8A5A87]/20 text-[#8A5A87] hover:text-[#734971]'
                    }`}
                    title="View sizing and fabric backing information"
                  >
                    <Info className="h-3.5 w-3.5 shrink-0" />
                  </button>
                  {sz.id !== 'liner' && (
                    <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-black text-[#8A5A87] bg-[#F3EBF4] rounded-md tracking-wider font-mono">
                      {sz.minLength}–{sz.maxLength}"
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-bold text-zinc-500 font-sans">
                    ({localPrint === 'No Pattern Selected' ? 'No Fabric Selected' : `Fabric: ${localPrint}`})
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] text-[#8A5A87] font-black block uppercase tracking-wider leading-none">UNIT PRICE</span>
                  <span className="text-sm sm:text-base font-mono font-black text-[#8A5A87] block mt-1">
                    S${baseUnitPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Collapsible Info Drawer when toggled */}
              {openInfoCardId === sz.id && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 p-3.5 bg-amber-50/60 border border-amber-200/50 rounded-xl text-[11px] sm:text-xs text-zinc-700 space-y-2 animate-fadeIn text-left"
                >
                  <p className="font-sans leading-relaxed text-zinc-600">
                    {mainDesc}
                  </p>
                  {tipPart && (
                    <p className="text-[11px] text-[#8A5A87] font-bold italic leading-snug">
                      💡 {tipPart}
                    </p>
                  )}
                  <p className="text-[10px] text-[#556355] font-black tracking-wide uppercase flex items-center gap-1">
                    <span>✨</span> NOTE: BACKED IN {
                      sz.id === 'liner' ? 'ORGANIC COTTON' : sz.id === 'light' ? 'WHITE SOFT SHELL FLEECE' : 'BLACK SOFT SHELL FLEECE'
                    }.
                  </p>
                  {sz.id === 'extra_long' && (
                    <p className="text-[10px] text-[#8A5A87] font-black tracking-wide uppercase flex items-center gap-1">
                      <span>💰</span> NOTE: PRICES FOR EXTRA LONG PADS ARE INCREMENTING PER INCH.
                    </p>
                  )}
                </div>
              )}

              {sz.id === 'liner' ? (
                /* REDESIGNED LINER INTERIOR */
                <div className="mt-4 space-y-4">
                  {/* Length Row */}
                  <div className="flex items-center gap-4 py-1 border-b border-zinc-100/50 pb-2.5">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#8A5A87] uppercase w-16 shrink-0 text-left">
                      Length
                    </span>
                    <div className="flex items-center gap-5 flex-wrap">
                      {Array.from({ length: sz.maxLength - sz.minLength + 1 }, (_, i) => sz.minLength + i).map((inch) => {
                        const isSelected = lengthChamber === inch;
                        return (
                          <button
                            key={inch}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLengths(prev => ({ ...prev, [sz.id]: inch }));
                              let nextShape = localShapeId;
                              if (!isShapeAllowed(localShapeId, inch)) {
                                nextShape = getFallbackShapeForLength(inch);
                                setSelectedShapes(prev => ({ ...prev, [sz.id]: nextShape }));
                              }
                              setDesignerSize({ ...sz, lengthInches: inch });
                              setDesignerShape(nextShape);
                              setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName) || designerAbsorbency);
                              setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || designerBacking);
                              setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#5A4E5D] hover:text-[#8A5A87] select-none transition-colors cursor-pointer"
                          >
                            <span className={`w-2 h-2 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#8A5A87] bg-white ring-2 ring-[#8A5A87]/15' : 'border-zinc-300 bg-white'
                            }`}>
                              {isSelected && <span className="w-1 h-1 rounded-full bg-[#8A5A87]" />}
                            </span>
                            <span>{inch}"</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shape Row */}
                  <div className="flex items-center gap-4 py-1 border-b border-zinc-100/50 pb-2.5">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#8A5A87] uppercase w-16 shrink-0 text-left">
                      Shape
                    </span>
                    <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50 gap-0.5 overflow-x-auto no-scrollbar">
                      {availableShapes.map((sh) => {
                        const isAllowed = isShapeAllowed(sh.id, lengthChamber);
                        const isSelected = localShapeId === sh.id && isAllowed;
                        return (
                          <button
                            key={sh.id}
                            type="button"
                            disabled={!isAllowed}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAllowed) return;
                              setSelectedShapes(prev => ({ ...prev, [sz.id]: sh.id }));
                              setDesignerShape(sh.id);
                              setDesignerSize({ ...sz, lengthInches: lengthChamber });
                              setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName) || designerAbsorbency);
                              setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || designerBacking);
                              setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                            }}
                            className={`px-3 py-1 text-[11px] font-bold select-none transition-all duration-150 rounded-md shrink-0 ${
                              !isAllowed
                                ? 'text-zinc-300 cursor-not-allowed opacity-40'
                                : isSelected
                                ? 'bg-[#7D8F7D] text-white shadow-3xs cursor-pointer'
                                : 'text-[#5A4E5D] hover:text-[#7D8F7D] cursor-pointer'
                            }`}
                          >
                            <span>{sh.name.split(' - ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Core Selection Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#8A5A87] uppercase w-16 shrink-0 text-left select-none">
                      Core
                    </span>
                    <select
                      value={localAbsorbencyName}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newAbsName = e.target.value;
                        setSelectedAbsorbencies(prev => ({ ...prev, [sz.id]: newAbsName }));
                        setDesignerSize({ ...sz, lengthInches: lengthChamber });
                        setDesignerShape(localShapeId);
                        setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === newAbsName) || designerAbsorbency);
                        setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || designerBacking);
                        setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                      }}
                      className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                    >
                      {LINER_ABSORBENCY_OPTIONS.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Backing Selection Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#8A5A87] uppercase w-16 shrink-0 text-left select-none">
                      Backing
                    </span>
                    <select
                      value={localBackingName}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newBackingName = e.target.value;
                        setSelectedBackings(prev => ({ ...prev, [sz.id]: newBackingName }));
                        setDesignerSize({ ...sz, lengthInches: lengthChamber });
                        setDesignerShape(localShapeId);
                        setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName) || designerAbsorbency);
                        setDesignerBacking(fabricsBacking.find(b => b.name === newBackingName) || designerBacking);
                        setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                      }}
                      className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                    >
                      {LINER_BACKING_OPTIONS.filter(b => b.id !== 'organic-cotton').map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[9.5px] text-zinc-400 italic font-medium leading-none mt-1">
                    * Choose additional core/different backer from above
                  </p>

                  {/* Actions (quantity counter & add to order button) */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-4">
                    {/* Left Side: Counter & Estimate Price */}
                    <div className="flex items-center gap-3">
                      {/* Counter */}
                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 shadow-3xs" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuantities(prev => ({ ...prev, [sz.id]: Math.max(0, currentQty - 1) }));
                          }}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer active:scale-90"
                        >
                          -
                        </button>
                        <span className="px-1.5 w-4 text-center text-xs font-black font-mono text-zinc-900">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuantities(prev => ({ ...prev, [sz.id]: currentQty + 1 }));
                          }}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer active:scale-90"
                        >
                          +
                        </button>
                      </div>

                      {/* Show Estimate price once they add item */}
                      {currentQty > 0 && (
                        <div className="text-left animate-fadeIn">
                          <span className="text-[10px] font-mono font-black text-[#8A5A87] block">
                            S${(baseUnitPrice * currentQty).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add to Order button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentQty <= 0) return;
                        setDesignerSize({ ...sz, lengthInches: lengthChamber });
                        handleAddSizeOptionToBasket(sz.id);
                      }}
                      disabled={currentQty <= 0}
                      className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                        currentQty > 0
                          ? 'bg-[#8A5A87] hover:bg-[#724a70] text-white shadow-md cursor-pointer active:scale-95'
                          : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* OLD LAYOUT FOR ALL OTHER SIZES */
                <>
                  {/* Direct Size Tabs (ALWAYS visible, single row!) */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#8A5A87] uppercase block">
                      SELECT LENGTH
                    </span>
                    <div className="flex w-full gap-1.5 overflow-x-auto no-scrollbar">
                      {Array.from({ length: sz.maxLength - sz.minLength + 1 }, (_, i) => sz.minLength + i).map((inch) => {
                        const isSelected = lengthChamber === inch;
                        return (
                          <button
                            key={inch}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLengths(prev => ({ ...prev, [sz.id]: inch }));
                              let nextShape = localShapeId;
                              if (!isShapeAllowed(localShapeId, inch)) {
                                nextShape = getFallbackShapeForLength(inch);
                                setSelectedShapes(prev => ({ ...prev, [sz.id]: nextShape }));
                              }
                              setDesignerSize({ ...sz, lengthInches: inch });
                              setDesignerShape(nextShape);
                              setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName) || designerAbsorbency);
                              setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || designerBacking);
                              setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                            }}
                            className={`flex-1 h-7.5 min-w-[32px] flex items-center justify-center text-xs font-bold rounded-md border transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'bg-[#8A5A87] border-[#8A5A87] text-white shadow-3xs'
                                : 'bg-white border-zinc-200/80 text-[#5A4E5D] hover:bg-[#F1CFEA]/15 hover:border-[#8A5A87]/30'
                            }`}
                          >
                            {inch}"
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shape selection Tabs (ALWAYS visible, single row!) */}
                  <div className="mt-4 space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#8A5A87] uppercase block">
                      SELECT SHAPE
                    </label>
                    <div className="flex w-full gap-1.5 overflow-x-auto no-scrollbar">
                      {availableShapes.map((sh) => {
                        const isAllowed = isShapeAllowed(sh.id, lengthChamber);
                        const isSelected = localShapeId === sh.id && isAllowed;
                        return (
                          <button
                            key={sh.id}
                            type="button"
                            disabled={!isAllowed}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAllowed) return;
                              setSelectedShapes(prev => ({ ...prev, [sz.id]: sh.id }));
                              setDesignerShape(sh.id);
                              setDesignerSize({ ...sz, lengthInches: lengthChamber });
                              setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === localAbsorbencyName) || designerAbsorbency);
                              setDesignerBacking(fabricsBacking.find(f => f.name === localBackingName) || designerBacking);
                              setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                            }}
                            className={`flex-1 h-7.5 min-w-[70px] flex items-center justify-center rounded-md border text-[10.5px] font-bold transition-all duration-150 ${
                              !isAllowed
                                ? 'bg-zinc-50 border-zinc-150 text-zinc-350 cursor-not-allowed opacity-50'
                                : isSelected
                                ? 'bg-[#7D8F7D] border-[#7D8F7D] text-white shadow-3xs cursor-pointer'
                                : 'bg-white border-zinc-200 text-zinc-650 hover:bg-[#7D8F7D]/10 hover:border-[#7D8F7D]/30 cursor-pointer'
                            }`}
                            title={!isAllowed ? `Not available for ${lengthChamber}" length` : `Select ${sh.name}`}
                          >
                            <span>{sh.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions (quantity counter & add button - ALWAYS visible) */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-3">
                    {/* Left Side: Counter & Estimate Price */}
                    <div className="flex items-center gap-3">
                      {/* Counter */}
                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 shadow-3xs" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuantities(prev => ({ ...prev, [sz.id]: Math.max(0, currentQty - 1) }));
                          }}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer active:scale-90"
                        >
                          -
                        </button>
                        <span className="px-1.5 w-4 text-center text-xs font-black font-mono text-zinc-900">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuantities(prev => ({ ...prev, [sz.id]: currentQty + 1 }));
                          }}
                          className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer active:scale-90"
                        >
                          +
                        </button>
                      </div>

                      {/* Show Estimate price once they add item */}
                      {currentQty > 0 && (
                        <div className="text-left animate-fadeIn">
                          <span className="text-[10px] font-mono font-black text-[#8A5A87] block">
                            S${(baseUnitPrice * currentQty).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add to Basket button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentQty <= 0) return;
                        setDesignerSize({ ...sz, lengthInches: lengthChamber });
                        handleAddSizeOptionToBasket(sz.id);
                      }}
                      disabled={currentQty <= 0}
                      className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                        currentQty > 0
                          ? 'bg-[#8A5A87] hover:bg-[#724a70] text-white shadow-md cursor-pointer active:scale-95'
                          : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Add to Basket</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Add instant design from live visualizer canvas to basket
  const handleAddDirectCustomPadToBasket = () => {
    if (!designerSize) return;
    if (designerPrint.id === 'none' || designerPrint.name === 'No Pattern Selected') {
      showToast("Nilam says to add fabric!", 'info');
      return;
    }

    const activeLength = designerSize.lengthInches;
    const sizeBasePrice = getBasePriceForSize(designerSize.id, activeLength, designerSize.priceBase);
    const backingInfo = getBespokeBackingInfo(designerSize.id, designerBacking.name);
    const absInfo = getBespokeAbsorbencyInfo(designerSize.id, designerAbsorbency.name);
    const matchedShape = SHAPE_OPTIONS.find(s => s.id === designerShape) || SHAPE_OPTIONS[0];

    const basePrice = sizeBasePrice + absInfo.premium + backingInfo.premium;
    const newItem: CartItem = {
      id: `designer-${Date.now()}`,
      sizeName: designerSize.name,
      pricePerUnit: Number(basePrice.toFixed(2)),
      lengthInches: activeLength,
      printName: designerPrint.name,
      absorbencyName: absInfo.name,
      backingName: backingInfo.name,
      shapeName: matchedShape.name,
      quantity: 1,
      totalPrice: Number(basePrice.toFixed(2)),
      imageUrl: designerPrint.imageUrl
    };

    const newCart = [...cart, newItem];
    saveCart(newCart);
    showToast(`Success! Handsewn ${designerSize.name} custom design pad added to your basket!`, 'success');

    // Reset visualizer (active canvas) selections
    setDesignerPrint(NONE_FABRIC);
    setDesignerBacking(FABRICS_BACKING[0]);
    setDesignerSize(null);
    setDesignerAbsorbency(ABSORBENCY_OPTIONS[1]);
    setDesignerShape('sunglow');
    setEmbroideryText('');
    setVisualizerLengthSlider(220);
    setVisualizerWidthSlider(70);
  };

  // Manual reset helper for size cards
  const handleResetSizeOption = (sizeId: string) => {
    setQuantities(prev => ({ ...prev, [sizeId]: 0 }));
    const fallbackPrint = designerPrint && designerPrint.name !== 'No Pattern Selected' ? designerPrint.name : 'No Pattern Selected';
    setSelectedPrints(prev => ({ ...prev, [sizeId]: fallbackPrint }));
    setSelectedLengths(prev => {
      const next = { ...prev };
      delete next[sizeId];
      return next;
    });
    setSelectedAbsorbencies(prev => ({ ...prev, [sizeId]: 'Standard core' }));
    setSelectedBackings(prev => ({ ...prev, [sizeId]: sizeId === 'liner' ? 'Organic Cotton' : sizeId === 'light' ? 'White softshell fleece' : 'Black softshell fleece' }));
    setSelectedShapes(prev => {
      const next = { ...prev };
      delete next[sizeId];
      return next;
    });
  };

  // Manual reset helper for active visualizer canvas
  const handleResetActiveVisualizer = () => {
    setDesignerPrint(NONE_FABRIC);
    setDesignerBacking(FABRICS_BACKING[0]);
    setDesignerSize(SIZE_OPTIONS[1]);
    setDesignerAbsorbency(ABSORBENCY_OPTIONS[1]);
    setDesignerShape('sunglow');
    setEmbroideryText('');
    setVisualizerLengthSlider(220);
    setVisualizerWidthSlider(70);
    showToast("Visualizer canvas has been reset to default.", 'info');
  };

  // Add pre-crafted ready series to basket
  const handleAddReadyMadeItem = (item: any) => {
    const newItem: CartItem = {
      id: `ready-${item.id}-${Date.now()}`,
      sizeName: item.size,
      pricePerUnit: item.price,
      lengthInches: parseInt(item.size) || 8,
      printName: item.print,
      absorbencyName: item.absorbency,
      backingName: 'Eco Slip-Resistant organic Backing',
      shapeName: 'Classic Standard',
      quantity: 1,
      totalPrice: item.price,
      isReadyMade: true,
      imageUrl: item.imageUrl
    };
    const newCart = [...cart, newItem];
    saveCart(newCart);
    showToast("item added to basket", 'success');
  };

  const handleRemoveBasketItem = (itemId: string) => {
    const newCart = cart.filter(item => item.id !== itemId);
    saveCart(newCart);
  };

  const handleModifyBasketQuantity = (itemId: string, change: number) => {
    const newCart = cart.map(item => {
      if (item.id === itemId) {
        const nextQty = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: nextQty,
          totalPrice: Number((item.pricePerUnit * nextQty).toFixed(2))
        };
      }
      return item;
    });
    saveCart(newCart);
  };

  const handleClearBasket = () => {
    saveCart([]);
    setIsConfirmingClearCart(false);
  };

  const formatOrderMessage = () => {
    const lineSpacing = "\n";
    let msg = `🌸 *NEW WONDER PADS ORDER*${lineSpacing}${lineSpacing}`;
    msg += `*Customer:*${lineSpacing}`;
    msg += `- Name: ${inquiryName || 'Not Provided'}${lineSpacing}`;
    
    let rawPhone = inquiryPhone.trim() || 'Not Provided';
    if (/^[8936]\d{7}$/.test(rawPhone)) {
      rawPhone = `+65 ${rawPhone}`;
    }
    msg += `- Phone: ${rawPhone}${lineSpacing}`;
    msg += `- Email: ${inquiryEmail || 'Not Provided'}${lineSpacing}`;
    if (inquiryComments.trim()) {
      msg += `- Notes: ${inquiryComments}${lineSpacing}`;
    }
    
    msg += `${lineSpacing}*Order:*${lineSpacing}`;
    cart.forEach((item, index) => {
      const matchedFabric = fabricsTop.find(f => 
        f.name?.toLowerCase() === item.printName?.toLowerCase() || 
        f.id?.toLowerCase() === item.printName?.toLowerCase() ||
        (item.imageUrl && f.imageUrl === item.imageUrl)
      );
      const categoryLabel = matchedFabric && matchedFabric.category 
        ? ` / ${matchedFabric.category.toLowerCase()}` 
        : '';

      let itemLine = `${index + 1}. ${item.sizeName} (${item.lengthInches}") • ${item.shapeName} • Print ${item.printName}${categoryLabel} • Qty ${item.quantity}`;
      if (item.sizeName.toLowerCase().includes('liner')) {
        itemLine += ` (Backing: ${item.backingName}, Core: ${item.absorbencyName})`;
      }
      itemLine += ` → S$${item.totalPrice.toFixed(2)}`;
      msg += `${itemLine}${lineSpacing}`;
    });

    const totalCost = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    msg += `${lineSpacing}*Total: S$${totalCost.toFixed(2)}*`;
    return msg;
  };

  const handleSendVia = (method: 'whatsapp' | 'email') => {
    if (cart.length === 0) return;
    if (!inquiryName.trim()) {
      showToast("Please fill in YOUR NAME.", 'error');
      return;
    }
    if (!inquiryPhone.trim()) {
      showToast("Please fill in PHONE (ACTIVE FOR WHATSAPP).", 'error');
      return;
    }
    if (!inquiryEmail.trim()) {
      showToast("Please fill in EMAIL ADDRESS.", 'error');
      return;
    }

    setIsSubmittingInquiry(true);

    let finalPhone = inquiryPhone.trim();
    if (/^[8936]\d{7}$/.test(finalPhone)) {
      finalPhone = `+65 ${finalPhone}`;
    }

    const textMsg = formatOrderMessage();

    setTimeout(() => {
      const generatedInquiryNum = `WP-${Math.floor(100000 + Math.random() * 900000)}`;
      setInquiryResult({
        inquiryNumber: generatedInquiryNum,
        name: inquiryName || "Sandra Wonder",
        address: "Singapore Delivery / WhatsApp Hand-off",
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        items: [...cart],
        estimatedTotal: cart.reduce((sum, item) => sum + item.totalPrice, 0)
      });

      if (method === 'whatsapp') {
        let destPhone = merchantPhone.trim() || '6583397556';
        let numericOnly = destPhone.replace(/\D/g, '');
        if (numericOnly.length === 8 && (numericOnly.startsWith('8') || numericOnly.startsWith('9') || numericOnly.startsWith('6'))) {
          numericOnly = '65' + numericOnly;
        } else if (!numericOnly.startsWith('65') && numericOnly.length === 8) {
          numericOnly = '65' + numericOnly;
        }
        const destination = numericOnly || "6583397556"; 
        const waUrl = `https://wa.me/${destination}?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, '_blank');
      } else {
        const destEmail = merchantEmail.trim() || 'ecowonderpads@gmail.com';
        const mailtoUrl = `mailto:${destEmail}?subject=${encodeURIComponent("Wonder Pads Order Receipt Inquiry " + generatedInquiryNum)}&body=${encodeURIComponent(textMsg)}`;
        window.open(mailtoUrl, '_blank');
      }

      setIsSubmittingInquiry(false);
      saveCart([]); 
    }, 600);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Active Visualizer Computations for easy access in Step 5 JSX:
  const visualizerShapeD = useMemo(() => {
    return getVisualizerPathD(designerShape, visualizerWidthSlider, visualizerLengthSlider);
  }, [designerShape, visualizerWidthSlider, visualizerLengthSlider]);

  const visualizerSizeBasePrice = designerSize ? getBasePriceForSize(designerSize.id, designerSize.lengthInches, designerSize.priceBase) : 0;
  const visualizerBackingInfo = designerSize ? getBespokeBackingInfo(designerSize.id, designerBacking.name) : { name: 'Black softshell fleece', premium: 0 };
  const visualizerAbsInfo = designerSize ? getBespokeAbsorbencyInfo(designerSize.id, designerAbsorbency.name) : { name: 'Standard core', premium: 0 };
  const activeCustomUnitPrice = visualizerSizeBasePrice + visualizerAbsInfo.premium + visualizerBackingInfo.premium;

  // Filtered Fabrics Top list using search and category, sorted numerically/alphabetically (memoized for performance)
  const filteredFabricsTop = useMemo(() => {
    return fabricsTop
      .filter(f => {
        if (f.hidden) return false;
        if (!selectedCategoryFilter) return false;
        if (selectedCategoryFilter !== 'All' && selectedCategoryFilter !== 'landing') {
          if (!f.category || f.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
            return false;
          }
        }
        const q = searchTop.toLowerCase();
        return f.name.toLowerCase().includes(q) || (f.material && f.material.toLowerCase().includes(q));
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  }, [fabricsTop, selectedCategoryFilter, searchTop]);

  const maxStep = selectedOptionTab === 'ready'
    ? (cart.length > 0 ? 3 : 2)
    : selectedOptionTab === 'bespoke'
    ? (cart.length > 0 ? 4 : 3)
    : (cart.length > 0 ? 2 : 1);

  // Floating Live Spec Preview calculations (visible on Bespoke tab steps)
  const floatingBespokeSz = designerSize ? (sizeOptions.find(s => s.id === designerSize.id) || null) : null;
  const floatingLength = floatingBespokeSz ? Number(selectedLengths[floatingBespokeSz.id] || designerSize?.lengthInches || floatingBespokeSz.lengthInches) : 0;
  let floatingShapeId = floatingBespokeSz ? (selectedShapes[floatingBespokeSz.id] || designerShape) : 'moon_rise';
  if (floatingBespokeSz && !isShapeAllowed(floatingShapeId, floatingLength)) {
    floatingShapeId = getFallbackShapeForLength(floatingLength);
  }
  const floatingAbsorbencyName = floatingBespokeSz ? (selectedAbsorbencies[floatingBespokeSz.id] || (floatingBespokeSz.id === 'liner' ? 'None' : 'Standard core')) : 'Standard core';
  const floatingBackingName = floatingBespokeSz ? (selectedBackings[floatingBespokeSz.id] || (floatingBespokeSz.id === 'liner' ? 'Printed Cotton' : floatingBespokeSz.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece')) : 'Black softshell fleece';
  
  const floatingSizeBasePrice = floatingBespokeSz ? getBasePriceForSize(floatingBespokeSz.id, floatingLength, floatingBespokeSz.priceBase) : 0;
  const floatingAbsInfo = floatingBespokeSz ? getBespokeAbsorbencyInfo(floatingBespokeSz.id, floatingAbsorbencyName) : { name: 'Standard core', premium: 0 };
  const floatingBackingInfo = floatingBespokeSz ? getBespokeBackingInfo(floatingBespokeSz.id, floatingBackingName) : { name: 'Black softshell fleece', premium: 0 };
  const floatingUnitPrice = floatingSizeBasePrice + floatingAbsInfo.premium + floatingBackingInfo.premium;

  return (
    <div id="wonder_pads_root" className="h-full w-full bg-brand-cream text-brand-charcoal font-sans antialiased selection:bg-brand-taupe/20 relative overflow-hidden flex flex-col">
      
      {/* DECORATIVE BACKGROUND LIGHT SOFT WATERCOLOR SPLASHES */}
      <div className="absolute top-12 left-12 w-96 h-96 bg-brand-pink/40 rounded-full filter blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute bottom-12 right-12 w-96 h-96 bg-brand-pink/25 rounded-full filter blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-[#FFF2F8]/70 rounded-full filter blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute bottom-[30%] left-[5%] w-80 h-80 bg-brand-pink-light/65 rounded-full filter blur-3xl pointer-events-none hidden md:block" />

      {/* LUXURIOUS RESPONSIVE DESKTOP APPLICATION WRAPPER */}
      <div 
        id="smartphone_frame" 
        className="w-full h-full bg-transparent flex flex-col overflow-hidden relative transition-all"
      >
        
        {/* WATERCOLOR BOTANICAL BACKGROUND WASH */}
        <div className="absolute inset-0 bg-brand-cream/80 pointer-events-none z-0" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-brand-pink/30 rounded-full filter blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 -right-16 w-80 h-80 bg-brand-pink-light/40 rounded-full filter blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 left-1/4 w-72 h-72 bg-brand-pink/20 rounded-full filter blur-3xl pointer-events-none z-0" />
        
        {/* ELEGANT IN-APP TOAST NOTIFICATION CONTAINER (WONDERPADS THEMED) */}
        <div 
          id="custom_toast_container"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] max-w-sm flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              id={`toast_${toast.id}`}
              key={toast.id}
              className={`p-3.5 rounded-2xl shadow-lg border flex items-start gap-3 pointer-events-auto transform transition-all duration-300 animate-toast-in ${
                toast.type === 'success'
                  ? 'bg-[#F4FAF6] border-[#D1F2DC] text-[#246A3E]'
                  : toast.type === 'error'
                  ? 'bg-[#FDF2F2] border-[#FBD5D5] text-[#9B1C1C]'
                  : 'bg-[#FDF7FB] border-[#F6D5EB] text-[#922B50]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#246A3E]" />
                ) : toast.type === 'error' ? (
                  <X className="h-5 w-5 text-[#9B1C1C]" />
                ) : (
                  <Info className="h-5 w-5 text-[#922B50]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold leading-relaxed font-sans">{toast.message}</p>
              </div>
              <button
                id={`close_toast_${toast.id}`}
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-zinc-400 hover:text-zinc-600 focus:outline-none shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* LOGO & BRAND PAGE HEADER */}
        {currentPath !== '/sizing-guide' && currentPath !== '/benefits' && currentPath !== '/about' && currentPath !== '/why-cloth-pads' && currentPath !== '/contact' && currentPath !== '/blog' && currentPath !== '/faq' && !isRtsPage && (
          <header className="relative bg-[#FDF7FB]/85 backdrop-blur-md border-b border-brand-taupe/15 py-4 px-4 sm:px-8 shrink-0 z-35 shadow-3xs">
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full gap-4">
              <div className="flex items-center gap-2.5 shrink-0">
                <button 
                  type="button"
                  onClick={handleFlowerTap}
                  className="h-14 w-14 sm:h-16 sm:w-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-3xs focus:outline-none select-none active:scale-95 transition-all overflow-hidden p-0 shrink-0"
                  title="Wonder Pads Shop Logo"
                >
                  <ShopLogo url={shopLogoUrl} />
                </button>
                <div className="hidden xs:flex flex-col justify-center">
                  <h1 className="font-nathan text-[18px] xs:text-[21px] sm:text-2xl md:text-3.5xl text-[#922B50] leading-none tracking-wide select-none whitespace-nowrap">
                    WonderPads <span className="text-[0.82em] sm:text-[1em]">Reusables</span>
                  </h1>
                </div>
              </div>

              {/* Main site navigation — matches the new marketing pages (About/Why Cloth Pads/Blog/FAQ/Contact) */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-6 overflow-x-auto scrollbar-none font-sans text-[13px] font-bold text-brand-charcoal/80 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOptionTab(null);
                    setIsRtsPage(false);
                    setLandingSubView('main');
                    navigateTo('/');
                  }}
                  className="hover:text-[#8C2346] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOptionTab(null);
                    setIsRtsPage(false);
                    setLandingSubView('make_your_pad');
                    navigateTo('/');
                  }}
                  className="hover:text-[#8C2346] transition-colors cursor-pointer"
                >
                  Custom Studio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOptionTab(null);
                    setIsRtsPage(true);
                    if (activeRtsCategoryTab === null || activeRtsCategoryTab === 'All') {
                      setActiveRtsCategoryTab('All');
                    }
                    navigateTo('/');
                  }}
                  className="hover:text-[#8C2346] transition-colors cursor-pointer"
                >
                  Ready Made
                </button>
                <button type="button" onClick={() => navigateTo('/about')} className="hover:text-[#8C2346] transition-colors cursor-pointer">
                  About
                </button>
                <button type="button" onClick={() => navigateTo('/why-cloth-pads')} className="hover:text-[#8C2346] transition-colors cursor-pointer">
                  Why Cloth Pads
                </button>
                <button type="button" onClick={() => navigateTo('/blog')} className="hover:text-[#8C2346] transition-colors cursor-pointer">
                  Blog
                </button>
                <button type="button" onClick={() => navigateTo('/faq')} className="hover:text-[#8C2346] transition-colors cursor-pointer">
                  FAQ
                </button>
                <button type="button" onClick={() => navigateTo('/contact')} className="hover:text-[#8C2346] transition-colors cursor-pointer">
                  Contact
                </button>
              </nav>

              <div className="flex items-center gap-2 shrink-0">
                {/* Hamburger menu — mobile/tablet only, mirrors the desktop nav row above */}
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="lg:hidden relative h-10 w-10 shrink-0 bg-white/85 hover:bg-white border border-zinc-250 hover:border-zinc-300 rounded-full flex items-center justify-center shadow-3xs hover:shadow-2xs transition-all duration-300 cursor-pointer"
                  title="Menu"
                >
                  {isMobileNavOpen ? <X className="h-4.5 w-4.5 text-brand-charcoal" /> : <Menu className="h-4.5 w-4.5 text-brand-charcoal" />}
                </button>

                {/* Cart icon — opens the existing floating basket drawer */}
                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0) {
                      setIsCartFloatingExpanded(true);
                    }
                  }}
                  className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 bg-white/85 hover:bg-white border border-zinc-250 hover:border-zinc-300 rounded-full flex items-center justify-center shadow-3xs hover:shadow-2xs transition-all duration-300 cursor-pointer"
                  title="View Basket"
                >
                  <ShoppingBag className="h-4.5 w-4.5 text-brand-charcoal" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-moss text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </div>

            </div>

            {/* Mobile/tablet slide-down nav panel — same links as the desktop nav row, tap to navigate and auto-close */}
            {isMobileNavOpen && (
              <nav className="lg:hidden max-w-7xl mx-auto mt-3 pt-3 border-t border-brand-taupe/15 flex flex-col gap-0.5 font-sans text-sm font-bold text-brand-charcoal/85 animate-fadeIn">
                {[
                  { label: 'Home', onClick: () => { setSelectedOptionTab(null); setIsRtsPage(false); setLandingSubView('main'); navigateTo('/'); } },
                  { label: 'Custom Studio', onClick: () => { setSelectedOptionTab(null); setIsRtsPage(false); setLandingSubView('make_your_pad'); navigateTo('/'); } },
                  { label: 'Ready Made', onClick: () => { setSelectedOptionTab(null); setIsRtsPage(true); if (activeRtsCategoryTab === null || activeRtsCategoryTab === 'All') { setActiveRtsCategoryTab('All'); } navigateTo('/'); } },
                  { label: 'About', onClick: () => navigateTo('/about') },
                  { label: 'Why Cloth Pads', onClick: () => navigateTo('/why-cloth-pads') },
                  { label: 'Blog', onClick: () => navigateTo('/blog') },
                  { label: 'FAQ', onClick: () => navigateTo('/faq') },
                  { label: 'Contact', onClick: () => navigateTo('/contact') },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick();
                      setIsMobileNavOpen(false);
                    }}
                    className="text-left py-2.5 px-1 hover:text-[#8C2346] hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </header>
        )}

        {/* SCROLLABLE CENTRAL MAIN APPLICATION BAR */}
        <main 
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-3 sm:px-8 space-y-6 sm:space-y-12 custom-scrollbar pb-0 relative select-text scroll-smooth"
        >
          {currentPath === '/sizing-guide' ? (
            <SizingGuideView 
              onNavigate={navigateTo}
              onStartCustomizer={(flow) => {
                setSelectedOptionTab('bespoke');
                setCustomFlow(flow);
                if (containerRef.current) {
                  containerRef.current.scrollTop = 0;
                }
              }}
            />
          ) : currentPath === '/benefits' ? (
            <BenefitsPage onNavigate={navigateTo} />
          ) : currentPath === '/about' ? (
            <AboutPage onNavigate={navigateTo} />
          ) : currentPath === '/why-cloth-pads' ? (
            <WhyClothPadsPage
              onNavigate={navigateTo}
              onStartCustomizer={() => {
                setSelectedOptionTab('bespoke');
                navigateTo('/');
                if (containerRef.current) {
                  containerRef.current.scrollTop = 0;
                }
              }}
            />
          ) : currentPath === '/contact' ? (
            <ContactPage onNavigate={navigateTo} merchantPhone={merchantPhone} merchantEmail={merchantEmail} />
          ) : currentPath === '/blog' ? (
            <BlogPage onNavigate={navigateTo} blogPosts={blogPosts} />
          ) : currentPath === '/faq' ? (
            <FaqPage onNavigate={navigateTo} washingFaq={washingFaq} />
          ) : (
            <>
              {/* DEDICATED SELECTION VIEW NAVIGATION HEADER               */}
          {/* ======================================================== */}
          {shouldShowCheckout ? (
            <div className="flex justify-center pb-3 border-b border-zinc-150/80 animate-fadeIn">
              <div className="text-[10.5px] font-black tracking-widest text-[#922B50] bg-[#FFF5F7] border border-rose-200/30 px-4 py-2 rounded-full uppercase font-sans shadow-3xs text-center">
                🛒 Secure Checkout Order Summary
              </div>
            </div>
          ) : (
            !isRtsPage && selectedOptionTab !== null && customFlow !== 'fabric' && customFlow !== 'size' && (
              <div className="pb-3.5 border-b border-zinc-150/80 animate-fadeIn flex justify-center">
                <div className="text-[10.5px] font-black tracking-widest text-[#922B50] bg-[#FFF5F7] border border-rose-200/30 px-4 py-2 rounded-full uppercase font-sans shadow-3xs text-center">
                  {selectedOptionTab === 'bespoke' 
                    ? `✂️ Custom Studio (${customFlow === 'size' ? 'Size-First' : 'Fabric-First'})` 
                    : '📦 Ready To Ship Stock'}
                </div>
              </div>
            )
          )}

          {/* ======================================================== */}
          {/* STEP 1: PORTAL CHOOSE OPTIONS (CUSTOM BESPOKE & READY)   */}
          {/* ======================================================== */}
          {!shouldShowCheckout && selectedOptionTab === null && !isRtsPage && (
            <div id="step-1" className="scroll-mt-28 space-y-4 sm:space-y-5 animate-fadeIn">
              
              {landingSubView === 'main' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center max-w-6xl mx-auto py-4 sm:py-6 text-left">
                  {/* LEFT COLUMN: HERO COPY & CALL TO ACTIONS */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5 animate-fadeIn">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-[#FFF0F4]/90 border border-[#F1CFEA] text-[#922B50] px-3.5 py-1.5 rounded-full text-xs font-black font-sans tracking-wide shadow-3xs">
                      <span>🌸</span>
                      <span>Handmade to order in Singapore</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal leading-tight tracking-tight">
                      Period care,<br/>made for you.
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-[13px] sm:text-[14px] text-zinc-650 leading-relaxed max-w-xl font-medium">
                      Custom handcrafted cloth pads in your choice of fabric, shape, and size. Soft, sustainable, and beautifully made — one pad at a time.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-stretch gap-2.5 pt-3 w-fit">
                      {/* Option 1: Design Your Pads */}
                      <button
                        onClick={() => {
                          setLandingSubView('make_your_pad');
                          if (containerRef.current) {
                            containerRef.current.scrollTop = 0;
                          }
                        }}
                        type="button"
                        className="bg-[#922B50] hover:bg-[#8A1C44] text-white font-serif font-extrabold text-sm sm:text-base py-2.5 px-6 sm:px-7 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-99 flex items-center justify-center gap-2 cursor-pointer border border-transparent select-none whitespace-nowrap"
                      >
                        <span>Make Your Pad</span>
                        <span className="text-sm font-sans">→</span>
                      </button>

                      {/* Option 2: Ready Made For You */}
                      <button
                        onClick={() => {
                          setIsRtsPage(true);
                          if (activeRtsCategoryTab === null || activeRtsCategoryTab === 'All') {
                            setActiveRtsCategoryTab('All');
                          }
                          if (containerRef.current) {
                            containerRef.current.scrollTop = 0;
                          }
                        }}
                        type="button"
                        className="bg-white/85 backdrop-blur-xs hover:bg-white text-brand-charcoal border border-zinc-250 hover:border-zinc-300 font-serif font-extrabold text-sm sm:text-base py-2.5 px-6 sm:px-7 rounded-full shadow-3xs hover:shadow-2xs transition-all duration-350 hover:scale-[1.01] active:scale-99 flex items-center justify-center gap-2 cursor-pointer select-none whitespace-nowrap"
                      >
                        <span>Ready Made For You</span>
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-taupe/15 max-w-lg">
                      <div className="space-y-0.5">
                        <div className="font-serif font-black text-base sm:text-lg text-[#922B50] leading-none">100%</div>
                        <div className="font-sans text-[10px] sm:text-[11px] text-zinc-500 font-semibold uppercase tracking-wider leading-tight">Handmade</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-serif font-black text-base sm:text-lg text-[#922B50] leading-none">5–10yr</div>
                        <div className="font-sans text-[10px] sm:text-[11px] text-zinc-500 font-semibold uppercase tracking-wider leading-tight">Lifespan</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-serif font-black text-base sm:text-lg text-[#922B50] leading-none">0 waste</div>
                        <div className="font-sans text-[10px] sm:text-[11px] text-zinc-500 font-semibold uppercase tracking-wider leading-tight">Disposables</div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: HERO ART/FABRIC SWATCH GALLERY */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center py-6 lg:py-0 select-none">
                    <div className="relative w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] lg:w-[360px] lg:h-[360px] flex items-center justify-center animate-fadeIn">
                      
                      {/* Animated outer soft glow / rings */}
                      <div className="absolute inset-0 rounded-full bg-radial from-[#F1CFEA]/30 via-transparent to-transparent scale-110 pointer-events-none" />
                      <div className="absolute inset-2 rounded-full border border-dashed border-[#F1CFEA]/40 animate-spin-slow pointer-events-none" />
                      
                      {/* Main elegant pastel pink circular ring */}
                      <div className="absolute inset-6 rounded-full bg-[#FFF0F4]/40 border-2 border-white/60 shadow-3xs flex items-center justify-center" />

                      {/* Center card containing selection helper */}
                      <div className="absolute w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-white/95 border border-[#F1CFEA]/30 shadow-3xs flex flex-col items-center justify-center z-10 p-2.5 text-center">
                        <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#922B50]/65">Customise</span>
                        <span className="font-serif font-black text-[#922B50] text-[11px] sm:text-xs leading-tight mt-0.5">Pick a print</span>
                        <span className="font-sans text-[8px] sm:text-[9px] text-zinc-400 mt-1 font-medium">Click to filter</span>
                      </div>

                      {/* 6 beautiful rounded circular swatches representing categories */}
                      {HERO_SWATCHES.map((swatch, idx) => {
                        const positions = [
                          "top-0 left-1/2 -translate-x-1/2 -translate-y-1",       // Flowers (Top Center)
                          "top-10 right-2 sm:right-4",                             // Kimmi (Top Right)
                          "bottom-10 right-2 sm:right-4",                          // Characters (Bottom Right)
                          "bottom-0 left-1/2 -translate-x-1/2 translate-y-1",      // Abstract (Bottom Center)
                          "bottom-10 left-2 sm:left-4",                            // Halloween (Bottom Left)
                          "top-10 left-2 sm:left-4"                                // Animal (Top Left)
                        ];

                        return (
                          <button
                            key={swatch.category}
                            type="button"
                            onClick={() => handleSwatchClick(swatch.category)}
                            className="absolute bg-white border border-[#F1CFEA]/40 rounded-full p-1.5 shadow-2xs hover:scale-110 transition-all duration-250 cursor-pointer group z-20 focus:outline-none"
                            style={{
                              top: positions[idx].includes('top') ? (positions[idx].includes('top-0') ? '0px' : '40px') : undefined,
                              bottom: positions[idx].includes('bottom') ? (positions[idx].includes('bottom-0') ? '0px' : '40px') : undefined,
                              left: positions[idx].includes('left') ? (positions[idx].includes('left-1/2') ? '50%' : (positions[idx].includes('left-2') ? '8px' : undefined)) : undefined,
                              right: positions[idx].includes('right') ? (positions[idx].includes('right-2') ? '8px' : undefined) : undefined,
                              transform: positions[idx].includes('-translate-x-1/2') ? 'translateX(-50%)' : undefined
                            }}
                          >
                            <div className="relative w-12 h-12 sm:w-15 sm:h-15 rounded-full overflow-hidden shadow-3xs">
                              <img
                                src={swatch.imageUrl}
                                alt={swatch.label}
                                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-[#FFF0F4]/10 mix-blend-multiply group-hover:bg-transparent transition-colors" />
                            </div>
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 border border-zinc-150/50 px-1.5 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-zinc-500 shadow-3xs group-hover:text-[#922B50] group-hover:border-[#922B50]/30 transition-colors whitespace-nowrap">
                              {swatch.label}
                            </span>
                          </button>
                        );
                      })}

                    </div>

                    {/* Small text link below the cluster */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOptionTab('bespoke');
                        setCustomFlow('fabric');
                        setFabricStep(1);
                        setSelectedCategoryFilter('All');
                        setTimeout(() => {
                          const el = document.getElementById('step-fabric-flow');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-xs font-bold text-zinc-500 hover:text-[#922B50] transition-colors flex items-center gap-1 cursor-pointer bg-white/80 border border-zinc-200/60 px-4 py-1.5 rounded-full shadow-3xs hover:shadow-2xs active:scale-95 transition-all mt-4 animate-fadeIn"
                    >
                      <span>180+ prints</span>
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* LANDING SUB-VIEW: MAKE YOUR PAD OPTIONS */
                <div className="space-y-6 sm:space-y-8 animate-fadeIn text-left">
                  
                  {/* Friendly navigation header inside sub-view */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl mx-auto border-b border-brand-taupe/10 pb-4">
                    <button
                      onClick={() => setLandingSubView('main')}
                      className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-taupe hover:text-[#922B50] transition-colors cursor-pointer bg-white/70 hover:bg-white px-4 py-2 rounded-full border border-zinc-200/80 shadow-3xs self-start active:scale-95 transition-all"
                    >
                      <span>← Back to Home</span>
                    </button>
                  </div>

                  {/* Custom Studio Welcome Block */}
                  <div className="text-center space-y-2 py-4 max-w-2xl mx-auto">
                    <span className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#922B50] uppercase font-sans">
                      CUSTOM STUDIO
                    </span>
                    <h3 className="font-serif font-black text-3xl sm:text-4xl lg:text-4.5xl text-brand-charcoal tracking-tight leading-tight">
                      Design Your Perfect Pad
                    </h3>
                    <p className="font-sans text-[12.5px] sm:text-[14px] text-zinc-500 font-medium leading-relaxed max-w-xl mx-auto">
                      Choose your own path. Whether you're inspired by a fabric or know exactly what you need, we'll guide you to create your ideal custom pad.
                    </p>
                  </div>

                  {/* Original Two Design Pathways Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    
                    {/* Card 1: Start with Fabric */}
                    <div 
                      id="entry_path_fabric"
                      onClick={() => {
                        setSelectedOptionTab('bespoke');
                        setCustomFlow('fabric');
                        setFabricStep(1);
                        setTimeout(() => {
                           const el = document.getElementById('step-fabric-flow');
                           if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="bg-gradient-to-br from-[#FFFDFE] via-[#FFFBFD] to-[#FFF5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group border-2 border-brand-pink/60 hover:border-brand-rose/40 min-h-[280px] text-left"
                      style={{ backgroundColor: '#f4fff4' }}
                    >
                      <div>
                        {/* Circle badge with Paint Palette */}
                        <div className="w-12 h-12 rounded-full bg-[#fce8eb] flex items-center justify-center mb-6 shadow-3xs">
                          <Palette className="w-5 h-5 text-[#c43d71]" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-brand-charcoal mb-3 flex items-center gap-1.5">
                          🎨 Start with Fabric
                        </h3>
                        
                        {/* Subtext */}
                        <p className="font-sans text-xs sm:text-[13.5px] text-zinc-650 leading-relaxed font-medium">
                          Inspired by a print? Browse our fabrics first, then build your custom pad set.
                        </p>
                      </div>
                      
                      {/* Action Link */}
                      <div className="pt-6">
                        <span className="font-serif text-[13.5px] font-bold text-[#c43d71] group-hover:underline inline-flex items-center gap-1">
                          Browse Fabrics <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Start with Need */}
                    <div 
                      id="entry_path_need"
                      onClick={() => {
                        setSelectedOptionTab('bespoke');
                        setCustomFlow('size');
                        setNeedStep(1);
                        setTimeout(() => {
                          const el = document.getElementById('step-need-flow');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="bg-gradient-to-br from-[#FAFDFB] via-[#F5FCF7] to-[#EEF9F1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group border-2 border-[#CBE5D2]/75 hover:border-emerald-600/35 min-h-[280px] text-left"
                      style={{ backgroundColor: '#fff8e0' }}
                    >
                      <div>
                        {/* Circle badge with Heart */}
                        <div className="w-12 h-12 rounded-full bg-[#e3ebd9] flex items-center justify-center mb-6 shadow-3xs">
                          <Heart className="w-5 h-5 text-[#7d9f67]" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-brand-charcoal mb-3 flex items-center gap-1.5">
                          🩸 Start with Need
                        </h3>
                        
                        {/* Subtext */}
                        <p className="font-sans text-xs sm:text-[13.5px] text-zinc-650 leading-relaxed font-medium">
                          Know what you need? Choose your absorbency and size first, then pick your favourite fabric.
                        </p>
                      </div>
                      
                      {/* Action Link */}
                      <div className="pt-6">
                        <span className="font-serif text-[13.5px] font-bold text-[#c43d71] group-hover:underline inline-flex items-center gap-1">
                          Choose Absorbency <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Card: Both paths lead to the same cart */}
                  <div className="max-w-4xl mx-auto w-full pt-2 pb-6">
                    <div className="bg-[#fdfbf9]/95 border border-[#e3ebd9]/40 rounded-3xl p-6 sm:p-8 text-left shadow-3xs transition-all duration-300 hover:shadow-xs">
                      <h4 className="font-serif font-black text-lg sm:text-xl text-brand-charcoal mb-2">
                        Both paths lead to the same cart
                      </h4>
                      <p className="font-sans text-xs sm:text-[13.5px] text-zinc-500 leading-relaxed">
                        Mix and match items from either workflow. Your cart stays with you as you design your complete custom collection.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {landingSubView === 'main' && (
                <div className="space-y-8 sm:space-y-10 pt-6 border-t border-zinc-100/60 mt-6">

                  {/* WHY WONDER PADS FEATURE SECTION */}
                  <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto text-center animate-fadeIn">
                    <div className="space-y-1.5 sm:space-y-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#922B50] font-sans">
                        Why Wonder Pads
                      </span>
                      <h3 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-brand-charcoal leading-tight">
                        Crafted with care, worn with confidence
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                      {/* Truly Custom */}
                      <div className="bg-gradient-to-br from-[#FFFDFE] via-[#FFF9FB] to-[#FFF1F5] border-2 border-[#FFF0F4]/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-brand-pink/70 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#FFF0F4] flex items-center justify-center text-[#922B50] shadow-3xs">
                          <Scissors className="h-5 w-5 animate-pulse" />
                        </div>
                        <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                          Truly Custom
                        </h4>
                        <p className="font-sans text-xs sm:text-[13px] text-zinc-650 font-semibold leading-relaxed">
                          Every pad is made to your exact specifications — shape, size, fabric, and backing. Nothing is pre-made or off-the-shelf.
                        </p>
                      </div>

                      {/* Sustainable Choice */}
                      <div className="bg-gradient-to-br from-[#FAFDFB] via-[#F2FAF4] to-[#EAF7EC] border-2 border-[#EAF7EC]/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-[#CBE5D2]/70 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#EAF7EC] flex items-center justify-center text-[#246A3E] shadow-3xs">
                          <Leaf className="h-5 w-5" />
                        </div>
                        <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                          Sustainable Choice
                        </h4>
                        <p className="font-sans text-xs sm:text-[13px] text-zinc-650 font-semibold leading-relaxed">
                          One set of cloth pads replaces thousands of disposables over its lifetime, dramatically reducing your environmental footprint.
                        </p>
                      </div>

                      {/* Gentle on Skin */}
                      <div className="bg-gradient-to-br from-[#FBFAFD] via-[#F7F3FC] to-[#F3EAF7] border-2 border-[#F3EAF7]/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-[#DCD3EE]/70 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#F3EAF7] flex items-center justify-center text-[#6D28D9] shadow-3xs">
                          <Heart className="h-5 w-5" />
                        </div>
                        <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                          Gentle on Skin
                        </h4>
                        <p className="font-sans text-xs sm:text-[13px] text-zinc-650 font-semibold leading-relaxed">
                          Made from natural, breathable fibres free from synthetic fragrances, dioxins, and plastics found in disposable pads.
                        </p>
                      </div>
                    </div>
                  </div>


                
                  {/* 1. How It Works - Full-width standalone parent card without nested child cards */}
                  <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 animate-fadeIn text-left">
                    <div className="bg-[#FFF5F6] border border-[#FADCDD]/80 rounded-[32px] p-6 sm:p-8 shadow-3xs flex flex-col justify-start space-y-6 transition-all duration-300 w-full">
                      <div className="space-y-1 pb-4 border-b border-[#FADCDD]/35 text-left">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#A24467] font-sans">The Process</span>
                        <h3 className="font-serif font-black text-[#5C1A32] text-xl sm:text-2xl mt-0.5">
                          How It Works
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[#A24467] font-semibold italic mt-2">
                          Tip: If you're new to cloth, start with the size closest to your usual disposable pad.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 font-sans text-left">
                        {/* Step 1 */}
                        <div className="space-y-3.5 flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="h-8 w-8 rounded-full bg-[#FCE5E8] text-[#8C2346] flex items-center justify-center font-serif font-black text-xs sm:text-sm shadow-3xs shrink-0">
                              1
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-black text-[#5C1A32] text-base leading-snug">
                                Customise or Shop RTS
                              </h4>
                            </div>
                            <div className="font-sans text-xs sm:text-[13px] text-[#5C1A32]/85 leading-relaxed font-medium">
                              <p>
                                Browse our Ready-to-Ship (RTS) collection, or create your own by choosing the size, shape, fabric and backing
                                <button 
                                  onClick={() => setShowBackingInfo(!showBackingInfo)}
                                  type="button"
                                  className="inline-flex items-center justify-center p-0.5 ml-1 text-[#8C2346] hover:text-[#5C1A32] bg-[#FCE5E8]/80 hover:bg-[#FADCDD]/90 rounded-full transition-all active:scale-95 cursor-pointer align-middle"
                                  aria-label="Backing options info"
                                >
                                  <Info className="h-3 w-3 shrink-0" />
                                </button>
                                . Mix prints or keep them matching—it’s completely up to you.
                              </p>
                              {showBackingInfo && (
                                <div className="mt-2.5 p-2.5 bg-white border border-[#FADCDD]/50 rounded-xl text-[10px] sm:text-[11px] text-[#5C1A32] leading-snug font-medium animate-fadeIn text-left space-y-1 shadow-3xs">
                                  <p className="font-bold border-b border-[#FADCDD]/30 pb-0.5 mb-1 text-[#8C2346]">Backing Options</p>
                                  <p>Liners let you choose between Organic Cotton, Printed Cotton, or Anti-pill Fleece.</p>
                                  <p>All other pads come with a standard Soft-shell Fleece backing (white for Light pads, black for Regular, Heavy &amp; Extra Long).</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="space-y-3.5 flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="h-8 w-8 rounded-full bg-[#FCE5E8] text-[#8C2346] flex items-center justify-center font-serif font-black text-xs sm:text-sm shadow-3xs shrink-0">
                              2
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-black text-[#5C1A32] text-base leading-snug">
                                Build Your Collection
                              </h4>
                            </div>
                            <p className="font-sans text-xs sm:text-[13px] text-[#5C1A32]/85 leading-relaxed font-medium">
                              Review your choices and build a routine that fits your lifestyle. Add everything to your cart at once.
                            </p>
                          </div>
                        </div>
   
                        {/* Step 3 */}
                        <div className="space-y-3.5 flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="h-8 w-8 rounded-full bg-[#FCE5E8] text-[#8C2346] flex items-center justify-center font-serif font-black text-xs sm:text-sm shadow-3xs shrink-0">
                              3
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-black text-[#5C1A32] text-base leading-snug">
                                Checkout Fast
                              </h4>
                            </div>
                            <p className="font-sans text-xs sm:text-[13px] text-[#5C1A32]/85 leading-relaxed font-medium">
                              Fill in your delivery details with no account needed, keeping your experience effortless.
                            </p>
                          </div>
                        </div>
   
                        {/* Step 4 */}
                        <div className="space-y-3.5 flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="h-8 w-8 rounded-full bg-[#FCE5E8] text-[#8C2346] flex items-center justify-center font-serif font-black text-xs sm:text-sm shadow-3xs shrink-0">
                              4
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-serif font-black text-[#5C1A32] text-base leading-snug">
                                Send to Nilam
                              </h4>
                            </div>
                            <p className="font-sans text-xs sm:text-[13px] text-[#5C1A32]/85 leading-relaxed font-medium">
                              Via WhatsApp or email, she confirms and begins handcrafting your customized pads!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Side-by-side Reference and Care Preview Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto animate-fadeIn text-left items-start px-4 sm:px-6">
                  
                  {/* Card 1: Sizing & Pricing Preview Card (Lavender/Blue) */}
                  <UnifiedCard
                    tagText="QUICK REFERENCE"
                    tagTextColor="text-indigo-700 font-bold"
                    title="📏 Sizing & Pricing"
                    titleColor="text-indigo-950"
                    bgColor="bg-[#e9edfb]"
                    borderColor="border-indigo-200/60"
                    shadowSize="shadow-3xs"
                    footer={(
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigateTo('/sizing-guide')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 rounded-lg text-[10.5px] sm:text-xs font-bold uppercase tracking-wider border border-indigo-200 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer select-none"
                        >
                          <span>View full guide</span>
                          <span className="text-sm">→</span>
                        </button>
                      </div>
                    )}
                  >
                    {/* Teaser items */}
                    <div className="space-y-4 font-sans text-left mt-2">
                      {/* Bullet 1 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-indigo-100/90 text-indigo-950 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">📐</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-indigo-950 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Sizes 6" to 20”</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Ranging from daily liners to extra long overnight coverage designed for your body.</p>
                        </div>
                      </div>

                      {/* Bullet 2 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-indigo-100/90 text-indigo-950 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">💰</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-indigo-950 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Prices from S$5.50</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Affordable, transparent cost tiers based on the absorbency and size you select.</p>
                        </div>
                      </div>

                      {/* Bullet 3 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-indigo-100/90 text-indigo-950 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">🌿</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-indigo-950 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Premium Natural Materials</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Breathable cotton print toppers, super absorbent core shields, and leakproof backers.</p>
                        </div>
                      </div>
                    </div>
                  </UnifiedCard>
 
                  {/* Card 2: Care Guide Preview Card (Yellow) */}
                  <UnifiedCard
                    tagText="CARE INSTRUCTIONS"
                    tagTextColor="text-amber-800 font-bold"
                    title="🧺 Care Guide"
                    titleColor="text-amber-950"
                    bgColor="bg-[#fef6dd]"
                    borderColor="border-amber-200/60"
                    shadowSize="shadow-3xs"
                    footer={(
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCareModal(true);
                            if (containerRef.current) {
                              containerRef.current.scrollTop = 0;
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg text-[10.5px] sm:text-xs font-bold uppercase tracking-wider border border-amber-200 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer select-none"
                        >
                          <span>View full guide</span>
                          <span className="text-sm">→</span>
                        </button>
                      </div>
                    )}
                  >
                    {/* Teaser items */}
                    <div className="space-y-4 font-sans text-left mt-2">
                      {/* Item 1 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-amber-100/90 text-amber-900 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">💧</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-amber-900 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Rinse Immediately</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Rinse with cold water after use to prevent staining. Avoid hot water.</p>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-amber-100/90 text-amber-900 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">🧺</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-amber-900 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Machine Wash</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Wash with your regular laundry on a gentle cycle. Avoid fabric softeners.</p>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="flex gap-2.5 items-start">
                        <span className="h-5 w-5 rounded-full bg-amber-100/90 text-amber-900 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">☀️</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-amber-900 text-[11.5px] xs:text-xs sm:text-[13px] leading-tight">Dry Naturally</p>
                          <p className="text-zinc-650 leading-snug font-medium text-[10px] xs:text-[10.5px] sm:text-[11.5px] mt-0.5">Line dry in sunlight when possible to sanitize, or tumble dry on low.</p>
                        </div>
                      </div>
                    </div>
                  </UnifiedCard>
                  
                </div>
                
                {/* Why Wonder Pads section has been moved to the top of the main landing subview */}

                {/* Nilam Maker Message Card */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 text-center space-y-3.5 shadow-xs max-w-2xl mx-auto">
                  <p className="font-sans text-[11px] sm:text-[12px] text-zinc-600 leading-relaxed max-w-xl mx-auto" style={{ fontSize: '16px', fontFamily: 'Georgia' }}>
                    Hi there, I am <strong className="text-brand-charcoal font-black">Nilam</strong>, the maker behind all the pads. Every single WonderPad is mindfully designed and stitched one-by-one with beautiful cottons and organic, body-safe textiles. I created this custom studio to let you choose or design your perfect routine with absolute ease. I can't wait to stitch your chosen pads for you!
                  </p>
                  <div className="flex items-center justify-center gap-2.5" style={{ fontSize: '20px', fontFamily: 'Georgia' }}>
                    <div className="h-7 w-7 rounded-full bg-brand-moss/10 text-brand-moss flex items-center justify-center font-serif text-xs font-black" style={{ fontSize: '19px', lineHeight: '27px', borderRadius: '15.35544px', borderStyle: 'dotted', borderWidth: '0px' }}>
                      N
                    </div>
                    <div className="text-left">
                      <h5 className="font-sans font-black text-[10px] text-brand-charcoal uppercase tracking-wider leading-none" style={{ fontFamily: 'Georgia', fontSize: '15px' }}>Nilam</h5>
                      <p className="text-[9px] text-zinc-400 font-sans font-medium leading-none mt-0.5" style={{ fontFamily: 'Times New Roman', fontSize: '12px' }}>Founder & Maker, WonderPads</p>
                    </div>
                  </div>
                </div>


              </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* READY-TO-SHIP (RTS) PAGE                                 */}
          {/* ======================================================== */}
          {!shouldShowCheckout && isRtsPage && (
            <div id="step-rts-page" className="w-full scroll-mt-28 space-y-8 sm:space-y-12 animate-fadeIn text-left">
              {/* RTS Header Banner */}
              <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#EAF6ED]/85 border-b border-[#CBE5D2] px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsRtsPage(false);
                    setLandingSubView('main');
                    if (containerRef.current) {
                      containerRef.current.scrollTop = 0;
                    }
                    window.scrollTo(0, 0);
                  }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
                  title="Close RTS Store"
                >
                  ✕
                </button>

                {/* Subtle paper texture overlay */}
                <div 
                  className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none mix-blend-multiply" 
                  style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} 
                />
                
                <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#1E5D30] font-sans block">
                    READY TO SHIP SERIES
                  </span>
                  <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#143d20] leading-tight">
                    Browse Ready Pick Me Pads
                  </h2>
                  <p className="font-sans text-xs sm:text-[14px] text-zinc-650 max-w-lg mx-auto leading-relaxed font-medium">
                    No customizer lead time! These limited-release, pre-sewn packs are ready to pack and dispatch to you immediately.
                  </p>
                </div>
              </div>

              {/* RTS Content Area */}
              <div className="max-w-5xl lg:max-w-6xl mx-auto space-y-6">
                <div className="space-y-6">
                  {/* Filter category tabs */}
                  <div className="flex flex-wrap justify-center gap-1.5 pb-3 border-b border-zinc-150 items-center">
                    {rtsCategoriesList.map((tab) => {
                      const isSelected = activeRtsCategoryTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveRtsCategoryTab(tab.id)}
                          className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-brand-moss text-white border-brand-moss shadow-3xs scale-[1.02]'
                              : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-850 border-zinc-200'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-zinc-200 text-zinc-650'
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {activeRtsCategoryTab === null ? (
                    <div className="bg-stone-50/55 rounded-3xl p-10 border border-stone-150/60 text-center space-y-1.5 animate-fadeIn max-w-md mx-auto my-6">
                      <span className="text-2xl block">📦</span>
                      <p className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Select a Category</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Please select a category tab above to explore our pre-crafted ready-to-ship packs!
                      </p>
                    </div>
                  ) : filteredRtsItems.length === 0 ? (
                    <div className="bg-stone-50/55 rounded-3xl p-12 border border-stone-150/60 text-center space-y-2 animate-fadeIn max-w-md mx-auto my-6">
                      <span className="text-3xl block">✨</span>
                      <p className="text-sm font-bold text-zinc-800 uppercase tracking-wider">No {activeRtsCategoryTab} packs available</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        We are currently busy crafting fresh limited-release {activeRtsCategoryTab} packs! Check back soon or select another category above.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {filteredRtsItems.map((pack) => (
                        <div 
                          key={pack.id}
                          className="bg-white rounded-2xl border border-zinc-200/60 flex flex-col justify-between shadow-3xs hover:shadow-xs hover:border-brand-moss/80 transition-all duration-300 overflow-hidden relative"
                        >
                          {hideLookbookInBackOffice ? (
                            <div className="flex-none bg-[#fdfbf7] w-full aspect-[3/4] flex flex-col items-center justify-center p-3 text-center border-b border-zinc-150/60 shadow-inner-sm select-none">
                              <span className="text-2xl mb-1">📦</span>
                              <span className="text-[9px] font-extrabold uppercase text-stone-500 tracking-wider font-sans">Ready Stock</span>
                            </div>
                          ) : (
                            <div 
                              className="relative group/img cursor-zoom-in flex-none overflow-hidden bg-stone-50/40 w-full aspect-[3/4] flex items-center justify-center border-b border-zinc-150/60"
                              onClick={() => setZoomedImageUrl(pack.imageUrl)}
                              title="Click to zoom image"
                            >
                              <img 
                                src={getOptimizedImageUrl(pack.imageUrl, 'thumbnail')} 
                                alt={pack.name} 
                                className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="bg-white/95 text-zinc-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 scale-90 group-hover/img:scale-100 transition-transform duration-300">
                                  🔍 Zoom
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex flex-col justify-between p-2.5 sm:p-3 font-sans">
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center justify-between gap-1.5 min-w-0">
                                <div className="flex items-baseline gap-1.5 min-w-0">
                                  <span className="text-xs sm:text-[13px] font-black text-zinc-900 tracking-tight leading-tight truncate" title={pack.name}>{pack.name}</span>
                                  {pack.size && (
                                    <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium font-sans whitespace-nowrap shrink-0">
                                      • {getJustSizeNumber(pack.size)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedRtsIds(prev => ({
                                      ...prev,
                                      [pack.id]: !prev[pack.id]
                                    }));
                                  }}
                                  className={`p-1 rounded-full hover:bg-zinc-100 transition-colors shrink-0 ${
                                    expandedRtsIds[pack.id] ? 'text-[#8A5A87] bg-[#8A5A87]/10' : 'text-zinc-400 hover:text-[#8A5A87]'
                                  }`}
                                  title="Show details"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              
                              {!(pack.name.toLowerCase().includes(pack.computedCategory.toLowerCase()) || (pack.print && pack.print.toLowerCase().includes(pack.computedCategory.toLowerCase()))) && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-block text-[8px] sm:text-[9.5px] font-black text-brand-moss bg-brand-cream/80 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shrink-0">
                                    {pack.computedCategory}
                                  </span>
                                </div>
                              )}
                              
                              {expandedRtsIds[pack.id] && (
                                <div 
                                  className="absolute bottom-[48px] sm:bottom-[52px] left-2 right-2 bg-white/98 border border-zinc-200 rounded-xl p-3 shadow-xl z-20 text-left animate-fadeIn text-[10.5px] text-zinc-600 leading-relaxed cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedRtsIds(prev => ({
                                      ...prev,
                                      [pack.id]: false
                                    }));
                                  }}
                                >
                                  {/* Small triangle arrow on top pointing up near info icon */}
                                  <div className="absolute right-3.5 -top-1.5 w-3 h-3 bg-white border-t border-l border-zinc-200 rotate-45" />
                                  <div className="relative z-10">
                                    {renderDescriptionWithBrackets(pack.description)}
                                    <div className="mt-2 pt-1.5 border-t border-zinc-100 text-[9px] text-[#8a3c2b] font-bold text-right flex justify-between items-center">
                                      <span className="text-zinc-400 font-normal">Tap bubble to close</span>
                                      <span>✕ Dismiss</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-zinc-100/80 gap-1">
                              <span className="text-[13px] sm:text-base font-black text-zinc-950 font-serif shrink-0">
                                S${pack.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleAddReadyMadeItem(pack)}
                                className="bg-brand-moss text-white py-1 px-2.5 sm:px-3 rounded-lg text-[10.5px] sm:text-[13px] font-bold hover:bg-brand-moss/90 flex items-center gap-0.5 transition-all cursor-pointer shadow-3xs shrink-0 active:scale-95"
                              >
                                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Back button at the bottom of the page */}
                <div className="pt-6 border-t border-zinc-100 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRtsPage(false);
                      if (containerRef.current) {
                        containerRef.current.scrollTop = 0;
                      }
                      window.scrollTo(0, 0);
                      if (document.body) document.body.scrollTop = 0;
                      if (document.documentElement) document.documentElement.scrollTop = 0;
                    }}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-taupe hover:text-[#922B50] transition-colors cursor-pointer bg-brand-cream/60 hover:bg-brand-cream/90 px-5 py-2.5 rounded-full border border-zinc-200/60 shadow-3xs hover:scale-102 active:scale-98 transition-all"
                  >
                    <span>←</span>
                    <span>Back to Customizer Studio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CHOOSE CUSTOM FABRIC COMBINATIONS               */}
          {/* ======================================================== */}
          {!shouldShowCheckout && selectedOptionTab === 'bespoke' && customFlow === 'fabric' && (
            <div id="step-fabric-flow" className="scroll-mt-28 space-y-6">
              <div className="space-y-6 animate-scaleIn">
                
                {/* BEAUTIFUL PINK BRAND HEADER - WATERCOLOR BANNER STYLE */}
                <div className="-mx-4 sm:-mx-8 -mt-3 mb-6 bg-[#FDF0F3]/85 border-b border-[#F1CFEA]/50 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSelectedOptionTab(null);
                      setCustomFlow(null);
                      if (containerRef.current) {
                        containerRef.current.scrollTop = 0;
                      }
                      window.scrollTo(0, 0);
                    }}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
                    title="Close Customizer"
                  >
                    ✕
                  </button>

                  {/* Subtle paper texture overlay inside the header for an organic feel */}
                  <div className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
                  
                  <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#C54B64] font-sans block">
                      WORKFLOW: START WITH FABRIC
                    </span>
                    <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#7E2537] leading-tight">
                      Browse &amp; Build
                    </h2>
                    <p className="font-sans text-xs sm:text-[14px] text-zinc-650 max-w-lg mx-auto leading-relaxed font-medium">
                      Explore our selection of premium organic cotton fabrics, vibrant custom prints, and luxurious materials to start your bespoke design.
                    </p>
                  </div>
                </div>

                {/* Elegant card for the progress indicators */}
                <div className="bg-[#FFFDFE] rounded-3xl p-5 border border-brand-pink/50 text-left space-y-1.5 shadow-3xs">
                  <span className="text-[9px] font-black tracking-widest text-[#C54B64] uppercase block">
                    Your Customizer Progress
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { s: 1, label: '1. Choose Fabric' },
                      { s: 2, label: '2. Choose Sizes' },
                      { s: 3, label: '3. Configure Specs' }
                    ].map((stepItem) => {
                      const isActive = fabricStep === stepItem.s;
                      const isCompleted = fabricStep > stepItem.s;
                      
                      // Disable if:
                      // - Step is ahead of current fabricStep
                      // - Step is 2 or 3 but no print is selected
                      // - Step is 3 but no bespoke sizes are selected
                      const isStepDisabled = 
                        stepItem.s > fabricStep || 
                        (stepItem.s >= 2 && designerPrint.id === 'none') || 
                        (stepItem.s === 3 && selectedBespokeSizes.length === 0);

                      return (
                        <button
                          key={stepItem.s}
                          type="button"
                          disabled={isStepDisabled}
                          onClick={() => {
                            setFabricStep(stepItem.s);
                            if (containerRef.current) {
                              containerRef.current.scrollTop = 0;
                            }
                            window.scrollTo(0, 0);
                          }}
                          className={`text-center space-y-1 group transition-all pb-1 ${
                            !isStepDisabled ? 'cursor-pointer' : 'cursor-default opacity-60'
                          }`}
                        >
                          {/* Progress Line */}
                          <div className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-[#C54B64]' 
                              : isCompleted 
                                ? 'bg-[#922B50]' 
                                : 'bg-zinc-200'
                          }`} />
                          
                          {/* Label */}
                          <p className={`text-[8px] xs:text-[9.5px] font-black uppercase tracking-wider block transition-colors ${
                            isActive 
                              ? 'text-[#C54B64]' 
                              : isCompleted 
                                ? 'text-[#922B50]' 
                                : 'text-zinc-400'
                          }`}>
                            <span className="hidden xs:inline">{stepItem.label}</span>
                            <span className="xs:hidden">{stepItem.s}</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP CONTENT SWITCHER */}
                {fabricStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <h3 id="fabric-step-1-header" className="scroll-mt-28 font-serif font-black text-2xl xs:text-3xl text-brand-charcoal text-left">
                          Choose your fabric
                        </h3>
                        <div className="text-left mt-1.5">
                          <button
                            type="button"
                            onClick={() => setShowFabricExplanation(!showFabricExplanation)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#8A5A87] hover:text-[#724a70] transition-colors focus:outline-none cursor-pointer"
                          >
                            <span>ⓘ Why does this matter?</span>
                            <span className={`transform transition-transform duration-200 text-[10px] ${showFabricExplanation ? 'rotate-180' : ''}`}>▾</span>
                          </button>
                          {showFabricExplanation && (
                            <p className="mt-1.5 font-sans text-[11px] xs:text-[12px] sm:text-[13px] text-zinc-600 leading-relaxed text-left animate-fadeIn">
                              The topper (or top layer) of a reusable cloth pad is the fabric that rests against your skin. Its primary job is to quickly pull or "wick" liquid down into the absorbent core while remaining comfortable. We carry cotton woven printed and organic cotton in solids.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTop}
                          onChange={(e) => setSearchTop(e.target.value)}
                          placeholder="Search over 180+ top patterns..."
                          className="w-full pl-9 pr-8 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-moss focus:border-brand-moss bg-zinc-50"
                        />
                        {searchTop && (
                          <button
                            type="button"
                            onClick={() => setSearchTop('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Categories filter pills */}
                      <div className="flex flex-wrap gap-1.5 pb-1.5 pt-0.5 items-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryFilter('All')}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                            selectedCategoryFilter === 'All'
                              ? 'bg-brand-moss text-white shadow-3xs font-black scale-[1.02]'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-850'
                          }`}
                        >
                          ✨ All
                        </button>
                        {categories.map((cat) => {
                          const isSelected = selectedCategoryFilter === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-moss text-white shadow-3xs font-black scale-[1.02]'
                                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-850'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Count and status */}
                      <div className="flex justify-between items-center text-[9.5px] text-zinc-400 font-bold px-1">
                        <span>
                          Showing {filteredFabricsTop.length} of {fabricsTop.length} options
                        </span>
                        {(searchTop || selectedCategoryFilter !== 'All') && (
                          <span className="text-brand-moss font-semibold">Filtered list</span>
                        )}
                      </div>

                      {/* FABRIC SEAMLESS SCROLLER GRID */}
                      <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-1">
                          {selectedCategoryFilter === null && !searchTop ? (
                            <div className="text-center py-8 px-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                              <span className="text-lg">🎨</span>
                              <p className="text-xs font-bold text-zinc-700 mt-2">Select a Category</p>
                              <p className="text-[10px] text-zinc-400 mt-1 max-w-[220px] mx-auto">Please select a fabric category tab above to explore our gorgeous custom patterns.</p>
                            </div>
                          ) : filteredFabricsTop.length === 0 ? (
                            <div className="text-center py-8 px-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                              <span className="text-lg">🎨</span>
                              <p className="text-xs font-bold text-zinc-700 mt-2">No matching top patterns found</p>
                              <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px] mx-auto">Try typing another material or select a different category.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchTop('');
                                  setSelectedCategoryFilter('All');
                                }}
                                className="mt-3 text-[10px] font-black text-brand-moss uppercase tracking-wider bg-white py-1 px-3 border border-zinc-200 rounded-full hover:bg-zinc-50 shadow-3xs"
                              >
                                Reset filters
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 xs:gap-2">
                              {filteredFabricsTop.map((fab) => {
                                const isSelected = designerPrint.id === fab.id;
                                return (
                                  <div
                                    key={fab.id}
                                    onClick={() => {
                                      if (isSelected) {
                                        setDesignerPrint(NONE_FABRIC);
                                        setSelectedPrints(prev => ({
                                          ...prev,
                                          liner: 'No Pattern Selected',
                                          light: 'No Pattern Selected',
                                          moderate: 'No Pattern Selected',
                                          heavy: 'No Pattern Selected',
                                          extra_long: 'No Pattern Selected'
                                        }));
                                        setExpandedBespokeCardId(null);
                                      } else {
                                        setDesignerPrint(fab);
                                        setSelectedPrints(prev => ({
                                          ...prev,
                                          liner: fab.name,
                                          light: fab.name,
                                          moderate: fab.name,
                                          heavy: fab.name,
                                          extra_long: fab.name
                                        }));
                                        setExpandedBespokeCardId(null);
                                        setTimeout(() => {
                                          setFabricStep(2);
                                          if (containerRef.current) {
                                            containerRef.current.scrollTop = 0;
                                          }
                                          window.scrollTo(0, 0);
                                        }, 350);
                                      }
                                    }}
                                    className={`bg-white rounded-[16px] border transition-all relative cursor-pointer flex flex-col justify-between select-none overflow-hidden group ${
                                      isSelected 
                                        ? 'border-brand-moss bg-brand-moss/[0.01] ring-1 ring-brand-moss/30 shadow-sm' 
                                        : 'border-zinc-200/80 hover:border-brand-moss/40 shadow-sm hover:shadow-md'
                                    }`}
                                  >
                                    {/* Full width top image with no outer padding */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-[#fbf9f4] flex-none border-b border-zinc-100/50 flex flex-col items-center justify-center p-2 text-center shadow-inner-sm select-none">
                                      {hideLookbookInBackOffice ? (
                                        <>
                                          <span className="text-2xl mb-1">🎨</span>
                                          <span className="text-[9.5px] font-extrabold uppercase text-stone-500 tracking-wider">Fabric Swatch</span>
                                        </>
                                      ) : (
                                        <>
                                          <img 
                                            src={getOptimizedImageUrl(fab.imageUrl, 'thumbnail')} 
                                            alt={fab.name} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            referrerPolicy="no-referrer"
                                          />

                                          {/* Floating zoom magnifying button */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setZoomedFabric(fab);
                                            }}
                                            className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 h-6 w-6 xs:h-7 xs:w-7 bg-white/90 backdrop-blur-xs hover:bg-white text-zinc-650 hover:text-zinc-950 rounded-full flex items-center justify-center shadow-3xs border border-zinc-200/50 transition-all hover:scale-110 active:scale-90 z-20"
                                            title="Zoom Pattern"
                                          >
                                            <ZoomIn className="h-3.5 w-3.5" />
                                          </button>
                                        </>
                                      )}
                                      
                                      {/* Circle Checked tick icon with solid green and white border */}
                                      {isSelected && (
                                        <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 h-4.5 w-4.5 xs:h-5 xs:w-5 bg-brand-moss text-white rounded-full flex items-center justify-center shadow-md border-1.5 border-white z-10">
                                          <Check className="h-2.5 w-2.5 stroke-[4.5px]" />
                                        </div>
                                      )}

                                      {/* Low stock indicators with soft red-pink color */}
                                      {fab.stockStatus === 'low_stock' && (
                                        <div className="absolute bottom-1 left-1 bg-[#E57373] text-white text-[6.5px] xs:text-[7.5px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full shadow-3xs z-10">
                                          LOW
                                        </div>
                                      )}
                                    </div>

                                    {/* Info portion */}
                                    <div className="p-1 xs:p-1.5 flex-1 flex flex-col justify-between gap-1 xs:gap-1.5">
                                      <div className="px-0.5 flex items-center justify-between gap-1 w-full">
                                        <div className="flex flex-col min-w-0 flex-1">
                                          <span className="text-[8.5px] xs:text-[9.5px] font-bold text-zinc-900 font-sans uppercase tracking-wide truncate" title={fab.name}>
                                            {fab.name}
                                          </span>
                                          <span className="text-[6.5px] xs:text-[7.5px] text-zinc-400 font-sans font-extrabold uppercase tracking-widest truncate">
                                            {fab.material || 'Woven'}
                                          </span>
                                        </div>
                                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                          fab.stockStatus === 'out_of_stock'
                                            ? 'bg-rose-500'
                                            : fab.stockStatus === 'low_stock'
                                              ? 'bg-amber-500 animate-pulse'
                                              : 'bg-emerald-500'
                                        }`} title={
                                          fab.stockStatus === 'out_of_stock'
                                            ? 'Out of Stock (OFS)'
                                            : fab.stockStatus === 'low_stock'
                                              ? 'Low Stock'
                                              : 'Available'
                                        } />
                                      </div>

                                      <button
                                        type="button"
                                        className={`w-full text-[7px] xs:text-[8px] font-black tracking-widest uppercase py-1 rounded-md text-center transition-all ${
                                          isSelected
                                            ? 'bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white shadow-3xs'
                                            : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-650'
                                        }`}
                                      >
                                        {isSelected ? 'SELECTED' : 'CHOOSE'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Flow-aware Bottom Navigation for Step 1 Fabrics */}
                      <div className="pt-8 pb-4 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn border-t border-zinc-100/60 mt-8 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOptionTab(null);
                            setCustomFlow(null);
                            if (containerRef.current) {
                              containerRef.current.scrollTop = 0;
                            }
                            window.scrollTo(0, 0);
                            if (document.body) document.body.scrollTop = 0;
                            if (document.documentElement) document.documentElement.scrollTop = 0;
                          }}
                          className="w-full sm:w-auto bg-brand-cream/70 hover:bg-brand-cream text-brand-taupe text-xs font-black py-3.5 px-6 rounded-full uppercase tracking-widest shadow-3xs border border-zinc-200/60 transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>🎨</span>
                          <span>Back to Studio</span>
                        </button>

                        {designerPrint.id !== 'none' && (
                          <button
                            type="button"
                            onClick={() => {
                              setFabricStep(2);
                            }}
                            className="w-full sm:w-auto bg-[#8a3c2b] hover:bg-[#743224] text-white text-xs font-black py-3.5 px-6 rounded-full uppercase tracking-widest shadow-md transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>📏 Choose Pad Size</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {fabricStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-4">
                      <div className="space-y-1 text-left border-b border-zinc-100 pb-4">
                        <span className="text-[9.5px] font-black tracking-widest text-brand-taupe uppercase block">
                          Step 2 of 3
                        </span>
                        <h2 id="fabric-step-2-header" className="scroll-mt-28 font-serif font-black text-2xl sm:text-3xl text-brand-charcoal tracking-tight leading-tight">
                          Choose your pad size
                        </h2>
                        <p className="text-zinc-500 text-xs sm:text-sm font-medium">
                          Select the size that best matches your flow needs.
                        </p>
                      </div>

                      {/* Multiple Choice Toggle / Note */}
                      <div className="max-w-xl mx-auto bg-[#FAF9FB] border border-[#FAF3FA] rounded-2xl p-4.5 flex items-start gap-3 mt-2 text-left select-none transition-all duration-200">
                        <label className="flex items-start gap-3 cursor-pointer w-full">
                          <div className="flex items-center h-5 mt-0.5">
                            <input
                              type="checkbox"
                              checked={allowMultipleBespokePads}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setAllowMultipleBespokePads(checked);
                                if (!checked) {
                                  // Reset to just the first chosen size (or 'light' as fallback)
                                  const currentFirst = selectedBespokeSizes[0] || 'light';
                                  setSelectedBespokeSizes([currentFirst]);
                                } else {
                                  // Clear selection so nothing is auto-selected when switching to multi-select
                                  setSelectedBespokeSizes([]);
                                }
                              }}
                              className="w-4.5 h-4.5 text-[#8A5A87] border-zinc-300 rounded focus:ring-[#8A5A87] focus:ring-2 cursor-pointer accent-[#8A5A87]"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-[#5A4E5D]">
                              I want to select multiple pad sizes in this fabric
                            </p>
                            <p className="text-[10.5px] text-zinc-500 font-medium leading-normal">
                              Check this box if you want to select and customize multiple sizes (e.g. Liner + Light) at the same time. If unchecked, clicking a size will immediately take you to customize it.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Display 5 beautifully customized selectable cards */}
                      <div className="max-w-xl mx-auto space-y-3 mt-4 text-left animate-fadeIn">
                        {sizeOptions.map((sz) => {
                          const isSelected = selectedBespokeSizes.includes(sz.id);
                          
                          // Custom card details based on pad size
                          let cardMeta = { icon: '🌸', range: '8"–12" · 3 shapes', desc: '' };
                          if (sz.id === 'liner') {
                            cardMeta = { icon: '🌿', range: '6"–9" · 3 shapes', desc: 'Daily freshness, spotting, very light days, or backup for cups and tampons.' };
                          } else if (sz.id === 'light') {
                            cardMeta = { icon: '🌸', range: '8"–12" · 3 shapes', desc: 'Light flow days, the beginning or end of your period, or everyday backup.' };
                          } else if (sz.id === 'moderate') {
                            cardMeta = { icon: '🌺', range: '10"–14" · 3 shapes', desc: 'Regular flow days when you need dependable everyday protection.' };
                          } else if (sz.id === 'heavy') {
                            cardMeta = { icon: '🌷', range: '12"–14" · 3 shapes', desc: 'Heavy flow days, longer wear, or extra confidence when you need it most.' };
                          } else if (sz.id === 'extra_long') {
                            cardMeta = { icon: '🌻', range: '15"–20" · 4 shapes', desc: 'Overnight use, postpartum recovery, or anyone who prefers extra coverage.' };
                          }

                          return (
                            <div
                              key={sz.id}
                              onClick={() => {
                                if (allowMultipleBespokePads) {
                                  toggleBespokeSize(sz.id);
                                } else {
                                  setSelectedBespokeSizes([sz.id]);
                                  goToBespokeStep3WithSizes([sz.id]);
                                }
                              }}
                              className={`rounded-2xl p-4.5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative ${
                                isSelected && allowMultipleBespokePads
                                  ? 'bg-[#FDF6F8] border-[#8A5A87] shadow-sm'
                                  : 'bg-white border-[#F3E2E5]/75 hover:border-[#8A5A87]/30 hover:bg-[#FAF9FB] shadow-3xs'
                              }`}
                            >
                              {/* Selection overlay indicator */}
                              <div className="absolute top-4.5 right-4.5 flex items-center gap-2">
                                <span className="text-[10px] font-serif font-medium text-zinc-500">
                                  from S${sz.priceBase.toFixed(2)}
                                </span>
                                {allowMultipleBespokePads ? (
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected 
                                      ? 'border-[#8A5A87] bg-[#8A5A87]' 
                                      : 'border-zinc-300 bg-white'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 flex items-center justify-center text-zinc-400 opacity-60 hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1 max-w-[85%]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-lg">{cardMeta.icon}</span>
                                  <h3 className="font-serif font-black text-base text-brand-charcoal">
                                    {sz.name}
                                  </h3>
                                </div>
                                <p className="text-[10px] font-normal text-zinc-400 tracking-wide font-sans">
                                  {cardMeta.range}
                                </p>
                                <p className="text-xs text-zinc-500 leading-normal font-medium mt-0.5">
                                  {cardMeta.desc || sz.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation Buttons for Step 2 */}
                      <div className="pt-8 pb-2 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setFabricStep(1);
                          }}
                          className="w-full sm:w-auto bg-white hover:bg-zinc-50 text-zinc-500 text-xs font-black py-3.5 px-6 rounded-full uppercase tracking-widest shadow-3xs border border-zinc-200 transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>← Choose Another Fabric</span>
                        </button>

                        {allowMultipleBespokePads && (
                          <button
                            type="button"
                            disabled={selectedBespokeSizes.length === 0}
                            onClick={() => {
                              goToBespokeStep3WithSizes(selectedBespokeSizes);
                            }}
                            className={`w-full sm:w-auto text-white text-xs font-black py-3.5 px-7 rounded-full uppercase tracking-widest shadow-md transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-2 ${
                              selectedBespokeSizes.length === 0
                                ? 'bg-zinc-300 cursor-not-allowed opacity-60'
                                : 'bg-[#8a3c2b] hover:bg-[#743224] cursor-pointer'
                            }`}
                          >
                            <span>Next: Configure Selected Pads</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {fabricStep === 3 && (
                  <div className="space-y-5 animate-fadeIn max-w-5xl mx-auto px-4 text-left">
                    {/* Header spans across both columns */}
                    <div className="space-y-0.5 text-left border-b border-zinc-100 pb-2">
                      <span className="text-[9px] font-black tracking-widest text-brand-taupe uppercase block">
                        Step 3 of 3
                      </span>
                      <h2 id="fabric-step-3-header" className="scroll-mt-28 font-serif font-black text-xl text-brand-charcoal tracking-tight leading-tight">
                        Configure Sizing & Core Options
                      </h2>
                      <p className="text-zinc-500 text-[11px] font-medium leading-normal">
                        Customize your chosen size below. Use the live 2D visualizer to see changes instantly.
                      </p>
                    </div>

                    {(() => {
                      const activeSizeId = selectedBespokeSizes.includes(activeBespokeSizeId)
                        ? activeBespokeSizeId
                        : (selectedBespokeSizes[0] || 'light');
                      const sz = sizeOptions.find(s => s.id === activeSizeId) || sizeOptions[1] || SIZE_OPTIONS[1];

                      const currentQty = quantities[sz.id] || 0;
                      const localPrint = selectedPrints[sz.id] || designerPrint.name || 'No Pattern Selected';
                      const localAbsorbencyName = selectedAbsorbencies[sz.id] || 'Standard core';
                      const localBackingName = selectedBackings[sz.id] || (sz.id === 'liner' ? 'Printed Cotton' : sz.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');

                      const backingInfo = getBespokeBackingInfo(sz.id, localBackingName);
                      const absInfo = getBespokeAbsorbencyInfo(sz.id, localAbsorbencyName);
                      const lengthChamber = selectedLengths[sz.id] || sz.lengthInches;

                      let localShapeId = selectedShapes[sz.id] || ((sz.id === 'liner' || sz.id === 'light') ? 'moon_rise' : (sz.id === 'moderate' || sz.id === 'heavy') ? 'sunglow' : 'mega_pad');
                      if (!isShapeAllowed(localShapeId, lengthChamber)) {
                        localShapeId = getFallbackShapeForLength(lengthChamber);
                      }

                      const baseSizePrice = getBasePriceForSize(sz.id, lengthChamber, sz.priceBase);
                      const baseUnitPrice = baseSizePrice + absInfo.premium + backingInfo.premium;

                      const isAddedInBasket = cart.some(
                        item => !item.isReadyMade && 
                                item.sizeName === sz.name && 
                                item.lengthInches === lengthChamber && 
                                item.printName === localPrint &&
                                item.absorbencyName === absInfo.name &&
                                item.backingName === backingInfo.name &&
                                item.shapeName === (SHAPE_OPTIONS.find(s => s.id === localShapeId)?.name || 'MoonRise')
                      );

                      const updateBespokeSpecs = (updates: {
                        length?: number;
                        shape?: string;
                        absorbency?: string;
                        backing?: string;
                      }) => {
                        let finalLength = lengthChamber;
                        if (updates.length !== undefined) {
                          finalLength = updates.length;
                          setSelectedLengths(prev => ({ ...prev, [sz.id]: updates.length! }));
                        }
                        
                        let finalShape = selectedShapes[sz.id];
                        if (updates.shape !== undefined) {
                          finalShape = updates.shape;
                          setSelectedShapes(prev => ({ ...prev, [sz.id]: updates.shape! }));
                        } else if (updates.length !== undefined && finalShape !== undefined && !isShapeAllowed(finalShape, updates.length)) {
                          finalShape = getFallbackShapeForLength(updates.length);
                          setSelectedShapes(prev => ({ ...prev, [sz.id]: finalShape }));
                        }

                        let finalAbs = localAbsorbencyName;
                        if (updates.absorbency !== undefined) {
                          finalAbs = updates.absorbency;
                          setSelectedAbsorbencies(prev => ({ ...prev, [sz.id]: updates.absorbency! }));
                        }

                        let finalBacking = localBackingName;
                        if (updates.backing !== undefined) {
                          finalBacking = updates.backing;
                          setSelectedBackings(prev => ({ ...prev, [sz.id]: updates.backing! }));
                        }

                        // Sync with visualizer state
                        setDesignerSize({ ...sz, lengthInches: finalLength });
                        if (finalShape) {
                          setDesignerShape(finalShape);
                        }
                        setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === finalAbs) || ABSORBENCY_OPTIONS[0]);
                        setDesignerBacking(fabricsBacking.find(f => f.name === finalBacking) || fabricsBacking[0] || FABRICS_BACKING[0]);
                        setDesignerPrint(fabricsTop.find(f => f.name === localPrint) || NONE_FABRIC);
                      };

                      const availableShapes = [
                        { id: 'moon_rise', name: 'MoonRise' },
                        { id: 'sunglow', name: 'SunGlow' },
                        { id: 'staple', name: 'Staple' },
                        { id: 'mega_pad', name: 'MegaPad' }
                      ].filter(sh => {
                        if (sh.id === 'mega_pad') return sz.id === 'extra_long';
                        return true;
                      });

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start w-full">
                          {/* LEFT/MAIN COLUMN: Unified Designer Workstation Card */}
                          <div className="md:col-span-8 space-y-4">
                            {/* UNIFIED CUSTOMIZER PANEL */}
                            <div className="bg-white rounded-2xl border border-zinc-200/85 p-4 shadow-3xs text-left space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                
                                {/* 2D Live Visualizer & Specs Info Column */}
                                <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF9FB]/75 p-3 rounded-xl border border-[#FAF3FA]">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black tracking-widest text-[#8A5A87] uppercase select-none leading-none">
                                      Live 2D Preview
                                    </span>
                                    <span className="text-[7px] bg-white text-[#8A5A87] px-1.5 py-0.5 rounded border border-[#FAF3FA] font-black uppercase tracking-wider select-none leading-none">
                                      scale 1:2
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 items-center flex-1">
                                    {/* Canvas Box */}
                                    <div className="w-full h-36 rounded-xl border border-[#FAF3FA] bg-white flex items-center justify-center p-1 relative overflow-hidden shadow-3xs">
                                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-zinc-200/40 pointer-events-none" />
                                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-zinc-200/40 pointer-events-none" />

                                      {selectedLengths[sz.id] !== undefined && selectedShapes[sz.id] !== undefined ? (
                                        <PadShape 
                                          shapeId={
                                            localShapeId.toLowerCase().includes('moon') ? 'moon_rise' :
                                            localShapeId.toLowerCase().includes('sun') ? 'sunglow' :
                                            localShapeId.toLowerCase().includes('staple') ? 'staple' :
                                            localShapeId.toLowerCase().includes('mega') ? 'mega_pad' : 'moon_rise'
                                          } 
                                          lengthInches={lengthChamber} 
                                          fabricImageUrl={designerPrint.imageUrl || null} 
                                          backingColor={backingInfo.id === 'printed-cotton' ? '#EACBD2' : '#F1EBF2'} 
                                          showSnaps={true}
                                          fitCanvas={true}
                                          sizeId={sz.id}
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-2 text-zinc-400 font-sans select-none relative z-10">
                                          <span className="text-lg mb-1 animate-pulse">🌸</span>
                                          <span className="text-[9px] font-black uppercase tracking-wider text-stone-500">Blank Canvas</span>
                                          <span className="text-[8px] text-zinc-400 mt-1 leading-tight">Select length & shape to view design</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Specs Details Box */}
                                    <div className="flex flex-col justify-between h-36 py-1 text-left text-zinc-600">
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-1 leading-none">
                                          <span className="font-extrabold text-[#8A5A87] uppercase text-[9px] tracking-wider select-none">
                                            PAD TYPE
                                          </span>
                                          {isAddedInBasket && (
                                            <span className="text-[8px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-mono font-black select-none leading-none">
                                              Active ✓
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="font-serif font-black text-brand-charcoal text-base leading-tight">
                                          {sz.name}
                                        </h4>
                                      </div>

                                      <div className="border-y border-zinc-100 py-1.5 my-1 flex-1 flex flex-col justify-center space-y-1">
                                        <div className="flex justify-between text-[9.5px] leading-none">
                                          <span className="text-zinc-400">Size</span>
                                          <span className="font-extrabold text-zinc-700">
                                            {selectedLengths[sz.id] !== undefined ? `${lengthChamber}"` : '–'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-[9.5px] leading-none">
                                          <span className="text-zinc-400">Shape</span>
                                          <span className="font-extrabold text-zinc-700">
                                            {selectedShapes[sz.id] !== undefined ? ((SHAPE_OPTIONS.find(s => s.id === localShapeId)?.name || 'MoonRise').split(' - ')[0]) : '–'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center leading-none pt-0.5">
                                        <span className="text-[8px] text-[#8A5A87] font-black uppercase tracking-wider">Unit Price</span>
                                        <span className="font-mono text-xs font-black text-[#8A5A87]">
                                          S${baseUnitPrice.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Configuration Selectors Column */}
                                <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                                  <div className="space-y-3">
                                    {/* Toggle active size if multiple selected */}
                                    {selectedBespokeSizes.length > 1 && (
                                      <div className="flex flex-col space-y-1 pb-1.5 border-b border-zinc-100/50">
                                        <span className="text-[8.5px] font-black tracking-wider text-[#8A5A87] uppercase text-left select-none leading-none">
                                          Select Pad Size to Edit:
                                        </span>
                                        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50 gap-0.5 select-none w-full">
                                          {selectedBespokeSizes
                                            .slice()
                                            .sort((a, b) => {
                                              const idxA = sizeOptions.findIndex(s => s.id === a);
                                              const idxB = sizeOptions.findIndex(s => s.id === b);
                                              return idxA - idxB;
                                            })
                                            .map((id) => {
                                              const sizeObj = sizeOptions.find(s => s.id === id);
                                              if (!sizeObj) return null;
                                              const isActive = id === activeSizeId;
                                              const isCompleted = cart.some(item => item.id.startsWith(`bespoke-${id}-`) || item.sizeName === sizeObj.name);
                                              return (
                                                <button
                                                  key={id}
                                                  type="button"
                                                  onClick={() => selectActiveSizeTab(id)}
                                                  className={`flex-1 text-center py-1.5 rounded-md transition-all font-black text-[10px] leading-none cursor-pointer ${
                                                    isActive
                                                      ? 'bg-[#8A5A87] text-white shadow-3xs'
                                                      : 'text-[#5A4E5D] hover:bg-zinc-200/55 hover:text-[#8A5A87]'
                                                  }`}
                                                >
                                                  {isCompleted && <span className="text-emerald-500 mr-1 select-none">✔️</span>}
                                                  {sizeObj.name}
                                                </button>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    )}

                                    {/* 1. Length selector */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Length
                                      </span>
                                      <div className="flex items-center gap-4 flex-wrap">
                                        {Array.from({ length: sz.maxLength - sz.minLength + 1 }, (_, i) => sz.minLength + i).map((inch) => {
                                          const isSelected = selectedLengths[sz.id] === inch;
                                          return (
                                            <button
                                              key={inch}
                                              type="button"
                                              onClick={() => updateBespokeSpecs({ length: inch })}
                                              className="flex items-center gap-1 text-xs font-bold text-[#5A4E5D] hover:text-[#8A5A87] select-none transition-colors cursor-pointer"
                                            >
                                              <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
                                                isSelected ? 'border-[#8A5A87] bg-white ring-2 ring-[#8A5A87]/15' : 'border-zinc-300 bg-white'
                                              }`}>
                                                {isSelected && <span className="w-1 h-1 rounded-full bg-[#8A5A87]" />}
                                              </span>
                                              <span className="leading-none">{inch}"</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* 2. Shape Selector */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Shape
                                      </span>
                                      <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50 gap-0.5 select-none text-[10px] font-bold">
                                        {availableShapes.map((sh) => {
                                          const isAllowed = isShapeAllowed(sh.id, lengthChamber);
                                          const isSelected = selectedShapes[sz.id] === sh.id && isAllowed;
                                          return (
                                            <button
                                              key={sh.id}
                                              type="button"
                                              disabled={!isAllowed}
                                              onClick={() => {
                                                if (!isAllowed) return;
                                                updateBespokeSpecs({ shape: sh.id });
                                              }}
                                              className={`px-2.5 py-1 rounded-md transition-all font-black shrink-0 flex items-center justify-center leading-none ${
                                                !isAllowed
                                                  ? 'text-zinc-300 cursor-not-allowed opacity-40'
                                                  : isSelected
                                                  ? 'bg-[#7D8F7D] text-white shadow-3xs cursor-pointer active:scale-95'
                                                  : 'text-[#5A4E5D] hover:text-[#7D8F7D] hover:bg-zinc-200/55 cursor-pointer'
                                              }`}
                                            >
                                              <span>{sh.name}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* 3. Core Selection Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Core
                                      </span>
                                      {sz.id === 'liner' ? (
                                        <select
                                          value={localAbsorbencyName}
                                          onChange={(e) => updateBespokeSpecs({ absorbency: e.target.value })}
                                          className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                                        >
                                          {LINER_ABSORBENCY_OPTIONS.map((a) => (
                                            <option key={a.id} value={a.name}>
                                              {a.name}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-transparent px-2.5 py-1 select-none leading-none rounded-lg">
                                          Standard core
                                        </span>
                                      )}
                                    </div>

                                    {/* 4. Backing Selection Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Backing
                                      </span>
                                      {sz.id === 'liner' ? (
                                        <select
                                          value={localBackingName}
                                          onChange={(e) => updateBespokeSpecs({ backing: e.target.value })}
                                          className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                                        >
                                          {LINER_BACKING_OPTIONS.filter(b => b.id !== 'organic-cotton').map((b) => (
                                            <option key={b.id} value={b.name}>
                                              {b.name}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-transparent px-2.5 py-1 select-none leading-none rounded-lg">
                                          {sz.id === 'light' ? 'White softshell' : 'Black softshell'} fleece
                                        </span>
                                      )}
                                    </div>

                                    {sz.id === 'liner' && (
                                      <p className="text-[9px] text-zinc-400 italic font-medium leading-none mt-1">
                                        * Choose additional core/different backer from above
                                      </p>
                                    )}
                                  </div>

                                  {/* 4. Actions: Qty and Add to Order */}
                                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9.5px] font-black text-zinc-400 uppercase leading-none">Qty:</span>
                                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 shadow-3xs">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentVal = quantities[sz.id] || 0;
                                            if (currentVal > 1) {
                                              setQuantities(prev => ({ ...prev, [sz.id]: currentVal - 1 }));
                                            }
                                          }}
                                          className="w-5 h-5 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer"
                                        >
                                          -
                                        </button>
                                        <span className="w-6 text-center font-mono font-extrabold text-xs text-zinc-800">
                                          {currentQty || 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentVal = quantities[sz.id] || 0;
                                            setQuantities(prev => ({ ...prev, [sz.id]: Math.max(1, currentVal) + 1 }));
                                          }}
                                          className="w-5 h-5 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentQtyForThisSize = quantities[sz.id] || 0;
                                        const qtyToAdd = currentQtyForThisSize > 0 ? currentQtyForThisSize : 1;
                                        if (currentQtyForThisSize <= 0) {
                                          setQuantities(prev => ({ ...prev, [sz.id]: 1 }));
                                        }
                                        handleAddSizeOptionToBasket(sz.id, qtyToAdd);
                                      }}
                                      className="px-3.5 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 bg-[#8A5A87] hover:bg-[#724a70] text-white shadow-xs cursor-pointer active:scale-95"
                                    >
                                      <ShoppingCart className="h-3.5 w-3.5" />
                                      <span>Add to Order</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>

                            {/* Back Button underneath Customizer panel */}
                            <div className="pt-1 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setFabricStep(2);
                                }}
                                className="bg-white hover:bg-zinc-50 text-zinc-500 text-[10px] font-black py-2 px-5 rounded-full uppercase tracking-wider shadow-3xs border border-zinc-200 transition-all duration-200 hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>← Back to Sizing Choices</span>
                              </button>
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Checkout Action Bar */}
                          <div className="md:col-span-4 space-y-4 md:sticky md:top-4">
                            {/* NAVIGATION AND CHECKOUT ACTION BAR */}
                            <div className="bg-[#FAFDFB] rounded-2xl p-3.5 border border-[#CBE5D2] space-y-3.5 text-left shadow-3xs">
                              <div className="flex justify-between items-center text-xs font-black text-brand-charcoal">
                                <span>Subtotal:</span>
                                <span className="text-[#922B50] text-sm font-black font-mono">
                                  S${cart.filter(item => !item.isReadyMade).reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (cart.filter(item => !item.isReadyMade).length === 0) {
                                      showToast("Please add at least one customized pad configuration to your order first!", "info");
                                      return;
                                    }
                                    setIsCheckoutPage(true);
                                    if (containerRef.current) {
                                      containerRef.current.scrollTop = 0;
                                    }
                                    window.scrollTo(0, 0);
                                  }}
                                  disabled={cart.filter(item => !item.isReadyMade).length === 0}
                                  className={`text-[10px] font-black py-3 px-4 rounded-full uppercase tracking-wider shadow-sm transition-all duration-200 hover:scale-101 flex items-center justify-center gap-1.5 ${
                                    cart.filter(item => !item.isReadyMade).length > 0
                                      ? 'bg-[#8a3c2b] hover:bg-[#743224] text-white cursor-pointer'
                                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                                  }`}
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  <span>Proceed to Checkout</span>
                                  <span>→</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setDesignerPrint(NONE_FABRIC);
                                    setFabricStep(1);
                                  }}
                                  className="bg-white hover:bg-zinc-50 text-zinc-500 text-[10px] font-black py-2.5 px-4 rounded-full uppercase tracking-wider shadow-3xs border border-zinc-200 transition-all duration-200 hover:scale-101 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>🎨 Choose Another Print</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* WORKFLOW B: START WITH NEED (SIZE/ABSORBENCY-FIRST FLOW) */}
          {/* ======================================================== */}
          {!shouldShowCheckout && selectedOptionTab === 'bespoke' && customFlow === 'size' && (
            <div id="step-need-flow" className="scroll-mt-28 space-y-6">
              <div className="space-y-6 animate-scaleIn">
                
                {/* BEAUTIFUL SAGE GREEN BRAND HEADER - WATERCOLOR BANNER STYLE */}
                <div className="-mx-4 sm:-mx-8 -mt-3 mb-6 bg-[#DCEFE1]/85 border-b border-[#CBE5D2] px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSelectedOptionTab(null);
                      setCustomFlow(null);
                      if (containerRef.current) {
                        containerRef.current.scrollTop = 0;
                      }
                      window.scrollTo(0, 0);
                    }}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
                    title="Close Customizer"
                  >
                    ✕
                  </button>

                  {/* Subtle paper texture overlay inside the header for an organic feel */}
                  <div className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
                  
                  <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#224832] font-sans block">
                      WORKFLOW: START WITH NEED
                    </span>
                    <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#14301F] leading-tight">
                      Choose Your Absorbency
                    </h2>
                    <p className="font-sans text-xs sm:text-[14px] text-zinc-650 max-w-lg mx-auto leading-relaxed font-medium">
                      Select your desired absorbency level or specify flow details to let our customizer recommend your ideal dimensions.
                    </p>
                  </div>
                </div>

                {/* Elegant card for the progress indicators */}
                <div className="bg-[#FAFDFB] rounded-3xl p-5 border border-[#CBE5D2]/50 text-left space-y-1.5 shadow-3xs">
                  <span className="text-[9px] font-black tracking-widest text-[#224832] uppercase block">
                    Your Customizer Progress
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { s: 1, label: '1. Fit & Specs' },
                      { s: 2, label: '2. Topper Print' },
                      { s: 3, label: '3. Add to Basket' }
                    ].map((stepItem) => {
                      const isActive = needStep === stepItem.s;
                      const isCompleted = needStep > stepItem.s;
                      return (
                        <button
                          key={stepItem.s}
                          type="button"
                          disabled={stepItem.s > needStep}
                          onClick={() => setNeedStep(stepItem.s)}
                          className={`text-center space-y-1 group transition-all pb-1 ${
                            stepItem.s <= needStep ? 'cursor-pointer' : 'cursor-default opacity-60'
                          }`}
                        >
                          {/* Progress Line */}
                          <div className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-[#224832]' 
                              : isCompleted 
                                ? 'bg-brand-moss' 
                                : 'bg-zinc-200'
                          }`} />
                          
                          {/* Label */}
                          <p className={`text-[8px] xs:text-[9.5px] font-black uppercase tracking-wider block transition-colors ${
                            isActive 
                              ? 'text-[#224832]' 
                              : isCompleted 
                                ? 'text-brand-moss' 
                                : 'text-zinc-400'
                          }`}>
                            <span className="hidden xs:inline">{stepItem.label}</span>
                            <span className="xs:hidden">{stepItem.s}</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP CONTENT SWITCHER */}
                {needStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-left space-y-1">
                      <h3 id="need-step-1-header" className="scroll-mt-28 font-serif font-black text-2xl xs:text-3xl text-brand-charcoal">
                        What type of pad do you need?
                      </h3>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setShowNeedExplanation(!showNeedExplanation)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#8A5A87] hover:text-[#724a70] transition-colors focus:outline-none cursor-pointer"
                        >
                          <span>ⓘ Not sure which one?</span>
                          <span className={`transform transition-transform duration-200 text-[10px] ${showNeedExplanation ? 'rotate-180' : ''}`}>▾</span>
                        </button>
                        {showNeedExplanation && (
                          <p className="mt-1 text-xs text-zinc-500 font-sans animate-fadeIn">
                            Select the absorbency class that best matches your flow needs.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="max-w-xl mx-auto space-y-3 mt-4 text-left">
                      {sizeOptions.map((sz) => {
                        const isSelected = selectedNeedAbsorbency === sz.id;
                        
                        // Custom card details based on pad size
                        let cardMeta = { icon: '🌸', range: '8"–12" · 3 shapes', desc: '' };
                        if (sz.id === 'liner') {
                          cardMeta = { icon: '🌿', range: '6"–9" · 3 shapes', desc: 'Daily freshness, spotting, very light days, or backup for cups and tampons.' };
                        } else if (sz.id === 'light') {
                          cardMeta = { icon: '🌸', range: '8"–12" · 3 shapes', desc: 'Light flow days, the beginning or end of your period, or everyday backup.' };
                        } else if (sz.id === 'moderate') {
                          cardMeta = { icon: '🌺', range: '10"–14" · 3 shapes', desc: 'Regular flow days when you need dependable everyday protection.' };
                        } else if (sz.id === 'heavy') {
                          cardMeta = { icon: '🌷', range: '12"–14" · 3 shapes', desc: 'Heavy flow days, longer wear, or extra confidence when you need it most.' };
                        } else if (sz.id === 'extra_long') {
                          cardMeta = { icon: '🌻', range: '15"–20" · 4 shapes', desc: 'Overnight use, postpartum recovery, or anyone who prefers extra coverage.' };
                        }

                        return (
                          <div
                            key={sz.id}
                            onClick={() => {
                              setSelectedNeedAbsorbency(sz.id);
                              const defaultLen = sz.id === 'liner' ? 6 : sz.id === 'light' ? 8 : sz.id === 'moderate' ? 10 : sz.id === 'heavy' ? 12 : 15;
                              setSelectedNeedLength(defaultLen);
                              const defaultShape = (sz.id === 'liner' || sz.id === 'light') ? 'moon_rise' : (sz.id === 'moderate' || sz.id === 'heavy') ? 'sunglow' : 'mega_pad';
                              setSelectedNeedShape(defaultShape);

                              // Pre-populate dictionary maps to ensure proper initialization
                              const defaultBackingVal = sz.id === 'liner' ? 'Printed Cotton' : sz.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece';
                              fabricsTop.forEach(f => {
                                setNeedQuantities(q => ({ ...q, [f.id]: q[f.id] || 0 }));
                                setSelectedNeedLengths(l => ({ ...l, [f.id]: l[f.id] || defaultLen }));
                                setSelectedNeedShapes(s => ({ ...s, [f.id]: s[f.id] || defaultShape }));
                                setSelectedNeedAbsorbencies(a => ({ ...a, [f.id]: a[f.id] || 'Standard core' }));
                                setSelectedNeedBackings(b => ({ ...b, [f.id]: b[f.id] || defaultBackingVal }));
                              });

                              setNeedStep(2);
                            }}
                            className={`rounded-2xl p-4.5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative ${
                              isSelected
                                ? 'bg-[#FDF6F8] border-[#8A5A87] shadow-sm'
                                : 'bg-white border-[#F3E2E5]/75 hover:border-[#8A5A87]/30 hover:bg-[#FAF9FB] shadow-3xs'
                            }`}
                          >
                            <div className="absolute top-4.5 right-4.5 flex items-center gap-2">
                              <span className="text-[10px] font-serif font-medium text-zinc-500">
                                from S${sz.priceBase.toFixed(2)}
                              </span>
                              <div className="w-5 h-5 flex items-center justify-center text-[#8A5A87] opacity-60">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>

                            <div className="space-y-1 max-w-[85%] text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg">{cardMeta.icon}</span>
                                <h3 className="font-serif font-black text-base text-brand-charcoal">
                                  {sz.name}
                                </h3>
                              </div>
                              <p className="text-[10px] font-normal text-zinc-400 tracking-wide font-sans">
                                {cardMeta.range}
                              </p>
                              <p className="text-xs text-zinc-500 leading-normal font-medium mt-0.5">
                                {cardMeta.desc || sz.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {needStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="text-left space-y-1 flex justify-between items-end">
                      <div>
                        <h4 id="need-step-2-header" className="scroll-mt-28 font-serif font-black text-base sm:text-lg text-brand-charcoal">
                          2. Browse Fabrics
                        </h4>
                        <p className="text-xs text-zinc-500 font-sans">
                          Browse our gorgeous cotton toppers. Selected: <span className="font-extrabold text-[#8A5A87]">{allowMultipleNeedPrints ? `${selectedNeedPrintIds.length} print(s)` : (selectedNeedFabric.name !== 'No Pattern Selected' && selectedNeedFabric.name ? selectedNeedFabric.name : 'None yet')}</span>.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setNeedStep(1)}
                        className="text-[10px] font-black text-[#8A5A87] hover:underline uppercase tracking-wider bg-[#8A5A87]/5 hover:bg-[#8A5A87]/10 px-3 py-1.5 rounded-full shrink-0"
                      >
                        ← Back
                      </button>
                    </div>

                    {/* Multiple Fabric Choice Toggle */}
                    <div className="max-w-xl mx-auto bg-[#FAF9FB] border border-[#FAF3FA] rounded-2xl p-4.5 flex items-start gap-3 mt-2 text-left select-none transition-all duration-200">
                      <label className="flex items-start gap-3 cursor-pointer w-full">
                        <div className="flex items-center h-5 mt-0.5">
                          <input
                            type="checkbox"
                            id="allow-multiple-need-fabrics"
                            checked={allowMultipleNeedPrints}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAllowMultipleNeedPrints(checked);
                              if (!checked) {
                                // Reset to just the first chosen print (or empty if none)
                                const currentFirst = selectedNeedPrintIds[0] || '';
                                if (currentFirst) {
                                  setSelectedNeedPrintIds([currentFirst]);
                                  const fabObj = fabricsTop.find(f => f.id === currentFirst) || NONE_FABRIC;
                                  setSelectedNeedFabric(fabObj);
                                } else {
                                  setSelectedNeedPrintIds([]);
                                }
                              }
                            }}
                            className="w-4.5 h-4.5 text-[#8A5A87] border-zinc-300 rounded focus:ring-[#8A5A87] focus:ring-2 cursor-pointer accent-[#8A5A87]"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-[#5A4E5D]">
                            I want to select multiple fabric patterns for this size
                          </p>
                          <p className="text-[10.5px] text-zinc-500 font-medium leading-normal">
                            Check this box if you want to select and customize multiple topper prints at the same time. If unchecked, clicking a print will immediately take you to customize it.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <input
                          type="text"
                          value={searchNeedFabric}
                          onChange={(e) => setSearchNeedFabric(e.target.value)}
                          placeholder="Search fabrics..."
                          className="w-full pl-9 pr-8 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8A5A87] bg-white shadow-3xs"
                        />
                        {searchNeedFabric && (
                          <button
                            type="button"
                            onClick={() => setSearchNeedFabric('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Categories filter pills */}
                      <div className="flex flex-wrap gap-1.5 pb-1 justify-center">
                        {['All', ...Array.from(new Set(fabricsTop.map(f => f.category || '').filter(Boolean)))].map((cat) => {
                          const isSel = selectedNeedFabricCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedNeedFabricCategory(cat)}
                              className={`px-3 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                isSel
                                  ? 'bg-[#8A5A87] text-white shadow-3xs font-black'
                                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Filter logic */}
                      {(() => {
                        const filtered = fabricsTop.filter((fab) => {
                          const matchesSearch = !searchNeedFabric || fab.name.toLowerCase().includes(searchNeedFabric.toLowerCase());
                          const matchesCat = selectedNeedFabricCategory === 'All' || fab.category === selectedNeedFabricCategory;
                          return matchesSearch && matchesCat;
                        });

                        return (
                          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-1 space-y-4">
                            {filtered.length === 0 ? (
                              <div className="text-center py-8 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                                <span className="text-xl">🎨</span>
                                <p className="text-xs font-bold text-zinc-700 mt-2">No matching fabrics found</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2">
                                {filtered.map((fab) => {
                                  const isSelected = allowMultipleNeedPrints
                                    ? selectedNeedPrintIds.includes(fab.id)
                                    : selectedNeedFabric.id === fab.id;
                                  return (
                                    <div
                                      key={fab.id}
                                      onClick={() => {
                                        if (allowMultipleNeedPrints) {
                                          toggleNeedPrint(fab.id);
                                        } else {
                                          setSelectedNeedFabric(fab);
                                          setSelectedNeedPrintIds([fab.id]);
                                          goToNeedStep3WithPrints([fab.id]);
                                        }
                                      }}
                                      className={`bg-white rounded-2xl border transition-all relative cursor-pointer flex flex-col justify-between overflow-hidden group select-none ${
                                        isSelected 
                                          ? 'border-[#8A5A87] ring-1.5 ring-[#8A5A87]/30 shadow-sm' 
                                          : 'border-zinc-200/80 hover:border-[#8A5A87]/40 shadow-sm hover:shadow-md'
                                      }`}
                                    >
                                      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 border-b border-zinc-100 flex flex-col items-center justify-center">
                                        {hideLookbookInBackOffice ? (
                                          <span className="text-xl">🎨</span>
                                        ) : (
                                          <img 
                                            src={getOptimizedImageUrl(fab.imageUrl, 'thumbnail')} 
                                            alt={fab.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        {isSelected && (
                                          <div className="absolute top-1 right-1 h-4 w-4 bg-[#8A5A87] text-white rounded-full flex items-center justify-center text-[8px] border border-white">
                                            ✓
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-1.5 text-center bg-white">
                                        <p className="text-[9px] font-bold text-zinc-700 truncate">{fab.name}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Navigation / Action button for multiple prints */}
                    {allowMultipleNeedPrints && selectedNeedPrintIds.length > 0 && (
                      <div className="pt-4 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn">
                        <button
                          type="button"
                          onClick={() => goToNeedStep3WithPrints(selectedNeedPrintIds)}
                          className="w-full sm:w-auto bg-[#8A5A87] hover:bg-[#724a70] text-white text-xs font-black py-3.5 px-8 rounded-xl uppercase tracking-widest shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Customize Selected Prints ({selectedNeedPrintIds.length}) 🎨</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {needStep === 3 && (
                  <div className="space-y-5 animate-fadeIn max-w-5xl mx-auto px-4 text-left">
                    {/* Header spans across both columns */}
                    <div className="space-y-0.5 text-left border-b border-zinc-100 pb-2">
                      <span className="text-[9px] font-black tracking-widest text-brand-taupe uppercase block">
                        Step 3 of 3
                      </span>
                      <h2 id="need-step-3-header" className="scroll-mt-28 font-serif font-black text-xl text-brand-charcoal tracking-tight leading-tight">
                        Configure Sizing & Core Options
                      </h2>
                      <p className="text-zinc-500 text-[11px] font-medium leading-normal">
                        Customize your chosen fabric print(s) below. Use the live 2D visualizer to see changes instantly.
                      </p>
                    </div>

                    {(() => {
                      const activePrintIdLocal = selectedNeedPrintIds.includes(activeNeedPrintId)
                        ? activeNeedPrintId
                        : (selectedNeedPrintIds[0] || '');

                      if (!activePrintIdLocal) {
                        return (
                          <div className="text-center py-12">
                            <p className="text-sm font-bold text-zinc-500">No fabric pattern selected yet. Please go back to Step 2 to choose at least one!</p>
                            <button
                              type="button"
                              onClick={() => setNeedStep(2)}
                              className="mt-4 px-6 py-2.5 bg-[#8A5A87] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                            >
                              Go to Step 2
                            </button>
                          </div>
                        );
                      }

                      const szObj = sizeOptions.find(s => s.id === selectedNeedAbsorbency) || sizeOptions[1] || SIZE_OPTIONS[1];
                      const printObj = fabricsTop.find(f => f.id === activePrintIdLocal) || NONE_FABRIC;

                      const lengthChamber = selectedNeedLengths[activePrintIdLocal] || szObj.lengthInches;
                      let localShapeId = selectedNeedShapes[activePrintIdLocal] || ((szObj.id === 'liner' || szObj.id === 'light') ? 'moon_rise' : (szObj.id === 'moderate' || szObj.id === 'heavy') ? 'sunglow' : 'mega_pad');
                      if (!isShapeAllowed(localShapeId, lengthChamber)) {
                        localShapeId = getFallbackShapeForLength(lengthChamber);
                      }

                      const localAbsorbencyName = selectedNeedAbsorbencies[activePrintIdLocal] || (szObj.id === 'liner' ? 'Standard core' : 'Standard core');
                      const localBackingName = selectedNeedBackings[activePrintIdLocal] || (szObj.id === 'liner' ? 'Printed Cotton' : szObj.id === 'light' ? 'White softshell fleece' : 'Black softshell fleece');

                      const backingInfo = getBespokeBackingInfo(szObj.id, localBackingName);
                      const absInfo = getBespokeAbsorbencyInfo(szObj.id, localAbsorbencyName);

                      const baseSizePrice = getBasePriceForSize(szObj.id, lengthChamber, szObj.priceBase);
                      const baseUnitPrice = baseSizePrice + absInfo.premium + backingInfo.premium;

                      const currentQty = needQuantities[activePrintIdLocal] || 0;

                      const isAddedInBasket = cart.some(
                        item => !item.isReadyMade && 
                                item.sizeName === szObj.name && 
                                item.lengthInches === lengthChamber && 
                                item.printName === printObj.name &&
                                item.absorbencyName === absInfo.name &&
                                item.backingName === backingInfo.name &&
                                item.shapeName === (SHAPE_OPTIONS.find(s => s.id === localShapeId)?.name || 'MoonRise')
                      );

                      const updateNeedSpecs = (updates: {
                        length?: number;
                        shape?: string;
                        absorbency?: string;
                        backing?: string;
                      }) => {
                        let finalLength = lengthChamber;
                        if (updates.length !== undefined) {
                          finalLength = updates.length;
                          setSelectedNeedLengths(prev => ({ ...prev, [activePrintIdLocal]: updates.length! }));
                        }
                        
                        let finalShape = selectedNeedShapes[activePrintIdLocal];
                        if (updates.shape !== undefined) {
                          finalShape = updates.shape;
                          setSelectedNeedShapes(prev => ({ ...prev, [activePrintIdLocal]: updates.shape! }));
                        } else if (updates.length !== undefined && finalShape !== undefined && !isShapeAllowed(finalShape, updates.length)) {
                          finalShape = getFallbackShapeForLength(updates.length);
                          setSelectedNeedShapes(prev => ({ ...prev, [activePrintIdLocal]: finalShape }));
                        }

                        let finalAbs = localAbsorbencyName;
                        if (updates.absorbency !== undefined) {
                          finalAbs = updates.absorbency;
                          setSelectedNeedAbsorbencies(prev => ({ ...prev, [activePrintIdLocal]: updates.absorbency! }));
                        }

                        let finalBacking = localBackingName;
                        if (updates.backing !== undefined) {
                          finalBacking = updates.backing;
                          setSelectedNeedBackings(prev => ({ ...prev, [activePrintIdLocal]: updates.backing! }));
                        }

                        // Sync with visualizer state
                        setDesignerSize({ ...szObj, lengthInches: finalLength });
                        if (finalShape) {
                          setDesignerShape(finalShape);
                        }
                        setDesignerAbsorbency(ABSORBENCY_OPTIONS.find(a => a.name === finalAbs) || ABSORBENCY_OPTIONS[0]);
                        setDesignerBacking(fabricsBacking.find(f => f.name === finalBacking) || fabricsBacking[0] || FABRICS_BACKING[0]);
                        setDesignerPrint(printObj);
                      };

                      const availableShapes = [
                        { id: 'moon_rise', name: 'MoonRise' },
                        { id: 'sunglow', name: 'SunGlow' },
                        { id: 'staple', name: 'Staple' },
                        { id: 'mega_pad', name: 'MegaPad' }
                      ].filter(sh => {
                        if (sh.id === 'mega_pad') return szObj.id === 'extra_long';
                        return true;
                      });

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start w-full">
                          {/* LEFT/MAIN COLUMN: Unified Designer Workstation Card */}
                          <div className="md:col-span-8 space-y-4">
                            {/* UNIFIED CUSTOMIZER PANEL */}
                            <div className="bg-white rounded-2xl border border-zinc-200/85 p-4 shadow-3xs text-left space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                
                                {/* 2D Live Visualizer & Specs Info Column */}
                                <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF9FB]/75 p-3 rounded-xl border border-[#FAF3FA]">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black tracking-widest text-[#8A5A87] uppercase select-none leading-none">
                                      Live 2D Preview
                                    </span>
                                    <span className="text-[7px] bg-white text-[#8A5A87] px-1.5 py-0.5 rounded border border-[#FAF3FA] font-black uppercase tracking-wider select-none leading-none">
                                      scale 1:2
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 items-center flex-1">
                                    {/* Canvas Box */}
                                    <div className="w-full h-36 rounded-xl border border-[#FAF3FA] bg-white flex items-center justify-center p-1 relative overflow-hidden shadow-3xs">
                                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-zinc-200/40 pointer-events-none" />
                                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-zinc-200/40 pointer-events-none" />

                                      {selectedNeedLengths[activePrintIdLocal] !== undefined || lengthChamber !== undefined ? (
                                        <PadShape 
                                          shapeId={
                                            localShapeId.toLowerCase().includes('moon') ? 'moon_rise' :
                                            localShapeId.toLowerCase().includes('sun') ? 'sunglow' :
                                            localShapeId.toLowerCase().includes('staple') ? 'staple' :
                                            localShapeId.toLowerCase().includes('mega') ? 'mega_pad' : 'moon_rise'
                                          } 
                                          lengthInches={lengthChamber} 
                                          fabricImageUrl={printObj.imageUrl || null} 
                                          backingColor={backingInfo.id === 'printed-cotton' ? '#EACBD2' : '#F1EBF2'} 
                                          showSnaps={true}
                                          fitCanvas={true}
                                          sizeId={szObj.id}
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-2 text-zinc-400 font-sans select-none relative z-10">
                                          <span className="text-lg mb-1 animate-pulse">🌸</span>
                                          <span className="text-[9px] font-black uppercase tracking-wider text-stone-500">Blank Canvas</span>
                                          <span className="text-[8px] text-zinc-400 mt-1 leading-tight">Select length & shape to view design</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Specs Details Box */}
                                    <div className="flex flex-col justify-between h-36 py-1 text-left text-zinc-600">
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-1 leading-none">
                                          <span className="font-extrabold text-[#8A5A87] uppercase text-[9px] tracking-wider select-none">
                                            ACTIVE PAD
                                          </span>
                                          {isAddedInBasket && (
                                            <span className="text-[8px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-mono font-black select-none leading-none">
                                              Active ✓
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="font-serif font-black text-brand-charcoal text-base leading-tight animate-fadeIn" key={szObj.id}>
                                          {szObj.name}
                                        </h4>
                                      </div>

                                      <div className="border-y border-zinc-100 py-1.5 my-1 flex-1 flex flex-col justify-center space-y-1">
                                        <div className="flex justify-between text-[9.5px] leading-none">
                                          <span className="text-zinc-400">Size</span>
                                          <span className="font-extrabold text-zinc-700">
                                            {lengthChamber}"
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-[9.5px] leading-none">
                                          <span className="text-zinc-400">Shape</span>
                                          <span className="font-extrabold text-zinc-700">
                                            {(SHAPE_OPTIONS.find(s => s.id === localShapeId)?.name || 'MoonRise').split(' - ')[0]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-[9.5px] leading-none truncate max-w-full">
                                          <span className="text-zinc-400">Print</span>
                                          <span className="font-extrabold text-zinc-700 truncate ml-1 max-w-[50px]">
                                            {printObj.name}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center leading-none pt-0.5">
                                        <span className="text-[8px] text-[#8A5A87] font-black uppercase tracking-wider">Unit Price</span>
                                        <span className="font-mono text-xs font-black text-[#8A5A87]">
                                          S${baseUnitPrice.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Configuration Selectors Column */}
                                <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                                  <div className="space-y-3">
                                    {/* Toggle active print if multiple selected */}
                                    {selectedNeedPrintIds.length > 1 && (
                                      <div className="flex flex-col space-y-1 pb-1.5 border-b border-zinc-100/50">
                                        <span className="text-[8.5px] font-black tracking-wider text-[#8A5A87] uppercase text-left select-none leading-none">
                                          Select Topper Print to Edit:
                                        </span>
                                        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50 gap-0.5 select-none w-full overflow-x-auto no-scrollbar">
                                          {selectedNeedPrintIds.map((id) => {
                                            const prObj = fabricsTop.find(f => f.id === id);
                                            if (!prObj) return null;
                                            const isActive = id === activePrintIdLocal;
                                            const isCompleted = cart.some(item => item.id.startsWith(`bespoke-need-${id}-`) || item.printName === prObj.name);
                                            return (
                                              <button
                                                key={id}
                                                type="button"
                                                onClick={() => selectActiveNeedPrintTab(id)}
                                                className={`flex-1 text-center py-1.5 px-3 rounded-md transition-all font-black text-[10px] leading-none whitespace-nowrap cursor-pointer ${
                                                  isActive
                                                    ? 'bg-[#8A5A87] text-white shadow-3xs'
                                                    : 'text-[#5A4E5D] hover:bg-zinc-200/55 hover:text-[#8A5A87]'
                                                }`}
                                              >
                                                {isCompleted && <span className="text-emerald-500 mr-1 select-none">✔️</span>}
                                                {prObj.name}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* 1. Length selector */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Length
                                      </span>
                                      <div className="flex items-center gap-4 flex-wrap">
                                        {Array.from({ length: szObj.maxLength - szObj.minLength + 1 }, (_, i) => szObj.minLength + i).map((inch) => {
                                          const isSelected = lengthChamber === inch;
                                          return (
                                            <button
                                              key={inch}
                                              type="button"
                                              onClick={() => updateNeedSpecs({ length: inch })}
                                              className="flex items-center gap-1 text-xs font-bold text-[#5A4E5D] hover:text-[#8A5A87] select-none transition-colors cursor-pointer"
                                            >
                                              <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
                                                isSelected ? 'border-[#8A5A87] bg-white ring-2 ring-[#8A5A87]/15' : 'border-zinc-300 bg-white'
                                              }`}>
                                                {isSelected && <span className="w-1 h-1 rounded-full bg-[#8A5A87]" />}
                                              </span>
                                              <span className="leading-none">{inch}"</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* 2. Shape Selector */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Shape
                                      </span>
                                      <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50 gap-0.5 select-none text-[10px] font-bold">
                                        {availableShapes.map((sh) => {
                                          const isAllowed = isShapeAllowed(sh.id, lengthChamber);
                                          const isSelected = localShapeId === sh.id && isAllowed;
                                          return (
                                            <button
                                              key={sh.id}
                                              type="button"
                                              disabled={!isAllowed}
                                              onClick={() => {
                                                if (!isAllowed) return;
                                                updateNeedSpecs({ shape: sh.id });
                                              }}
                                              className={`px-2.5 py-1 rounded-md transition-all font-black shrink-0 flex items-center justify-center leading-none ${
                                                !isAllowed
                                                  ? 'text-zinc-300 cursor-not-allowed opacity-40'
                                                  : isSelected
                                                  ? 'bg-[#7D8F7D] text-white shadow-3xs cursor-pointer active:scale-95'
                                                  : 'text-[#5A4E5D] hover:text-[#7D8F7D] hover:bg-zinc-200/55 cursor-pointer'
                                              }`}
                                            >
                                              <span>{sh.name}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* 3. Core Selection Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2 border-b border-zinc-100/50">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Core
                                      </span>
                                      {szObj.id === 'liner' ? (
                                        <select
                                          value={localAbsorbencyName}
                                          onChange={(e) => updateNeedSpecs({ absorbency: e.target.value })}
                                          className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                                        >
                                          {LINER_ABSORBENCY_OPTIONS.map((a) => (
                                            <option key={a.id} value={a.name}>
                                              {a.name}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-transparent px-2.5 py-1 select-none leading-none rounded-lg">
                                          Standard core
                                        </span>
                                      )}
                                    </div>

                                    {/* 4. Backing Selection Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-2">
                                      <span className="text-[9.5px] font-black tracking-wider text-[#8A5A87] uppercase w-14 shrink-0 text-left select-none">
                                        Backing
                                      </span>
                                      {szObj.id === 'liner' ? (
                                        <select
                                          value={localBackingName}
                                          onChange={(e) => updateNeedSpecs({ backing: e.target.value })}
                                          className="text-[11px] font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#8A5A87] focus:outline-none cursor-pointer"
                                        >
                                          {LINER_BACKING_OPTIONS.filter(b => b.id !== 'organic-cotton').map((b) => (
                                            <option key={b.id} value={b.name}>
                                              {b.name}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-50 border border-transparent px-2.5 py-1 select-none leading-none rounded-lg">
                                          {szObj.id === 'light' ? 'White softshell' : 'Black softshell'} fleece
                                        </span>
                                      )}
                                    </div>

                                    {szObj.id === 'liner' && (
                                      <p className="text-[9px] text-zinc-400 italic font-medium leading-none mt-1">
                                        * Choose additional core/different backer from above
                                      </p>
                                    )}
                                  </div>

                                  {/* 4. Actions: Qty and Add to Order */}
                                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9.5px] font-black text-zinc-400 uppercase leading-none">Qty:</span>
                                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 shadow-3xs">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentVal = needQuantities[activePrintIdLocal] || 0;
                                            if (currentVal > 1) {
                                              setNeedQuantities(prev => ({ ...prev, [activePrintIdLocal]: currentVal - 1 }));
                                            }
                                          }}
                                          className="w-5 h-5 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer"
                                        >
                                          -
                                        </button>
                                        <span className="w-6 text-center font-mono font-extrabold text-xs text-zinc-800">
                                          {currentQty || 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentVal = needQuantities[activePrintIdLocal] || 0;
                                            setNeedQuantities(prev => ({ ...prev, [activePrintIdLocal]: Math.max(1, currentVal) + 1 }));
                                          }}
                                          className="w-5 h-5 flex items-center justify-center hover:bg-zinc-200 text-zinc-800 rounded font-black text-xs transition-colors cursor-pointer"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if ((needQuantities[activePrintIdLocal] || 0) <= 0) {
                                          setNeedQuantities(prev => ({ ...prev, [activePrintIdLocal]: 1 }));
                                        }
                                        setTimeout(() => {
                                          handleAddNeedOptionToBasket(activePrintIdLocal);
                                        }, 50);
                                      }}
                                      className="px-3.5 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 bg-[#8A5A87] hover:bg-[#724a70] text-white shadow-xs cursor-pointer active:scale-95"
                                    >
                                      <ShoppingCart className="h-3.5 w-3.5" />
                                      <span>Add to Order</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>

                            {/* Back Button underneath Customizer panel */}
                            <div className="pt-1 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setNeedStep(2);
                                }}
                                className="bg-white hover:bg-zinc-50 text-zinc-500 text-[10px] font-black py-2 px-5 rounded-full uppercase tracking-wider shadow-3xs border border-zinc-200 transition-all duration-200 hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>← Back to Print Choices</span>
                              </button>
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Checkout Action Bar */}
                          <div className="md:col-span-4 space-y-4 md:sticky md:top-4">
                            {/* NAVIGATION AND CHECKOUT ACTION BAR */}
                            <div className="bg-[#FAFDFB] rounded-2xl p-3.5 border border-[#CBE5D2] space-y-3.5 text-left shadow-3xs">
                              <div className="flex justify-between items-center text-xs font-black text-brand-charcoal">
                                <span>Subtotal:</span>
                                <span className="text-[#922B50] text-sm font-black font-mono">
                                  S${cart.filter(item => !item.isReadyMade).reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (cart.filter(item => !item.isReadyMade).length === 0) {
                                      showToast("Please add at least one customized pad configuration to your order first!", "info");
                                      return;
                                    }
                                    setIsCheckoutPage(true);
                                    if (containerRef.current) {
                                      containerRef.current.scrollTop = 0;
                                    }
                                    window.scrollTo(0, 0);
                                  }}
                                  disabled={cart.filter(item => !item.isReadyMade).length === 0}
                                  className={`text-[10px] font-black py-3 px-4 rounded-full uppercase tracking-wider shadow-sm transition-all duration-200 hover:scale-101 flex items-center justify-center gap-1.5 ${
                                    cart.filter(item => !item.isReadyMade).length > 0
                                      ? 'bg-[#8a3c2b] hover:bg-[#743224] text-white cursor-pointer'
                                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                                  }`}
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  <span>Proceed to Checkout</span>
                                  <span>→</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Bottom Navigation for Size-First Flow */}
                <div className="pt-8 pb-4 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn border-t border-zinc-100/60 mt-8 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOptionTab(null);
                      setCustomFlow(null);
                      if (containerRef.current) {
                        containerRef.current.scrollTop = 0;
                      }
                      window.scrollTo(0, 0);
                      if (document.body) document.body.scrollTop = 0;
                      if (document.documentElement) document.documentElement.scrollTop = 0;
                    }}
                    className="w-full sm:w-auto bg-brand-cream/70 hover:bg-brand-cream text-brand-taupe text-xs font-black py-3.5 px-6 rounded-full uppercase tracking-widest shadow-3xs border border-zinc-200/60 transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🎨</span>
                    <span>Back to Studio</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: CLIENT SHOP CONTAINER BASKET REVIEW & LODGING   */}
          {/* ======================================================== */}
          {shouldShowCheckout && (
            <div id="step-5" className="scroll-mt-28 space-y-4">
            <div className="space-y-4 animate-scaleIn">
              <div className="border-b border-zinc-150 pb-2.5 flex justify-between items-center">
                <h3 className="text-sm font-black font-serif text-zinc-900 uppercase">
                  Custom Order Summary
                </h3>
                <span className="text-[10px] font-black text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full font-mono uppercase">
                  {totalCartCount} Pads Selected
                </span>
              </div>

              {!inquiryResult ? (
                cart.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-rose-100/50 rounded-3xl text-center space-y-4 bg-white shadow-3xs">
                    <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-lg">
                      👜
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">Your Basket is Empty</h4>
                      <p className="text-[10.5px] text-zinc-450 max-w-xs mx-auto leading-relaxed">
                        Customize organic pads or select ready stock series packs above to populate your order.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setInquiryResult(null);
                        setIsCheckoutPage(false);
                        setSelectedOptionTab(null);
                      }}
                      className="bg-brand-moss text-white py-2.5 px-4.5 rounded-xl text-xs font-bold shadow-xs hover:bg-brand-moss/90 transition-colors cursor-pointer"
                    >
                      Bespoke Customizer Portals
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {/* Basket items list */}
                    <div className="bg-white rounded-2xl border border-rose-100/30 p-4 space-y-3.5 shadow-3xs">
                      <div className="flex justify-between items-center text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-50">
                        <span>YOUR ORDER</span>
                        {isConfirmingClearCart ? (
                          <div className="flex items-center gap-1.5 text-[9.5px]">
                            <span className="text-zinc-550 font-bold">Clear basket?</span>
                            <button 
                              onClick={handleClearBasket}
                              className="text-rose-600 font-extrabold hover:underline cursor-pointer"
                            >
                              Yes
                            </button>
                            <span className="text-zinc-300">/</span>
                            <button 
                              onClick={() => setIsConfirmingClearCart(false)}
                              className="text-zinc-500 hover:underline cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setIsConfirmingClearCart(true)}
                            className="text-rose-600 hover:underline hover:text-rose-700 cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {cart.map((item) => (
                          <div key={item.id} className="py-3 flex justify-between items-center gap-3 text-xs text-left">
                            {/* Left side: Thumbnail preview */}
                            <div className="flex-none w-12 h-16 bg-brand-pink-light/35 rounded-lg border border-brand-pink/20 flex items-center justify-center overflow-hidden shrink-0 select-none">
                              {item.isReadyMade ? (
                                item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.sizeName} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="text-lg">📦</span>
                                )
                              ) : (
                                <div className="scale-50 origin-center flex items-center justify-center">
                                  <PadShape 
                                    shapeId={
                                      item.shapeName.toLowerCase().includes('moon') ? 'moon_rise' :
                                      item.shapeName.toLowerCase().includes('sun') ? 'sunglow' :
                                      item.shapeName.toLowerCase().includes('staple') ? 'staple' :
                                      item.shapeName.toLowerCase().includes('mega') ? 'mega_pad' : 'moon_rise'
                                    } 
                                    lengthInches={item.lengthInches} 
                                    fabricImageUrl={item.imageUrl} 
                                    width={50} 
                                    showSnaps={false}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Middle: Pad size and exact details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="font-extrabold text-zinc-850 uppercase text-[11px] block leading-tight">
                                {item.sizeName} ({item.lengthInches}") {item.isReadyMade && <span className="ml-1 text-[7px] bg-amber-50 text-amber-800 px-1 py-0.2 rounded uppercase font-mono font-extrabold inline-block">Ready Series</span>}
                              </span>
                              
                              <div className="text-[10px] text-zinc-500 space-y-0.5 leading-normal">
                                <p>
                                  <span className="text-zinc-400 font-semibold">Print:</span> {item.printName}
                                </p>
                                <p>
                                  <span className="text-zinc-400 font-semibold">Shape:</span> {item.shapeName}
                                </p>
                                {item.sizeName.toLowerCase().includes('liner') && (
                                  <p className="text-[9px] text-zinc-400 italic">
                                    Backing: {item.backingName} • Core: {item.absorbencyName}
                                  </p>
                                )}
                                <p className="text-[9.5px] text-zinc-600 font-bold uppercase tracking-wider pt-0.5">
                                  Qty: <span className="text-zinc-850 font-mono font-extrabold text-[10.5px]">{item.quantity}</span>
                                </p>
                              </div>
                            </div>

                            {/* Right side: Subtotal & Adjustments */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {/* Subtotal & trash-can row */}
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold font-mono text-zinc-800 text-[11.5px]">
                                  S${item.totalPrice.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleRemoveBasketItem(item.id)}
                                  className="text-zinc-400 hover:text-rose-600 transition-colors p-1 -mr-1 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* - / + adjusters placed directly under the subtotal/dustbin row */}
                              <div className="flex items-center bg-zinc-50 rounded-lg p-0.5 border border-zinc-200/60 text-[11px] font-extrabold shadow-3xs">
                                <button
                                  onClick={() => handleModifyBasketQuantity(item.id, -1)}
                                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-200 text-brand-moss active:scale-90 transition-all cursor-pointer font-bold"
                                >
                                  -
                                </button>
                                <span className="px-2 font-mono text-zinc-850 text-xs">{item.quantity}</span>
                                <button
                                  onClick={() => handleModifyBasketQuantity(item.id, 1)}
                                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-200 text-brand-moss active:scale-90 transition-all cursor-pointer font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3.5 border-t border-zinc-100 flex justify-between items-center text-xs">
                        <span className="font-black text-zinc-500 uppercase">Estimated Order Cost:</span>
                        <span className="font-black text-sm text-brand-moss font-mono">
                          S${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2.5 text-left text-[11px] text-zinc-650 font-medium leading-relaxed bg-[#fdfdfc] rounded-2xl p-4 border border-zinc-200/80 space-y-2.5 shadow-3xs">
                        <p className="font-black text-[11.5px] text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                          ✨ Next Steps after sending your order:
                        </p>
                        <ul className="space-y-2 leading-relaxed text-zinc-650">
                          <li className="flex items-start gap-1.5">
                            <span className="text-brand-moss mt-0.5">•</span>
                            <span><strong className="font-bold text-zinc-850">Review:</strong> I will personally check your custom choices and confirm them with you.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-brand-moss mt-0.5">•</span>
                            <span><strong className="font-bold text-zinc-850">Payment:</strong> <mark className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-black decoration-none">PayNow/PayLah</mark> details will be provided upon order confirmation.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-brand-moss mt-0.5">•</span>
                            <span><strong className="font-bold text-zinc-850">Timeline:</strong> Your handmade pads will be ready in approximately <mark className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-black decoration-none">3–4 weeks</mark>.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-brand-moss mt-0.5">•</span>
                            <span><strong className="font-bold text-zinc-850">Communication:</strong> Look out for a message from me on WhatsApp or Email!</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Dispatch courier address sheet form */}
                    <form onSubmit={(e) => e.preventDefault()} className="bg-gradient-to-br from-[#FFFDFE] via-[#FFFBFD] to-[#FFF8FB] rounded-3xl border-2 border-brand-pink p-5 space-y-3.5 shadow-sm">
                      {selectedOptionTab === 'ready' && (
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-150/60 text-left">
                          <p className="font-sans text-[11px] sm:text-[12px] text-emerald-850 font-semibold leading-relaxed">
                            Ready Stock orders are subject to availability. I'll confirm your items and send payment details via WhatsApp before packing begins.
                          </p>
                        </div>
                      )}

                      <span className="text-[10px] font-black tracking-wider text-brand-moss uppercase block">
                        LET’S GET YOUR ORDER READY 🌸
                      </span>

                      <div className="space-y-3.5 font-sans">
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-0.5">
                            <label className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block text-ellipsis overflow-hidden whitespace-nowrap">YOUR NAME *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Jane Doe"
                              value={inquiryName}
                              onChange={(e) => setInquiryName(e.target.value)}
                              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-base md:text-xs font-semibold focus:border-rose-200 focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block text-ellipsis overflow-hidden whitespace-nowrap">PHONE (ACTIVE) *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. +65 9123 4567 or international"
                              value={inquiryPhone}
                              onChange={(e) => {
                                let val = e.target.value;
                                // Auto-prepend +65 if they enter 8 digit SG number directly
                                if (/^[8936]\d{7}$/.test(val)) {
                                  val = `+65 ${val}`;
                                }
                                setInquiryPhone(val);
                              }}
                              onBlur={() => {
                                let val = inquiryPhone.trim();
                                if (/^[8936]\d{7}$/.test(val)) {
                                  setInquiryPhone(`+65 ${val}`);
                                }
                              }}
                              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-base md:text-xs font-semibold focus:border-rose-200 focus:outline-hidden"
                            />
                            <p className="text-[8.5px] text-zinc-400 font-medium">International numbers are welcome (e.g. +60 for Malaysia)</p>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block">EMAIL ADDRESS *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="e.g. you@example.com"
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-base md:text-xs font-semibold focus:border-rose-200 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block">DELIVERY / TAILORING NOTES (OPTIONAL)</label>
                          <textarea 
                            rows={3}
                            placeholder="E.g., Please make backing matching soft shell or custom snaps..."
                            value={inquiryComments}
                            onChange={(e) => setInquiryComments(e.target.value)}
                            className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-base md:text-xs font-semibold focus:border-rose-200 resize-none focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSendVia('whatsapp')}
                          disabled={isSubmittingInquiry}
                          className="py-3 bg-[#00a884] hover:bg-[#008f72] text-white text-[11px] font-bold rounded-xl tracking-wider uppercase flex justify-center items-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 fill-white text-[#00a884]" />
                          <span>Send via WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendVia('email')}
                          disabled={isSubmittingInquiry}
                          className="py-3 bg-[#738a7c] hover:bg-[#62776a] text-white text-[11px] font-bold rounded-xl tracking-wider uppercase flex justify-center items-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <Mail className="h-4 w-4 text-white" />
                          <span>Send via Email</span>
                        </button>
                      </div>

                    </form>

                    <div className="bg-rose-50/20 rounded-2xl border border-rose-150/50 p-4 text-center">
                      <p className="text-[10px] font-black uppercase text-brand-moss tracking-wider leading-relaxed font-sans">
                        THANK YOU FOR DESIGNING YOUR CUSTOM PADS WITH WONDER PADS REUSABLES! I can’t wait to start stitching your custom order for you!
                      </p>
                    </div>

                    {/* Back to Design Studio navigation at the bottom of Checkout */}
                    <div className="pt-6 border-t border-zinc-150/50 flex justify-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setInquiryResult(null);
                          setIsCheckoutPage(false);
                          if (containerRef.current) {
                            containerRef.current.scrollTop = 0;
                          }
                          window.scrollTo(0, 0);
                        }}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-taupe hover:text-[#922B50] transition-colors cursor-pointer bg-brand-cream/60 hover:bg-brand-cream/90 px-5 py-2.5 rounded-full border border-zinc-200/60 shadow-3xs hover:scale-102 active:scale-98 transition-all"
                      >
                        <span>←</span>
                        <span>Back to Design Studio</span>
                      </button>
                    </div>

                  </div>
                )
              ) : (
                /* INQUIRY SUCCESS RECEIPT BILLBOARD CARD */
                <div className="bg-[#f2f6f3] border border-emerald-100 rounded-3xl p-5 text-center space-y-4 animate-scaleIn select-text font-sans">
                  <div className="h-10 w-10 bg-brand-moss text-white rounded-full flex items-center justify-center text-lg mx-auto shadow-sm">
                    ✓
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black font-serif text-brand-moss leading-snug">Your order is on its way to Nilam! 🌸</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                      Thank you for designing your pads with Wonder Pads Reusables! I'll review your order carefully and get back to you with payment details and confirmation before I begin stitching.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-200 p-4 text-left space-y-2.5 font-mono text-[10px] text-zinc-700">
                    <div className="flex justify-between border-b pb-1.5 font-bold">
                      <span className="text-zinc-400">Order Reference:</span>
                      <span className="text-brand-moss">{inquiryResult.inquiryNumber}</span>
                    </div>

                    <div className="space-y-0.5">
                      <p><span className="text-zinc-400 font-bold">RECIPIENT:</span> {inquiryResult.name}</p>
                      <p><span className="text-zinc-400 font-bold">Delivery:</span> Singapore delivery or self-collection</p>
                      <p><span className="text-zinc-400 font-bold">Order placed:</span> {inquiryResult.date}</p>
                    </div>

                    <div className="border-t pt-2 font-bold text-zinc-400 uppercase tracking-wider text-[9px]">
                      Your order summary
                    </div>
                    <div className="border-b py-1.5 divide-y divide-zinc-50 max-h-[140px] overflow-y-auto">
                      {inquiryResult.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-[9.5px] py-1.5 gap-2">
                          <div className="flex items-center gap-2">
                            {it.imageUrl && (
                              hideLookbookInBackOffice ? (
                                <div className="w-8 h-8 rounded-md border border-zinc-200 flex items-center justify-center bg-[#fdfbf7] text-xs flex-none select-none">
                                  {it.isReadyMade ? '📦' : '🎨'}
                                </div>
                              ) : (
                                <img 
                                  src={getOptimizedImageUrl(it.imageUrl, 'thumbnail')} 
                                  alt={it.printName} 
                                  className="w-8 h-8 object-cover rounded-md border border-zinc-200 flex-none bg-stone-50"
                                  referrerPolicy="no-referrer"
                                />
                              )
                            )}
                            <span>{it.quantity}x {it.sizeName} ({it.printName})</span>
                          </div>
                          <span className="font-bold">S${it.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-black text-zinc-900 text-xs pt-1">
                      <span>ESTIMATED TOTAL:</span>
                      <span>S${inquiryResult.estimatedTotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-2.5 text-left text-[11px] text-zinc-650 font-medium leading-relaxed bg-[#fdfdfc] rounded-2xl p-4 border border-zinc-200/80 space-y-2.5 shadow-3xs">
                      <p className="font-black text-[11.5px] text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                        ✨ Next Steps after sending your order:
                      </p>
                      <ul className="space-y-2 leading-relaxed text-zinc-650">
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-moss mt-0.5">•</span>
                          <span><strong className="font-bold text-zinc-850">Review:</strong> I will personally check your custom choices and confirm them with you.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-moss mt-0.5">•</span>
                          <span><strong className="font-bold text-zinc-850">Payment:</strong> <mark className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-black decoration-none">PayNow/PayLah</mark> details will be provided upon order confirmation.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-moss mt-0.5">•</span>
                          <span><strong className="font-bold text-zinc-850">Timeline:</strong> Your handmade pads will be ready in approximately <mark className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-black decoration-none">3–4 weeks</mark>.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-moss mt-0.5">•</span>
                          <span><strong className="font-bold text-zinc-850">Communication:</strong> Look out for a message from me on WhatsApp or Email!</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryResult(null);
                        setIsCheckoutPage(false);
                        setSelectedOptionTab(null);
                        if (containerRef.current) {
                          containerRef.current.scrollTop = 0;
                        }
                        window.scrollTo(0, 0);
                      }}
                      className="bg-brand-moss text-[#FFF5F7] py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest shadow-md hover:bg-brand-moss/90 transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      Return to Design Studio Home
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
          )}
          </>
          )}

          {/* BEAUTIFUL DESIGNER BRAND FOOTER & SOCIAL LINKS */}
          <footer className="mt-8 pt-10 pb-8 px-6 bg-brand-pink-light/60 border-t border-brand-pink/35 rounded-t-[32px] -mx-4 sm:-mx-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-left">
              {/* Brand blurb column */}
              <div className="space-y-2.5">
                <h4 className="font-serif text-base font-black tracking-wide text-brand-moss">
                  WonderPads
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-[220px]">
                  Handcrafted reusable cloth pads, made with love in Singapore. Each pad is individually sewn to order.
                </p>
              </div>

              {/* Learn column */}
              <div className="space-y-2.5">
                <h5 className="font-serif text-xs font-black uppercase tracking-widest text-brand-charcoal/70">Learn</h5>
                <div className="flex flex-col gap-1.5 text-[12px] font-bold text-brand-moss/85 font-sans">
                  <button type="button" onClick={() => navigateTo('/why-cloth-pads')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Why Cloth Pads
                  </button>
                  <button type="button" onClick={() => navigateTo('/benefits')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Benefits
                  </button>
                  <button type="button" onClick={() => setShowCareModal(true)} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Care Guide
                  </button>
                  <button type="button" onClick={() => navigateTo('/blog')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Blog
                  </button>
                </div>
              </div>

              {/* Shop column */}
              <div className="space-y-2.5">
                <h5 className="font-serif text-xs font-black uppercase tracking-widest text-brand-charcoal/70">Shop</h5>
                <div className="flex flex-col gap-1.5 text-[12px] font-bold text-brand-moss/85 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOptionTab(null);
                      setIsRtsPage(false);
                      setLandingSubView('make_your_pad');
                      navigateTo('/');
                    }}
                    className="hover:text-[#8C2346] transition-colors cursor-pointer text-left"
                  >
                    Custom Studio
                  </button>
                  <button type="button" onClick={() => navigateTo('/sizing-guide')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Sizing &amp; Pricing
                  </button>
                  <button type="button" onClick={() => navigateTo('/faq')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    FAQ
                  </button>
                  <button type="button" onClick={() => navigateTo('/contact')} className="hover:text-[#8C2346] transition-colors cursor-pointer text-left">
                    Contact
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto border-t border-brand-pink/30 mt-8 pt-6 flex flex-col items-center gap-4 text-center">
              {/* Centered Green WhatsApp Tab */}
              <a
                href={`https://wa.me/${(() => {
                  const destPhone = merchantPhone.trim() || '6583397556';
                  let numericOnly = destPhone.replace(/\D/g, '');
                  if (numericOnly.length === 8 && (numericOnly.startsWith('8') || numericOnly.startsWith('9') || numericOnly.startsWith('6'))) {
                    numericOnly = '65' + numericOnly;
                  } else if (!numericOnly.startsWith('65') && numericOnly.length === 8) {
                    numericOnly = '65' + numericOnly;
                  }
                  return numericOnly || "6583397556";
                })()}?text=${encodeURIComponent("Hello! I am browsing WonderPads and have a question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase font-sans tracking-wider shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
                style={{ height: '25px' }}
              >
                <MessageCircle className="h-4 w-4 text-white shrink-0 fill-white/10" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Social Links Badge Buttons */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://instagram.com/ecoclothpad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white border border-zinc-200 text-zinc-650 hover:text-rose-600 hover:border-rose-150 flex items-center justify-center transition-all duration-300 shadow-4xs hover:scale-105 active:scale-95 cursor-pointer"
                  title="Follow Wonder Pads on Instagram"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://facebook.com/ecoclothpad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white border border-zinc-200 text-zinc-650 hover:text-blue-600 hover:border-blue-150 flex items-center justify-center transition-all duration-300 shadow-4xs hover:scale-105 active:scale-95 cursor-pointer"
                  title="Follow Wonder Pads on Facebook"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://tiktok.com/@ecoclothpad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white border border-zinc-200 text-zinc-650 hover:text-black hover:border-zinc-400 flex items-center justify-center transition-all duration-300 shadow-4xs hover:scale-105 active:scale-95 cursor-pointer"
                  title="Follow Wonder Pads on TikTok"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.77-.56-1.44-1.27-1.93-2.11v7.28c0 1.38-.35 2.78-1.13 3.91-.78 1.13-1.93 1.95-3.23 2.33-1.3.38-2.73.33-3.99-.14-1.26-.47-2.35-1.39-3.04-2.55s-.96-2.58-.78-3.93c.18-1.35.84-2.61 1.87-3.5 1.03-.89 2.4-1.37 3.76-1.35.34.01.68.05 1.02.12v4.03c-.34-.1-.71-.14-1.07-.13-.76-.02-1.53.25-2.11.75-.58.5-.94 1.21-1 1.97-.06.76.18 1.54.67 2.13s1.21.94 1.97 1c.76.06 1.54-.18 2.13-.67.59-.49.95-1.21 1.01-1.97.04-.37.04-4.88.04-8.54V0C12.53.01 12.53.01 12.53.02z" />
                  </svg>
                </a>
              </div>

              <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-none">
                © {new Date().getFullYear()} WonderPads. All rights reserved.
              </div>
            </div>
          </footer>

        </main>

        {/* WHATSAPP FLOATING CHAT BUTTON REMOVED (PLACED INLINE INSTEAD) */}



        {/* ======================================================== */}
        {/* SORELLA LIVE LOOKBOOK PHOTO LIGHTBOX OVERLAY             */}
        {/* ======================================================== */}
        {selectedPhoto && (
          <div 
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-lg z-50 flex flex-col justify-center items-center p-4 animate-fadeIn select-none"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Absolute close button */}
            <button 
              type="button"
              className="absolute top-6 right-6 h-9 w-9 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full flex items-center justify-center transition-all z-50 cursor-pointer"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Main Lightbox Frame */}
            <div 
              className="w-full max-w-sm flex flex-col justify-center items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900 flex items-center justify-center">
                <img 
                  src={getOptimizedImageUrl(selectedPhoto.secure_url, 'detail')} 
                  alt={selectedPhoto.filename}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info under photo */}
              <div className="text-center space-y-1">
                <h4 className="text-xs font-black text-white tracking-widest uppercase font-serif">
                  {selectedPhoto.filename}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Wonder Workshop Asset • {new Date(selectedPhoto.created_at).toLocaleDateString()}
                </p>
                {selectedPhoto.width && selectedPhoto.height && (
                  <p className="text-[9px] text-zinc-500 font-mono">
                    {selectedPhoto.width} × {selectedPhoto.height} px
                  </p>
                )}
              </div>

              {/* Button to close */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="bg-white text-zinc-950 text-[10px] font-black tracking-widest uppercase px-6 py-2.5 rounded-full shadow-md hover:bg-zinc-100 transition-all active:scale-97 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FABRIC PATTERN ZOOM LIGHTBOX OVERLAY                     */}
        {/* ======================================================== */}
        {zoomedFabric && (
          <div 
            className="fixed inset-0 bg-zinc-950/90 backdrop-blur-lg z-50 flex flex-col justify-center items-center p-4 animate-fadeIn select-none"
            onClick={() => setZoomedFabric(null)}
          >
            {/* Absolute close button */}
            <button 
              type="button"
              className="absolute top-6 right-6 h-9 w-9 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full flex items-center justify-center transition-all z-50 cursor-pointer"
              onClick={() => setZoomedFabric(null)}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Main Lightbox Frame */}
            <div 
              className="w-full max-w-sm flex flex-col justify-center items-center gap-4 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900 flex items-center justify-center group/zoom">
                <img 
                  src={getOptimizedImageUrl(zoomedFabric.imageUrl, 'detail')} 
                  alt={zoomedFabric.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-135 cursor-zoom-in"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white/80 text-[8.5px] px-2 py-1 rounded-md pointer-events-none opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300">
                  Hover to zoom closer 🔍
                </div>
              </div>

              {/* Info under photo */}
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h4 className="text-sm font-black text-white tracking-widest uppercase font-serif">
                    {zoomedFabric.name}
                  </h4>
                  <span className={`h-2 w-2 rounded-full ${
                    zoomedFabric.stockStatus === 'out_of_stock'
                      ? 'bg-rose-500'
                      : zoomedFabric.stockStatus === 'low_stock'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                  }`} />
                </div>
                <p className="text-[11px] text-zinc-400 font-sans tracking-wide">
                  Fabric Pattern • {zoomedFabric.material || 'Premium Woven Cotton'}
                </p>
                {zoomedFabric.stockStatus === 'low_stock' && (
                  <span className="inline-block bg-[#E57373]/20 text-[#FF8A80] text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full mt-1">
                    LOW STOCK - ACT FAST!
                  </span>
                )}
              </div>

              {/* Button controls */}
              <div className="flex gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setZoomedFabric(null)}
                  className="flex-1 bg-white/10 text-white border border-white/10 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-full shadow-md hover:bg-white/20 transition-all active:scale-97 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isSelected = designerPrint.id === zoomedFabric.id;
                    if (isSelected) {
                      setDesignerPrint(NONE_FABRIC);
                      setSelectedPrints(prev => ({
                        ...prev,
                        liner: 'No Pattern Selected',
                        light: 'No Pattern Selected',
                        moderate: 'No Pattern Selected',
                        heavy: 'No Pattern Selected',
                        extra_long: 'No Pattern Selected'
                      }));
                      setExpandedBespokeCardId(null);
                    } else {
                      setDesignerPrint(zoomedFabric);
                      setSelectedPrints(prev => ({
                        ...prev,
                        liner: zoomedFabric.name,
                        light: zoomedFabric.name,
                        moderate: zoomedFabric.name,
                        heavy: zoomedFabric.name,
                        extra_long: zoomedFabric.name
                      }));
                      setExpandedBespokeCardId(null);
                      setTimeout(() => {
                        scrollToStep(3);
                      }, 350);
                    }
                    setZoomedFabric(null);
                  }}
                  className="flex-1 bg-[#7D8F7D] text-white text-[10px] font-black tracking-widest uppercase py-2.5 rounded-full shadow-md hover:bg-[#6C7E6C] transition-all active:scale-97 cursor-pointer"
                >
                  {designerPrint.id === zoomedFabric.id ? 'Deselect' : 'Choose Pattern'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL WINDOW MANUAL CARE GUIDELINE                        */}
        {/* ======================================================== */}
        {showCareModal && (
          <div 
            className="fixed inset-0 bg-[#FCF8F5] z-[9995] flex flex-col overflow-y-auto custom-scrollbar select-text animate-fadeIn text-left"
            onClick={() => setShowCareModal(false)}
          >
            {/* Main Wrapper */}
            <div 
              className="w-full flex-1 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bright Yellow Banner */}
              <div className="bg-[#FFEFA6]/85 border-b border-[#FBE08E]/50 px-6 py-12 sm:py-16 text-center relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowCareModal(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-brand-charcoal flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer"
                  title="Close Guide"
                >
                  ✕
                </button>

                <div className="max-w-2xl mx-auto space-y-3.5">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#8C6D3B] font-sans">
                    Care Instructions
                  </span>
                  <h3 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#1C1D1F] leading-tight">
                    Cloth Pad Care Guide
                  </h3>
                  <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
                    With a little care, your Wonder Pads will last for years. Here is everything you need to know.
                  </p>
                </div>
              </div>

              {/* Guidelines Steps list */}
              <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
                
                {/* Step 1 */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-150/65 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#FFEFA6] text-[#7F611E] flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                      Rinse immediately
                    </h4>
                    <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-medium">
                      After use, rinse your pad in cold water. Cold water prevents staining and makes washing easier. Avoid hot water at this stage as it can set stains.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-150/65 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#FFEFA6] text-[#7F611E] flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                      Soak if needed
                    </h4>
                    <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-medium">
                      For heavier pads, a 30-minute cold water soak before washing can help. You can add a small amount of white vinegar to the soak water.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-150/65 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#FFEFA6] text-[#7F611E] flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                      Machine wash
                    </h4>
                    <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-medium">
                      Wash on a gentle cycle at 30–40°C with a mild, fragrance-free detergent. Avoid fabric softeners as they reduce absorbency over time.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-150/65 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#FFEFA6] text-[#7F611E] flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                      Dry naturally
                    </h4>
                    <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-medium">
                      Line drying in sunlight is ideal — sunlight naturally bleaches and sanitises. You can also tumble dry on low. Avoid high heat as it can damage the backing layer.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-150/65 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#FFEFA6] text-[#7F611E] flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs">
                    5
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg">
                      Store clean and dry
                    </h4>
                    <p className="font-sans text-xs sm:text-[13px] text-zinc-650 leading-relaxed font-medium">
                      Make sure pads are completely dry before storing. Store in a breathable bag or drawer. Avoid airtight containers.
                    </p>
                  </div>
                </div>

                {/* Tips for stain removal Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-150/65 space-y-4 hover:shadow-md transition-shadow text-left">
                  <h4 className="font-serif font-black text-brand-charcoal text-base sm:text-lg border-b border-zinc-100 pb-2">
                    Tips for stain removal
                  </h4>
                  <ul className="space-y-3 font-sans text-xs sm:text-[13px] text-zinc-650 font-medium leading-relaxed list-disc pl-5">
                    <li>Cold water rinse immediately after use is the most effective stain prevention.</li>
                    <li>A paste of baking soda and cold water applied before washing works well on stubborn stains.</li>
                    <li>Sunlight is a natural bleaching agent — line dry in direct sunlight for best results.</li>
                    <li>Never use bleach on your pads as it can damage the fibres and backing.</li>
                  </ul>
                </div>

                {/* Back to Home CTA button at the very bottom */}
                <div className="pt-6 pb-12 text-center">
                  <button
                    onClick={() => setShowCareModal(false)}
                    className="bg-[#922B50] hover:bg-[#8A1C44] text-white font-serif font-extrabold text-sm py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-99 cursor-pointer"
                  >
                    Close & Return to Studio
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ZOOMED IMAGE OVERLAY MODAL FOR READY TO SHIP PRODUCTS    */}
        {/* ======================================================== */}
        {zoomedImageUrl && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 transition-all"
            onClick={() => setZoomedImageUrl(null)}
          >
            {/* Click backdrop or close button to close */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-[1000]">
              <button 
                onClick={() => setZoomedImageUrl(null)}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all border border-white/20 shadow-lg backdrop-blur-sm cursor-pointer"
                aria-label="Close zoomed view"
              >
                ✕
              </button>
            </div>
            
            <div 
              className="relative max-w-full max-h-[82vh] md:max-w-xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={getOptimizedImageUrl(zoomedImageUrl, 'detail')} 
                alt="Zoomed Product View" 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl bg-zinc-950"
                referrerPolicy="no-referrer"
              />
              <p className="text-white/60 text-xs font-sans mt-3.5 text-center bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-xs select-none">
                Tap anywhere outside or click ✕ to close
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WONDER PADS ADMINISTRATIVE SECURE BACK OFFICE MODAL      */}
        {/* ======================================================== */}
        {isAdminOpen && (
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col justify-center animate-scaleIn"
            onClick={() => setIsAdminOpen(false)}
          >
            <div 
              className={`w-full h-full select-text flex flex-col justify-start mx-auto shadow-2xl overflow-hidden ${
                isAdminAuthenticated ? 'bg-[#FAF7F2]' : 'bg-zinc-50 p-6 sm:p-8 space-y-4 overflow-y-auto custom-scrollbar'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header section */}
              {!isAdminAuthenticated && (
                <div className="flex justify-between items-center border-b border-zinc-200 pb-3 flex-none">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💼</span>
                    <div>
                      <h3 className="text-xs font-black text-zinc-900 tracking-wider uppercase font-serif">
                        Wonder Pads Back Office
                      </h3>
                      <p className="text-[9.5px] text-zinc-500 font-sans font-medium">
                        Administrative Control Center
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="h-6 w-6 rounded-full bg-zinc-200 hover:bg-zinc-250 text-zinc-650 flex items-center justify-center font-bold text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* AUTHENTICATION LOCK SCREEN */}
              {!isAdminAuthenticated ? (
                <div className="py-6 space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200/80 shadow-3xs animate-pulse">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-800">Secure Merchant Sign In</h4>
                    <p className="text-[10px] text-zinc-500 max-w-[260px] mx-auto leading-relaxed font-medium">
                      Please enter your secret password to unlock the catalog and store customizer controllers.
                    </p>
                  </div>

                  {adminError && (
                    <div className="text-[10.5px] text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-xl font-medium">
                      {adminError}
                    </div>
                  )}

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAdminError('');
                      try {
                        const res = await fetch('/api/admin/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ password: adminPasswordInput })
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          setIsAdminAuthenticated(true);
                          setActivePassword(adminPasswordInput);
                          localStorage.setItem('admin_session_auth', adminPasswordInput);
                        } else {
                          setAdminError(data.error || 'Invalid password. Try again.');
                        }
                      } catch (err) {
                        setAdminError('Server connection failure.');
                      }
                    }}
                    className="space-y-3 max-w-[240px] mx-auto"
                  >
                    <input
                      type="password"
                      placeholder="Password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full text-center p-2.5 text-xs border border-zinc-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-moss focus:border-brand-moss font-mono bg-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-3xs"
                    >
                      Authenticate
                    </button>
                  </form>
                </div>
              ) : (
                /* AUTHENTICATED ADMIN AREA */
                <>
                <AdminUnified
                  fabricsTop={fabricsTop}
                  setFabricsTop={setFabricsTop}
                  fabricsBacking={fabricsBacking}
                  setFabricsBacking={setFabricsBacking}
                  sizeOptions={sizeOptions}
                  setSizeOptions={setSizeOptions}
                  absorbencyOptions={absorbencyOptions}
                  setAbsorbencyOptions={setAbsorbencyOptions}
                  readyMadeStocks={readyMadeStocks}
                  setReadyMadeStocks={setReadyMadeStocks}
                  shapeOptions={shapeOptions}
                  setShapeOptions={setShapeOptions}
                  washingFaq={washingFaq}
                  setWashingFaq={setWashingFaq}
                  blogPosts={blogPosts}
                  setBlogPosts={setBlogPosts}
                  categories={categories}
                  setCategories={setCategories}
                  editingCategoriesText={editingCategoriesText}
                  setEditingCategoriesText={setEditingCategoriesText}
                  shopLogoUrl={shopLogoUrl}
                  setShopLogoUrl={setShopLogoUrl}
                  merchantEmail={merchantEmail}
                  setMerchantEmail={setMerchantEmail}
                  merchantPhone={merchantPhone}
                  setMerchantPhone={setMerchantPhone}
                  saveDatabase={saveDatabase}
                  handleUploadToR2={handleUploadToR2}
                  activePassword={activePassword}
                  setActivePassword={setActivePassword}
                  setIsAdminAuthenticated={setIsAdminAuthenticated}
                  setAdminPasswordInput={setAdminPasswordInput}
                  adminSuccess={adminSuccess}
                  setAdminSuccess={setAdminSuccess}
                  adminError={adminError}
                  setAdminError={setAdminError}
                  lookbookPhotos={mediaPhotos}
                  setLookbookPhotos={setMediaPhotos}
                  isLoadingPhotos={isLoadingPhotos}
                  setIsLoadingPhotos={setIsLoadingPhotos}
                  publishToGithub={publishToGithub}
                  isPublishingToGithub={isPublishingToGithub}
                  ghOwner={ghOwner}
                  setGhOwner={setGhOwner}
                  ghRepo={ghRepo}
                  setGhRepo={setGhRepo}
                  ghBranch={ghBranch}
                  setGhBranch={setGhBranch}
                  ghCommitMsg={ghCommitMsg}
                  setGhCommitMsg={setGhCommitMsg}
                  firebaseStatus={firebaseStatus}
                  setFirebaseStatus={setFirebaseStatus}
                  isR2Mock={isR2Mock}
                  hideLookbookInBackOffice={hideLookbookInBackOffice}
                  toggleHideLookbookInBackOffice={toggleHideLookbookInBackOffice}
                />
                </>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STICKY FLOATING LIVE SUMMARY OF CART                     */}
        {/* ======================================================== */}
        {cart.length > 0 && !isCartFloatingExpanded && !shouldShowCheckout && (
          <div className="absolute bottom-4 left-3 right-3 z-40 bg-white/95 backdrop-blur-md rounded-full border border-brand-moss/20 shadow-md p-1.5 flex items-center justify-between animate-slideUp">
            {/* Left section: Icon and cart summary info */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="relative h-9 w-9 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-150">
                <ShoppingBag className="h-4.5 w-4.5 text-brand-charcoal" />
                <span className="absolute -top-1 -right-1 bg-brand-moss text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </div>
              <div className="text-left leading-tight">
                <h4 className="text-[10px] font-black font-serif text-brand-charcoal uppercase tracking-wider">
                  Custom Order Summary
                </h4>
                <p className="text-[9.5px] text-zinc-500 font-medium">
                  {totalCartCount} {totalCartCount === 1 ? 'pad' : 'pads'} • <span className="font-mono text-brand-moss font-bold">S${totalCartPrice.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Right section: DETAILS & CHECKOUT buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsCartFloatingExpanded(true)}
                className="text-xs font-black text-brand-moss hover:text-brand-moss/90 tracking-widest uppercase flex items-center gap-1 px-3 py-1.5 cursor-pointer bg-brand-moss/12 hover:bg-brand-moss/20 rounded-full border border-brand-moss/25 transition-all active:scale-95"
              >
                Details <ChevronUp className="h-3.5 w-3.5 stroke-[2.5px] animate-pulse" />
              </button>

              <button
                onClick={() => {
                  setIsCheckoutPage(true);
                  if (containerRef.current) {
                    containerRef.current.scrollTop = 0;
                  }
                }}
                className="bg-brand-moss hover:bg-brand-moss/90 text-[9.5px] font-black tracking-widest uppercase py-2 px-3.5 rounded-full transition-all text-center select-none shadow-3xs active:scale-98 flex items-center gap-1 cursor-pointer text-[#FFF5F7]"
              >
                Checkout <ChevronRight className="h-3 w-3 stroke-[3px]" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EXPANDED LIVE ORDER BASKET BOTTOM DRAWER SHEET            */}
        {/* ======================================================== */}
        {cart.length > 0 && isCartFloatingExpanded && !shouldShowCheckout && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-end justify-center" onClick={() => setIsCartFloatingExpanded(false)}>
            <div 
              className="w-full bg-white rounded-t-[32px] border border-zinc-200/50 shadow-2xl p-5 space-y-4 animate-slideUp select-text max-h-[85%] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header section as in Picture 2 */}
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 bg-brand-moss text-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="text-left leading-none">
                    <h4 className="text-xs font-black font-serif text-brand-charcoal uppercase tracking-widest">
                      Custom Order Summary
                    </h4>
                    <span className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest font-mono mt-0.5 block">
                      {totalCartCount} TOTAL CLOTH PADS
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConfirmingFloatingClear ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 py-1 px-2.5 rounded-full text-[9px] font-extrabold shadow-3xs animate-fadeIn">
                      <span className="text-zinc-650">Sure?</span>
                      <button
                        onClick={() => {
                          saveCart([]);
                          setIsConfirmingFloatingClear(false);
                          setIsCartFloatingExpanded(false);
                        }}
                        className="text-rose-600 font-black hover:underline cursor-pointer"
                      >
                        Yes
                      </button>
                      <span className="text-zinc-300">/</span>
                      <button
                        onClick={() => setIsConfirmingFloatingClear(false)}
                        className="text-zinc-500 font-bold hover:underline cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingFloatingClear(true)}
                      className="text-[9.5px] font-extrabold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all py-1 px-3 rounded-full cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartFloatingExpanded(false)}
                    className="h-7 w-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-550 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable list of items */}
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 pr-1 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-start justify-between gap-3 text-xs text-left">
                    {/* Left: Image & Specs */}
                    <div className="flex gap-3 items-start min-w-0 flex-1">
                      {hideLookbookInBackOffice ? (
                        <div className="h-14 w-14 rounded-xl border border-zinc-150 flex-none bg-[#fdfbf7] flex items-center justify-center text-lg select-none">
                          {item.isReadyMade ? '📦' : '🎨'}
                        </div>
                      ) : (
                        <img 
                          src={item.imageUrl ? getOptimizedImageUrl(item.imageUrl, 'thumbnail') : "/api/placeholder/100/100"} 
                          alt={item.sizeName} 
                          className="h-14 w-14 object-contain rounded-xl border border-zinc-150 flex-none bg-stone-50 p-1"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0 leading-normal space-y-0.5">
                        <span className="font-extrabold text-zinc-900 block uppercase text-[11px] truncate">
                          {item.sizeName} ({item.lengthInches}")
                          {item.isReadyMade && (
                            <span className="ml-1.5 text-[7px] bg-amber-50 text-amber-700 font-extrabold px-1 py-0.2 rounded font-mono uppercase inline-block">
                              Ready
                            </span>
                          )}
                        </span>
                        <p className="text-[10px] text-zinc-650 font-medium truncate">
                          <span className="text-zinc-400 font-semibold">Print:</span> {item.printName}
                        </p>
                        <p className="text-[10px] text-zinc-650 font-medium truncate">
                          <span className="text-zinc-400 font-semibold">Shape:</span> {item.shapeName}
                        </p>
                        {item.sizeName.toLowerCase().includes('liner') && (
                          <p className="text-[9px] text-zinc-400 italic truncate">
                            Backing: {item.backingName} • Core: {item.absorbencyName}
                          </p>
                        )}
                        <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider pt-0.5">
                          QTY: <span className="text-zinc-850 font-mono font-extrabold text-[10px]">{item.quantity}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Controls & Subtotal stacked to save vertical space */}
                    <div className="flex flex-col items-end justify-between gap-2 shrink-0 min-h-[56px]">
                      {/* Top Right: Subtotal & Delete button */}
                      <div className="flex items-center gap-1.5">
                        <div className="text-right">
                          <span className="text-[7.5px] text-zinc-400 font-bold block uppercase leading-none mb-0.5">Subtotal</span>
                          <span className="text-[11px] font-extrabold text-zinc-800 font-mono">
                            S${item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveBasketItem(item.id)}
                          className="h-6 w-6 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-rose-150"
                          title="Remove item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Bottom Right: Quantity Controls */}
                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 text-[10.5px]">
                        <button
                          onClick={() => handleModifyBasketQuantity(item.id, -1)}
                          className="h-5.5 w-5.5 hover:bg-zinc-150 rounded-md active:scale-95 text-brand-moss flex items-center justify-center font-black cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold font-mono text-zinc-850 text-[10.5px] min-w-[14px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleModifyBasketQuantity(item.id, 1)}
                          className="h-5.5 w-5.5 hover:bg-zinc-150 rounded-md active:scale-95 text-brand-moss flex items-center justify-center font-black cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer section with estimated total as in Picture 2 */}
              <div className="border-t border-zinc-150 pt-3 space-y-4 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-serif">
                    ESTIMATED TOTAL
                  </span>
                  <span className="text-sm font-black text-brand-moss font-serif">
                    S${totalCartPrice.toFixed(2)}
                  </span>
                </div>

                {/* Action buttons as in Picture 2 */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => setIsCartFloatingExpanded(false)}
                    className="w-full bg-white border border-zinc-300 hover:bg-zinc-50 text-brand-charcoal text-xs font-black py-2.5 rounded-xl transition-all text-center select-none cursor-pointer"
                  >
                    Minimize
                  </button>
                  <button
                    onClick={() => {
                      setIsCartFloatingExpanded(false);
                      setIsCheckoutPage(true);
                      if (containerRef.current) {
                        containerRef.current.scrollTop = 0;
                      }
                    }}
                    className="w-full bg-brand-moss hover:bg-brand-moss/90 text-white text-xs font-black py-2.5 rounded-xl transition-all text-center select-none shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send My Order</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FLOATING BACK TO TOP BUTTON */}
        {showScrollToTop && isRtsPage && (
          <button
            id="back_to_top_btn"
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }
            }}
            type="button"
            className={`fixed md:absolute ${getScrollToTopBottomClass()} right-4 z-[99] bg-[#922B50]/55 backdrop-blur-xs hover:bg-[#922B50] text-white p-3 rounded-full shadow-md hover:shadow-lg border border-white/25 transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center animate-fadeIn group cursor-pointer`}
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* INTERACTIVE WALKTHROUGH TOUR OVERLAY */}
        {tourStep !== null && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-3xs z-[9990] flex items-center justify-center p-4">
            <div 
              id="walkthrough_tour_card"
              className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 shadow-2xl p-5 space-y-4 animate-scaleIn font-sans select-text text-left relative z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 bg-[#FFF5F7] text-[#C54B64] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                  <span>Step {tourStep} of 5</span>
                </div>
                <button
                  id="skip_tour_btn"
                  onClick={handleSkipTour}
                  className="text-zinc-400 hover:text-zinc-600 text-xs font-bold font-sans tracking-wide cursor-pointer"
                >
                  Skip Tour
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C54B64] transition-all duration-300"
                  style={{ width: `${(tourStep / 5) * 100}%` }}
                />
              </div>

              {/* Character Header / Icon */}
              <div className="flex items-center gap-3 py-1 border-b border-rose-50">
                <div className="h-10 w-10 rounded-full bg-[#FFF5F7] border border-rose-250/50 flex items-center justify-center text-lg shadow-3xs shrink-0 select-none">
                  🌸
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#922B50] font-sans">
                    Sister Wonder
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    WonderPads Guide
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-[#C54B64] text-sm tracking-tight leading-snug">
                  {tourStep === 1 && "Welcome to WonderPads Reusables! ✨"}
                  {tourStep === 2 && "Choose Your Studio Experience ✂️📦"}
                  {tourStep === 3 && "Live Canvas Visualizer 🎨"}
                  {tourStep === 4 && "Cloth Pad Wash Care Guide 📖"}
                  {tourStep === 5 && "Checkout & Send Inquiry 🛍️"}
                </h3>
                <p className="text-zinc-650 text-xs leading-relaxed font-sans font-medium">
                  {tourStep === 1 && (
                    "I am here to guide you! Let's take a 1-minute interactive tour of our cloth pad customization studio to help you find or design your perfect handsewn pad."
                  )}
                  {tourStep === 2 && (
                    "First, decide whether you want to custom-design your own reusable pad with specific fabrics, lengths, and shapes in the Custom Bespoke Studio, OR pick pre-crafted Ready-To-Ship pads already in stock!"
                  )}
                  {tourStep === 3 && (
                    "This is the live Visualizer Canvas! Slide the length & width, pick a premium top cotton fabric print, select a shape, and watch your personalized pad design render live on screen before adding to basket."
                  )}
                  {tourStep === 4 && (
                    "Have questions about unbleached raw fabrics, organic layer absorbency, or washing steps? Read our human-curated Wash Care Guide, or click the floating WhatsApp button to chat with me directly for friendly personal support!"
                  )}
                  {tourStep === 5 && (
                    "After adding pads to your basket, expand the Custom Order Summary bottom panel, check your items, and click Checkout. You can fill in your name and send your handsewn request directly to Nilam!"
                  )}
                </p>
              </div>

              {/* Action Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  id="tour_prev_btn"
                  onClick={handlePrevTourStep}
                  disabled={tourStep === 1}
                  className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-all ${
                    tourStep === 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  Back
                </button>

                <button
                  id="tour_next_btn"
                  onClick={handleNextTourStep}
                  className="bg-[#C54B64] hover:bg-[#922B50] text-white text-xs font-black uppercase tracking-wider px-5 py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-3xs active:scale-95"
                >
                  {tourStep === 5 ? "Finish" : "Next Step"}
                  {tourStep !== 5 && <ChevronRight className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
