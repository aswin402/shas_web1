import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CustomGalleryCTA() {
  return (
    <section className="bg-cream py-20 section-padding">
      <div className="max-w-[1200px] mx-auto bg-deep-brown rounded-2xl overflow-hidden shadow-xl relative reveal">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-clay/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-clay/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center p-8 md:p-16">
          
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-heading text-cream mb-4">
              Have a Design Reference?
            </h2>
            <p className="text-cream/80 font-body text-base md:text-lg mb-8 leading-relaxed max-w-md">
              Send us your jewellery design sketch, preferred metal, gemstone, and budget. We'll help you craft a custom heirloom piece for your wedding or special occasion.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/contact"
                className="px-6 py-3 bg-cream text-deep-brown font-medium tracking-wide rounded hover:bg-ivory transition-colors duration-300 font-bold"
              >
                Start Custom Order
              </Link>
              <a 
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-cream/30 text-cream font-medium tracking-wide rounded hover:bg-cream/10 transition-colors duration-300 font-bold"
              >
                <MessageCircle className="w-5 h-5" />
                Talk on WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden md:block relative h-full min-h-[300px] rounded-xl overflow-hidden">
            <img 
              src="/images/gallery-statues/artisan-workshop.png" 
              alt="Master goldsmith handcrafting jewellery"
              className="w-full h-full object-cover opacity-80 mix-blend-overlay border border-cream/20 rounded-xl"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
