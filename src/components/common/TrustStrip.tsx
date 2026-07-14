import { ShieldCheck, Sparkles, Truck, PenTool } from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, title: 'Secure Packaging' },
  { icon: Sparkles, title: 'Handcrafted Quality' },
  { icon: Truck, title: 'Pan-India Delivery' },
  { icon: PenTool, title: 'Custom Orders Available' },
];

export function TrustStrip() {
  return (
    <section className="bg-warm-beige/30 border-y border-border/50 py-10 section-padding">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3 group reveal">
              <div className="w-12 h-12 rounded-full border border-border/60 bg-cream flex items-center justify-center text-temple-red group-hover:bg-temple-red group-hover:text-cream transition-colors duration-300">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-body text-sm font-medium text-brown uppercase tracking-wider">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
