import type { NavLink, FooterColumn, GalleryItem, Stat } from '@/types';

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Collections',
    href: '/shop',
    children: [
      { label: 'Temple Collection', href: '/shop?category=temple-collection' },
      { label: 'Bridal Collection', href: '/shop?category=bridal-collection' },
      { label: 'Gold Jewellery', href: '/shop?category=gold-collection' },
    ],
  },
  {
    label: 'Gold',
    href: '/shop?category=gold-collection',
    children: [
      { label: 'Necklaces & Chokers', href: '/shop?category=gold-collection' },
      { label: 'Bangles & Kadas', href: '/shop?category=gold-collection' },
    ],
  },
  {
    label: 'Silver',
    href: '/shop?category=silver-collection',
    children: [
      { label: 'Silver Anklets', href: '/shop?category=silver-collection' },
      { label: 'Silver Bangles', href: '/shop?category=silver-collection' },
    ],
  },
  { label: 'Temple Jewellery', href: '/shop?category=temple-collection' },
  { label: 'Bridal', href: '/shop?category=bridal-collection' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Temple Collection', href: '/shop?category=temple-collection' },
      { label: 'Bridal Collection', href: '/shop?category=bridal-collection' },
      { label: 'Gold Jewellery', href: '/shop?category=gold-collection' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping & Returns', href: '/shipping-returns' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    image: '/images/gallery-statues/elephant-living-room.png',
    title: 'Bridal Splendour',
    caption: 'Nakshi temple choker on silk saree',
    category: 'Bridal Wear',
    tag: 'Wedding',
  },
  {
    id: 'gallery-2',
    image: '/images/gallery-statues/buddha-meditation.png',
    title: 'Daily Elegance',
    caption: '18k rose gold ring stacks',
    category: 'Daily Styling',
    tag: 'Minimalist',
  },
  {
    id: 'gallery-3',
    image: '/images/gallery-statues/garden-buddha.png',
    title: 'Festive Sparkle',
    caption: 'Classic antique coin haram',
    category: 'Festive Sparkle',
    tag: 'Traditional',
  },
  {
    id: 'gallery-4',
    image: '/images/gallery-statues/brass-deepam.png',
    title: 'Traditional Bangles',
    caption: 'Peacock Nakshi gold kada bangles',
    category: 'Traditional/Nagas',
    tag: 'Antique',
  },
  {
    id: 'gallery-5',
    image: '/images/gallery-statues/nataraja-shelf.png',
    title: 'Statement Jhumkas',
    caption: 'Kemp stone temple jhumka drops',
    category: 'Statement Earrings',
    tag: 'Earrings',
  },
];

export const craftsmanshipStats: Stat[] = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '15+', label: 'Master Goldsmiths' },
  { value: '100%', label: 'BIS Hallmarked' },
];
