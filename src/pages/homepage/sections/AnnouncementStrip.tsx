export function AnnouncementStrip() {
  const text =
    'NEW ARRIVALS \u00A0•\u00A0 BIS HALLMARKED JEWELLERY \u00A0•\u00A0 BESPOKE CUSTOM ORDERS \u00A0•\u00A0 100% INSURED SHIPPING \u00A0•\u00A0 ';

  return (
    <section className="relative overflow-hidden">
      {/* Top wave */}
      <svg
        className="absolute top-0 left-0 w-full h-4 sm:h-6"
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 24C240 0 480 0 720 12C960 24 1200 24 1440 0V24H0Z"
          fill="oklch(0.50 0.065 55)"
        />
      </svg>

      {/* Strip content */}
      <div className="bg-muted-brown py-4 sm:py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Repeat text several times for seamless loop */}
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="text-xs sm:text-sm font-body font-medium uppercase tracking-[0.2em] text-cream/90 mx-0"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-4 sm:h-6"
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 0C240 24 480 24 720 12C960 0 1200 0 1440 24V0H0Z"
          fill="oklch(0.50 0.065 55)"
        />
      </svg>
    </section>
  );
}
