import { ShieldCheck, Truck, Award, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function WhyChooseUsSection() {
  const { ref, isVisible } = useScrollAnimation();

  const trustSignals = [
    {
      icon: ShieldCheck,
      title: 'BIS Hallmarked',
      description: '100% certified pure gold, silver, and authentic temple jewelry.',
    },
    {
      icon: Truck,
      title: 'Insured Free Shipping',
      description: 'Complimentary shipping across India, 100% insured from our vault.',
    },
    {
      icon: Award,
      title: 'Lifetime Warranty',
      description: 'Lifetime plating and materials warranty on sterling collections.',
    },
    {
      icon: Sparkles,
      title: 'Heritage Artistry',
      description: 'Hand-finished by traditional master artisans preserving ancient legacy.',
    },
  ];

  return (
    <section ref={ref} className="bg-primary py-12 md:py-16 border-y border-white/5">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.title}
                style={{ transitionDelay: `${index * 100}ms` }}
                className="flex items-start gap-4 transition-all duration-500 hover:translate-y-[-2px]"
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded bg-white/5 border border-white/10 text-clay">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1.5 tracking-wide">
                    {signal.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-body">
                    {signal.description}
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
