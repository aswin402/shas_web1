/* ──────────────────────────────────────────────
   SHAS Jewellery — Contact Page Data
   ────────────────────────────────────────────── */

/* ── Types ── */

export interface ContactOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  info: string;
  cta: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CustomProcessStep {
  number: string;
  title: string;
}

export interface ContactTrustItem {
  icon: string;
  label: string;
}

export interface StoreDetail {
  icon: string;
  label: string;
  value: string;
}

export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface InquiryOption {
  label: string;
  value: string;
}

export interface GuidanceItem {
  label: string;
}

/* ── Contact Options ── */

export const contactOptions: ContactOption[] = [
  {
    id: 'call',
    icon: '📞',
    title: 'Call Us',
    description:
      'Speak with our team for product guidance and order support.',
    info: '+91 98765 43210',
    cta: 'Call Now',
    href: 'tel:+919876543210',
  },
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'WhatsApp',
    description:
      'Send product references, custom jewellery requests, or quick questions.',
    info: 'Chat with SHAS Jewellery',
    cta: 'Open WhatsApp',
    href: 'https://wa.me/919876543210',
  },
  {
    id: 'email',
    icon: '✉️',
    title: 'Email',
    description:
      'For detailed inquiries, bulk orders, collaborations, or support.',
    info: 'support@shasjewellery.com',
    cta: 'Send Email',
    href: 'mailto:support@shasjewellery.com',
  },
  {
    id: 'visit',
    icon: '🏛️',
    title: 'Visit / Showroom',
    description:
      'Explore selected pieces and discuss custom requirements in person.',
    info: 'Periyar Nagar, Erode, Tamil Nadu, India',
    cta: 'Get Directions',
    href: 'https://maps.app.goo.gl/TPyzzbEHRfyPZrUX6',
  },
];

/* ── FAQ Items ── */

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How long does it take to get a reply?',
    answer:
      'We usually reply within 24 hours on working days.',
  },
  {
    id: 'faq-2',
    question: 'Can I send a reference image for a custom jewellery design?',
    answer:
      'Yes. You can upload it through the contact form or send it directly on WhatsApp.',
  },
  {
    id: 'faq-3',
    question: 'Do you help me choose the right necklace or bangle size?',
    answer:
      'Yes. Share your specifications and we\'ll suggest suitable sizes, links, and dimensions.',
  },
  {
    id: 'faq-4',
    question: 'Do you provide bulk or bridal collection orders?',
    answer:
      'Yes. Contact us with your requirement, quantity, metal choice, and timeline.',
  },
  {
    id: 'faq-5',
    question: 'Are all your products hallmarked?',
    answer:
      'Absolutely. Every piece of gold jewellery from SHAS is 100% BIS Hallmarked, ensuring purity and authenticity.',
  },
  {
    id: 'faq-6',
    question: 'Do you ship across India?',
    answer:
      'Yes. We provide 100% insured, secure delivery across India.',
  },
];

/* ── Support Categories ── */

export const supportCategories: SupportCategory[] = [
  {
    id: 'sc-1',
    icon: '🔍',
    title: 'Product Selection',
    description: 'Help choosing the right design, metal, size, or style for your occasion.',
  },
  {
    id: 'sc-2',
    icon: '✏️',
    title: 'Custom Design Orders',
    description: 'Share your reference image, weight, material, and budget for a custom piece.',
  },
  {
    id: 'sc-3',
    icon: '🚚',
    title: 'Shipping & Delivery',
    description: 'Track your order, delivery timeline, or secure transit queries.',
  },
  {
    id: 'sc-4',
    icon: '🏛️',
    title: 'Bulk / Bridal Orders',
    description: 'Multiple matching sets for weddings, events, or gifting needs.',
  },
  {
    id: 'sc-5',
    icon: '📦',
    title: 'Exchange & Polish Support',
    description: 'Inquire about exchange policies, buybacks, or lifetime repolishing.',
  },
  {
    id: 'sc-6',
    icon: '🤝',
    title: 'Collaboration',
    description: 'Partner with us for bridal features, retail representation, or design projects.',
  },
];

/* ── Custom Order Process Steps ── */

export const customProcessSteps: CustomProcessStep[] = [
  { number: '01', title: 'Share Reference' },
  { number: '02', title: 'Choose Metal & Stones' },
  { number: '03', title: 'Confirm Size & Budget' },
  { number: '04', title: 'Craft & Deliver' },
];

/* ── Trust Strip Items ── */

export const contactTrustItems: ContactTrustItem[] = [
  { icon: '📦', label: '100% Insured Shipping' },
  { icon: '✋', label: 'Handcrafted Artistry' },
  { icon: '✨', label: 'BIS Hallmarked Purity' },
  { icon: '🎨', label: 'Bespoke Custom Orders' },
];

/* ── Store Details ── */

export const storeDetails: StoreDetail[] = [
  {
    icon: '🕐',
    label: 'Business Hours',
    value: 'Mon – Sat: 10:00 AM – 7:30 PM\nSunday: Closed',
  },
  {
    icon: '📍',
    label: 'Address',
    value: 'SHAS Jewellery Showroom\nPeriyar Nagar, Erode, Tamil Nadu, India',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'support@shasjewellery.com',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 98765 43210',
  },
  {
    icon: '⏳',
    label: 'Support Time',
    value: 'Replies within 24 hours on working days',
  },
];

/* ── Social Links ── */

export const socialLinks: SocialLink[] = [
  { icon: '📸', label: 'Instagram', href: '#' },
  { icon: '👤', label: 'Facebook', href: 'https://www.facebook.com/people/Shas-Jewellers/61589777022840/?ref=NONE_xav_ig_profile_page_web' },
  { icon: '📌', label: 'Pinterest', href: '#' },
  { icon: '▶️', label: 'YouTube', href: '#' },
];

/* ── Inquiry Type Options ── */

export const inquiryOptions: InquiryOption[] = [
  { label: 'Product Question', value: 'product-question' },
  { label: 'Custom Design Order', value: 'custom-order' },
  { label: 'Shipping & Delivery', value: 'shipping' },
  { label: 'Bulk / Bridal Order', value: 'bulk-order' },
  { label: 'Exchange & Buyback', value: 'exchange-buyback' },
  { label: 'Collaboration', value: 'collaboration' },
  { label: 'Other', value: 'other' },
];

/* ── Preferred Material Options ── */

export const materialOptions: InquiryOption[] = [
  { label: 'Not Sure', value: 'not-sure' },
  { label: '22k Yellow Gold', value: '22k-gold' },
  { label: '18k Rose Gold', value: '18k-gold' },
  { label: '92.5 Sterling Silver', value: 'sterling-silver' },
  { label: 'Temple (Gold Plated)', value: 'temple-plated' },
  { label: 'Gemstone Embedded', value: 'gemstone' },
];

/* ── Budget Range Options ── */

export const budgetOptions: InquiryOption[] = [
  { label: 'Not Sure', value: 'not-sure' },
  { label: 'Under ₹5,000', value: 'under-5000' },
  { label: '₹5,000 – ₹19,999', value: '5000-19999' },
  { label: '₹20,000 – ₹49,999', value: '20000-49999' },
  { label: '₹50,000 – ₹99,999', value: '50000-99999' },
  { label: 'Above ₹1,00,000', value: 'above-100000' },
];

/* ── Help Panel Guidance Items ── */

export const guidanceItems: GuidanceItem[] = [
  { label: 'Metal purity advice' },
  { label: 'Size & fit guidelines' },
  { label: 'Bespoke customization' },
  { label: 'Safe vault delivery support' },
];
