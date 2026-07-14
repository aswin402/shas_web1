import {
  HeroSection,
  BestSellersSection,
  CollectionsSection,
  CraftsmanshipSection,
  PremiumBanner,
  WhyChooseUsSection,
  CustomOrderSection,
  ReviewsSection,
  NewsletterSection,
  FaqSection,
} from './homepage/sections';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BestSellersSection />
      <CollectionsSection />
      <CraftsmanshipSection />
      <PremiumBanner />
      <WhyChooseUsSection />
      <CustomOrderSection />
      <ReviewsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
