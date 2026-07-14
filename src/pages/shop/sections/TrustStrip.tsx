import { ShieldCheck, Hand, Truck, Palette } from 'lucide-react';
import { trustItems } from '@/data/shopData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  hand: Hand,
  truck: Truck,
  palette: Palette,
};

export function TrustStrip() {
  return (
    <section className="bg-warm-beige/40 border-y border-border/40">
      <div className="max-w-[1400px] mx-auto section-padding py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-2.5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cream border border-border/50">
                  <Icon className="w-5 h-5 text-temple-red" />
                </div>
                <div>
                  <h4 className="text-xs font-body font-semibold uppercase tracking-[0.1em] text-brown mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-muted-brown leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
