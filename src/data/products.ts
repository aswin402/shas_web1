import type { Product } from '@/types';
import p32 from '../assets/32.png';
import p26 from '../assets/26.png';
import p35 from '../assets/35.png';
import p1 from '../assets/1.png';
import p12 from '../assets/12.png';
import p17 from '../assets/17.png';
import p2 from '../assets/2.png';
import p33 from '../assets/33.png';

export const products: Product[] = [
  {
    id: 'antique-jhumka',
    name: 'Antique Gold Jhumka Earrings',
    material: '22k Gold',
    price: 18999,
    originalPrice: 21999,
    image: p32,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'temple-choker',
    name: 'Temple Lakshmi Choker Necklace',
    material: '22k Gold',
    price: 48999,
    originalPrice: 54999,
    image: p26,
    badge: 'Handcrafted',
    inStock: true,
  },
  {
    id: 'bridal-necklace',
    name: 'Royal Kundan Bridal Necklace',
    material: '22k Gold & Gemstones',
    price: 89999,
    image: p35,
    badge: 'New',
    inStock: true,
  },
  {
    id: 'ruby-kada',
    name: 'Traditional Ruby Kada Bangle',
    material: '22k Gold',
    price: 34999,
    image: p1,
    inStock: true,
  },
  {
    id: 'silver-anklet',
    name: 'Sterling Silver Ghungroo Anklet',
    material: '92.5 Silver',
    price: 2499,
    originalPrice: 2999,
    image: p12,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'peacock-ring',
    name: 'Heritage Peacock Gold Ring',
    material: '22k Gold',
    price: 12999,
    image: p17,
    badge: 'Handcrafted',
    inStock: true,
  },
  {
    id: 'emerald-pendant',
    name: 'Elegant Emerald Drop Pendant',
    material: '18k Rose Gold',
    price: 15999,
    originalPrice: 17999,
    image: p2,
    inStock: true,
  },
  {
    id: 'silver-bangle',
    name: 'Vintage Oxidized Silver Bangle',
    material: '92.5 Silver',
    price: 3999,
    image: p33,
    badge: 'New',
    inStock: true,
  },
];
