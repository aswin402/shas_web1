import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 ${centered ? 'text-center' : 'text-left'} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } transition-all duration-700 ease-out`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-body font-medium uppercase tracking-[0.2em] mb-3 ${
            light ? 'text-clay' : 'text-temple-red'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-heading text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-semibold leading-tight ${
          light ? 'text-cream' : 'text-deep-brown'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-sand' : 'text-muted-brown'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
