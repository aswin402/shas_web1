import { Palette, PackageCheck, PenTool, ShieldCheck } from 'lucide-react';
import type { Feature } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  PackageCheck,
  PenTool,
  ShieldCheck,
};

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon];

  return (
    <div className="group p-6 md:p-8 rounded-lg border border-border bg-ivory transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.2)] hover:border-temple-red/30 h-full flex flex-col">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-warm-beige mb-5 transition-all duration-300 group-hover:bg-temple-red/10">
        {Icon && (
          <Icon className="w-6 h-6 text-temple-red transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl font-semibold text-deep-brown mb-2.5">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-brown">
        {feature.description}
      </p>
    </div>
  );
}
