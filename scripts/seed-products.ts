import { createClient } from '@supabase/supabase-js';
import { shopProducts } from '../src/data/shopData';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL env variable');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding products...');
  for (const product of shopProducts) {
    const { error } = await supabase.from('products').upsert({
      name: product.name,
      description: '',
      price: product.price,
      image_url: product.image,
      category: product.category,
      stock: 10,
      rating: product.rating,
      reviews_count: product.reviewCount,
      details: {
        dimensions: product.size || '',
        material: product.material || '',
        usage: product.usage || '',
        colorFinish: product.colorFinish || '',
      },
      is_featured: false,
    }, { onConflict: 'name' });

    if (error) {
      console.error(`Failed to seed ${product.name}:`, error.message);
    } else {
      console.log(`Seeded: ${product.name}`);
    }
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
