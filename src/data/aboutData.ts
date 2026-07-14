/* ──────────────────────────────────────────────
   SHAS Jewellery — About Page Data
   ────────────────────────────────────────────── */

export interface MissionCard {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface WorkshopImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  size: 'tall' | 'wide' | 'normal';
}

export interface CustomStep {
  number: string;
  title: string;
}

export interface QualityPoint {
  title: string;
}

export interface AboutTestimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  product: string;
}

export interface TrustStripItem {
  icon: string;
  label: string;
}

/* ── Mission / Vision Cards ── */
export const missionCards: MissionCard[] = [
  {
    icon: '🎯',
    title: 'Our Mission',
    description:
      'To make handcrafted, certified fine jewellery accessible to everyone who values heritage, purity, and elegant celebrations.',
  },
  {
    icon: '✨',
    title: 'Our Vision',
    description:
      'To be Erode\'s most trusted destination for bridal, temple, and bespoke jewellery, crafted with pure artistry and love.',
  },
  {
    icon: '🤝',
    title: 'Our Promise',
    description:
      'To deliver BIS hallmarked pieces with lifetime warranties, insured shipping, and personal styling support.',
  },
];

/* ── Process Steps ── */
export const processSteps: ProcessStep[] = [
  { number: '01', title: 'Design Conceptualization' },
  { number: '02', title: 'Hand Finishing / Casting' },
  { number: '03', title: 'Gemstone Setting' },
  { number: '04', title: 'BIS Hallmarking & Quality Check' },
  { number: '05', title: 'Secure Insured Packaging' },
];

/* ── Materials ── */
export const materials: MaterialItem[] = [
  {
    id: 'gold-22k',
    name: '22k Yellow Gold',
    description:
      'Rich, heavy, and timeless for bridal neckpieces and traditional temple ornaments.',
    image: '/images/about/gold-texture.png',
  },
  {
    id: 'silver-925',
    name: '92.5 Sterling Silver',
    description:
      'Polished, durable, and sleek for contemporary collections and everyday wear.',
    image: '/images/about/silver-texture.png',
  },
  {
    id: 'rose-gold',
    name: '18k Rose Gold',
    description:
      'Modern, warm, and romantic for minimal bands, pendants, and dainty accessories.',
    image: '/images/about/rosegold-texture.png',
  },
  {
    id: 'gemstones',
    name: 'Precious Gemstones',
    description:
      'Authentic, hand-set rubies, emeralds, and freshwater pearls adding royal color.',
    image: '/images/about/gemstone-texture.png',
  },
];

/* ── Stats ── */
export const aboutStats: AboutStat[] = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '15+', label: 'Master Craftsmen' },
  { value: '100%', label: 'BIS Hallmarked Purity' },
  { value: '4.9★', label: 'Customer Rating' },
];

/* ── Values ── */
export const values: ValueItem[] = [
  {
    icon: '✦',
    title: 'Authentic Craft',
    description:
      'We value the hand, the detail, and the tradition behind every single piece.',
  },
  {
    icon: '◈',
    title: 'Meaningful Design',
    description:
      'Every piece should bring elegance, festivity, or heritage to your styling.',
  },
  {
    icon: '◆',
    title: 'Trusted Quality',
    description:
      'We focus on BIS Hallmarking, certified gemstones, and buyback guarantees.',
  },
  {
    icon: '♡',
    title: 'Customer Care',
    description:
      'We guide customers through bridal styling, bespoke customization, and shipping.',
  },
];

/* ── Workshop Gallery ── */
export const workshopImages: WorkshopImage[] = [
  {
    id: 'ws-1',
    src: '/images/about/hero-artisan.png',
    alt: 'Master craftsman setting gemstones on a bridal choker',
    caption: 'Gemstone Setting',
    size: 'tall',
  },
  {
    id: 'ws-2',
    src: '/images/about/artisan-polishing.png',
    alt: 'Artisan polishing a sterling silver bangle',
    caption: 'Silver Polishing',
    size: 'normal',
  },
  {
    id: 'ws-3',
    src: '/images/about/workshop-display.png',
    alt: 'SHAS showroom display with gold necklaces',
    caption: 'Showroom Display',
    size: 'wide',
  },
  {
    id: 'ws-4',
    src: '/images/about/marble-texture.png',
    alt: 'BIS Hallmark punch details close-up',
    caption: 'Hallmark Inspection',
    size: 'normal',
  },
  {
    id: 'ws-5',
    src: '/images/about/packaging-care.png',
    alt: 'Careful placement of necklace into luxury velvet box',
    caption: 'Luxury Packaging',
    size: 'normal',
  },
  {
    id: 'ws-6',
    src: '/images/about/bronze-texture.png',
    alt: 'Gold plating process surface detail',
    caption: 'Gold Plating Finish',
    size: 'tall',
  },
];

/* ── Custom Order Steps ── */
export const customSteps: CustomStep[] = [
  { number: '01', title: 'Share Design Reference' },
  { number: '02', title: 'Choose Metal & Gemstones' },
  { number: '03', title: 'Confirm Weight & Budget' },
  { number: '04', title: 'Handcraft & Deliver' },
];

/* ── Quality Points ── */
export const qualityPoints: QualityPoint[] = [
  { title: 'BIS Hallmarked certification verification' },
  { title: '100% Insured secure transit shipping' },
  { title: 'Certified gemstone authenticity cards' },
  { title: 'Lifetime repolishing and buyback support' },
];

/* ── Testimonials ── */
export const aboutTestimonials: AboutTestimonial[] = [
  {
    id: 'test-1',
    quote:
      'The custom bridal necklace arrived securely in Erode, looking even more brilliant than the original design sketch.',
    name: 'Priya Sharma',
    location: 'Erode, Tamil Nadu',
    rating: 5,
    product: '22k Gold Temple Choker',
  },
  {
    id: 'test-2',
    quote: 'Exceptional antique temple jhumkas. Their craftsmanship is stunning and perfect for traditional Saris.',
    name: 'Meenakshi Sundaram',
    location: 'Erode, Tamil Nadu',
    rating: 5,
    product: 'Antique Gold Jhumka Earrings',
  },
  {
    id: 'test-3',
    quote:
      'Collaborated on a bespoke gemstone kada. The process was highly transparent and pure weight matching was perfect.',
    name: 'Ananya Desai',
    location: 'Bangalore, Karnataka',
    rating: 5,
    product: 'Bespoke Ruby Kada Bangle',
  },
];

/* ── Trust Strip ── */
export const trustStripItems: TrustStripItem[] = [
  { icon: '📦', label: '100% Insured Shipping' },
  { icon: '✨', label: 'BIS Hallmarked Purity' },
  { icon: '🚚', label: 'Pan-India Delivery' },
  { icon: '🎨', label: 'Custom Orders Available' },
];
