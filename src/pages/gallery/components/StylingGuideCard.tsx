import type { StylingGuide } from '@/types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StylingGuideCardProps {
  guide: StylingGuide;
}

export function StylingGuideCard({ guide }: StylingGuideCardProps) {
  return (
    <div className="bg-ivory border border-border/60 rounded-xl p-8 hover:border-temple-red/40 transition-colors duration-300 reveal">
      <div className="w-12 h-12 rounded-full bg-warm-beige/30 flex items-center justify-center text-temple-red font-heading text-xl font-semibold mb-6">
        {guide.iconNumber}
      </div>
      <h3 className="font-heading text-2xl text-brown mb-3">{guide.title}</h3>
      <p className="font-body text-muted-brown leading-relaxed mb-6">
        {guide.description}
      </p>
      <Link 
        to={guide.link}
        className="inline-flex items-center gap-2 text-temple-red font-medium text-sm uppercase tracking-wider hover:text-deep-red transition-colors"
      >
        Explore Collection
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
