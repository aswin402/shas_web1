import type { Collection } from '@/types';
import colGanesha from '../assets/32.png';
import colBuddha from '../assets/26.png';
import colMarble from '../assets/3.png';
import colBronze from '../assets/22.png';
import colGarden from '../assets/8.png';
import colHomeDecor from '../assets/15.png';

export const collections: Collection[] = [
  {
    id: 'temple',
    title: 'Temple Collection',
    description: 'Heritage temple jewellery crafted with intricate divine motifs and antique finishes.',
    image: colGanesha,
    slug: 'temple-collection',
  },
  {
    id: 'bridal',
    title: 'Bridal Collection',
    description: 'Luxurious neckpieces, chokers, and head ornaments designed for the bride\'s celebration.',
    image: colBuddha,
    slug: 'bridal-collection',
  },
  {
    id: 'gold',
    title: 'Gold Jewellery',
    description: 'Stunning 22k gold necklaces, earrings, and bangles with a rich heritage shine.',
    image: colMarble,
    slug: 'gold-collection',
  },
  {
    id: 'silver',
    title: 'Silver Ornaments',
    description: 'Elegant sterling silver jewellery, anklets, and accessories for everyday wear.',
    image: colBronze,
    slug: 'silver-collection',
  },
  {
    id: 'earrings',
    title: 'Statement Earrings',
    description: 'Antique jhumkas, drops, and studs that frame your face in gold-hour brilliance.',
    image: colGarden,
    slug: 'earrings',
  },
  {
    id: 'bangles',
    title: 'Traditional Bangles',
    description: 'Intricately carved gold and gemstone bangles, kadas, and heritage armbands.',
    image: colHomeDecor,
    slug: 'bangles',
  },
];
