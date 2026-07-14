import {
  ContactHero,
  ContactOptions,
  ContactForm,
  StoreInfo,
  MapSection,
  CustomOrderCTA,
  FAQSection,
  SupportCategories,
  SocialSection,
  ContactTrustStrip,
} from './sections';

/**
 * Contact page component displaying all contact methods, showroom location,
 * FAQs, and the interactive ContactForm (which handles Supabase submissions).
 */
export function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactOptions />
      <ContactForm />
      <StoreInfo />
      <MapSection />
      <CustomOrderCTA />
      <FAQSection />
      <SupportCategories />
      <SocialSection />
      <ContactTrustStrip />
    </>
  );
}
