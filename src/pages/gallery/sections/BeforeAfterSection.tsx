import { Link } from 'react-router-dom';

export function BeforeAfterSection() {
  return (
    <section className="bg-warm-beige/20 py-24 section-padding border-y border-border/30">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">
            From Classic to Styled Elegance
          </h2>
          <p className="text-muted-brown max-w-2xl mx-auto font-body">
            See how a statement necklace transforms a simple neckline into a celebration of heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-cream rounded-2xl p-6 md:p-10 border border-border/40 shadow-sm reveal">
          
          {/* Before */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="/images/gallery-statues/before-empty-shelf.png" 
              alt="Simple neckline without jewelry"
              className="w-full aspect-square object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-1.5 bg-brown/80 text-cream backdrop-blur-md text-xs font-semibold uppercase tracking-wider rounded-sm">
                Unadorned
              </span>
            </div>
          </div>

          {/* After */}
          <div className="relative rounded-xl overflow-hidden shadow-lg group">
            <img 
              src="/images/gallery-statues/after-styled-shelf.png" 
              alt="Neckline styled with Temple Lakshmi Choker"
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 z-10">
              <span className="px-4 py-1.5 bg-clay text-white shadow-md text-xs font-semibold uppercase tracking-wider rounded-sm font-bold">
                Adorned
              </span>
            </div>
            {/* Soft overlay gradient at bottom to ground it */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep-brown/40 to-transparent pointer-events-none" />
          </div>
          
        </div>

        <div className="mt-12 text-center reveal">
          <Link 
            to="/shop"
            className="inline-block px-8 py-3.5 border-2 border-brown text-brown font-medium tracking-wide rounded hover:bg-brown hover:text-cream transition-colors duration-300 font-bold"
          >
            Shop Heritage Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
