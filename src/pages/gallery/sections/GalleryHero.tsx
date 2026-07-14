import { Link } from 'react-router-dom';

export function GalleryHero() {
  return (
    <section className="relative bg-cream pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden section-padding">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-warm-beige/30 rounded-bl-[100px] -z-10 hidden lg:block" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl reveal visible">
            <span className="inline-block text-clay font-body text-sm uppercase tracking-[0.2em] font-bold mb-4">
              Lookbook &amp; Inspiration
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-deep-brown mb-6 leading-tight">
              Ornaments Designed for Elegant &amp; Heritage Occasions
            </h1>
            <p className="text-lg text-muted-brown mb-10 leading-relaxed max-w-lg font-body">
              Explore handcrafted ornaments styled across bridal looks, daily wear, festive moments, and artisan-inspired styling lookbooks.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a 
                href="#gallery-grid"
                className="px-8 py-3.5 bg-clay text-white font-medium tracking-wide rounded hover:bg-burnt-gold transition-colors duration-300 shadow-sm"
              >
                Explore Gallery
              </a>
              <Link 
                to="/shop"
                className="px-8 py-3.5 border border-brown text-brown font-medium tracking-wide rounded hover:bg-brown hover:text-cream transition-colors duration-300"
              >
                Shop Jewellery
              </Link>
            </div>
          </div>

          {/* Image Collage */}
          <div className="relative h-[500px] md:h-[600px] w-full reveal visible" style={{ transitionDelay: '200ms' }}>
            <div className="absolute top-0 right-0 w-3/4 h-[80%] rounded-2xl overflow-hidden border border-border/50">
              <img 
                src="/images/gallery-statues/ganesha-pooja-room.png" 
                alt="Temple Lakshmi Choker styled beautifully"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-2xl overflow-hidden border-4 border-cream shadow-2xl z-10">
              <img 
                src="/images/gallery-statues/buddha-meditation.png" 
                alt="Emerald Bridal Necklace close-up"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative Seal */}
            <div className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-cream border border-clay/20 shadow-lg flex items-center justify-center z-20 animate-[spin_20s_linear_infinite]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-clay">
                <path id="curve" d="M 50 15 A 35 35 0 1 1 49.9 15" fill="transparent" />
                <text className="text-[11px] font-medium tracking-[0.15em] uppercase font-bold">
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    SHAS Jewellery •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
