import { Camera } from 'lucide-react';

export function SocialCTASection() {
  return (
    <section className="bg-cream py-24 section-padding">
      <div className="max-w-3xl mx-auto text-center reveal">
        <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">
          Share Your SHAS Style
        </h2>
        <p className="text-muted-brown text-lg mb-8 font-body">
          Tag us with your SHAS Jewellery styling look and get featured in our gallery.
        </p>
        <p className="text-clay font-medium tracking-widest uppercase text-sm mb-10 font-bold">
          #SHASJewellery
        </p>
        <a 
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-brown text-brown font-medium tracking-wide rounded hover:bg-brown hover:text-cream transition-colors duration-300 font-bold"
        >
          <Camera className="w-5 h-5" />
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}
