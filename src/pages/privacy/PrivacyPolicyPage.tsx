import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Shield, Eye, Lock, UserCheck, RefreshCw, Mail } from 'lucide-react';
import { TrustStrip } from '@/components/common/TrustStrip';

// ─── Data ────────────────────────────────────────────────────────────────────

const lastUpdated = 'July 14, 2026';

const sections = [
  {
    id: 'information-we-collect',
    icon: Eye,
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, billing address, shipping address, and payment information (processed securely via our payment partners — we do not store raw card data).',
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and the time and date of your visit. This data helps us understand how our site is used and improve your experience.',
      },
      {
        subtitle: 'Cookies & Tracking',
        text: 'We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of the site.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: UserCheck,
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: 'Order Processing',
        text: 'We use your personal information to process and fulfill your orders, send order confirmations and shipping updates, and handle returns and exchanges.',
      },
      {
        subtitle: 'Communication',
        text: 'With your consent, we may send you promotional emails, newsletters, and personalized product recommendations. You can unsubscribe at any time using the link in any marketing email.',
      },
      {
        subtitle: 'Site Improvement',
        text: 'We analyze usage patterns to improve our website, product catalog, and customer experience. This analysis is performed on aggregated, anonymized data wherever possible.',
      },
      {
        subtitle: 'Legal Compliance',
        text: 'We may use or disclose your information to comply with applicable laws, court orders, or government regulations, or to protect the rights, property, or safety of SHAS Jewellery, our customers, or others.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: Shield,
    title: '3. Sharing of Information',
    content: [
      {
        subtitle: 'Service Providers',
        text: 'We share your information with trusted third-party service providers who assist us in operating our website and business — including payment processors (Razorpay), shipping partners (BlueDart, Delhivery, FedEx), and email service providers. These parties are contractually obligated to keep your information confidential.',
      },
      {
        subtitle: 'We Do Not Sell Your Data',
        text: 'SHAS Jewellery does not sell, rent, or trade your personal information to any third party for their marketing purposes. Period.',
      },
      {
        subtitle: 'Business Transfers',
        text: 'If SHAS Jewellery is involved in a merger, acquisition, or asset sale, your personal data may be transferred. We will provide notice before your data is transferred and becomes subject to a different privacy policy.',
      },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    title: '4. Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your browser and our servers is protected using 256-bit SSL/TLS encryption. Our payment processing is PCI-DSS compliant.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Access to your personal information is restricted to SHAS Jewellery employees and service providers who need it to perform their job functions. All staff are trained on data privacy obligations.',
      },
      {
        subtitle: 'Breach Response',
        text: 'In the unlikely event of a data breach, we will notify affected users within 72 hours as required by applicable data protection laws, and take immediate steps to contain and remediate the breach.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: RefreshCw,
    title: '5. Your Rights',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to access the personal information we hold about you and request a copy in a machine-readable format.',
      },
      {
        subtitle: 'Correction',
        text: 'You may update your personal information at any time through your account settings or by contacting us at privacy@shasjewellery.com.',
      },
      {
        subtitle: 'Deletion',
        text: 'You may request the deletion of your account and associated personal data. Note that some information may be retained for legal, fraud prevention, or accounting purposes.',
      },
      {
        subtitle: 'Opt-Out of Marketing',
        text: 'You can opt out of marketing communications at any time by clicking "Unsubscribe" in any email or by contacting us directly. Transactional emails (order confirmations, shipping notices) will still be sent.',
      },
    ],
  },
  {
    id: 'retention',
    icon: Shield,
    title: '6. Data Retention',
    content: [
      {
        subtitle: 'Retention Period',
        text: 'We retain your personal information for as long as your account is active, as needed to provide our services, and as required to comply with our legal obligations (typically 7 years for financial records). Anonymized analytics data may be retained indefinitely.',
      },
    ],
  },
  {
    id: 'third-party-links',
    icon: Eye,
    title: '7. Third-Party Links',
    content: [
      {
        subtitle: 'External Websites',
        text: 'Our website may contain links to third-party websites (e.g., social media platforms). SHAS Jewellery is not responsible for the privacy practices of those websites. We encourage you to read their privacy policies before providing any personal information.',
      },
    ],
  },
  {
    id: 'children',
    icon: UserCheck,
    title: '8. Children\'s Privacy',
    content: [
      {
        subtitle: 'Minimum Age',
        text: 'SHAS Jewellery is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately and we will delete it.',
      },
    ],
  },
  {
    id: 'updates',
    icon: RefreshCw,
    title: '9. Updates to This Policy',
    content: [
      {
        subtitle: 'Policy Changes',
        text: `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The "Last Updated" date at the top of this page will always reflect the most recent version. Continued use of our site after updates constitutes acceptance of the revised policy.`,
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="bg-cream pt-6 pb-0 min-h-screen flex flex-col">
      <div className="max-w-[1400px] mx-auto section-padding w-full flex-1">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-brown mb-10 md:mb-14 animate-fade-up">
          <Link to="/" className="flex items-center gap-1.5 hover:text-clay transition-colors">
            <Home className="w-3.5 h-3.5 mb-0.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brown font-medium">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-14 md:mb-20 animate-fade-up">
          <p className="text-xs font-body uppercase tracking-[0.18em] text-clay font-bold mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-deep-brown mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-base font-body text-muted-brown leading-relaxed mb-4">
            At SHAS Jewellery, your privacy is sacred to us — just as the art we create. This policy explains what data we collect, how we use it, and the choices you have.
          </p>
          <p className="text-xs font-body text-muted-brown">
            Last updated: <span className="font-medium text-brown">{lastUpdated}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20 md:mb-28">

          {/* Sticky TOC — Desktop only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28">
              <p className="text-xs font-body uppercase tracking-[0.14em] text-muted-brown mb-4 font-semibold">Contents</p>
              <nav className="space-y-1.5">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm font-body text-muted-brown hover:text-clay transition-colors py-0.5"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Body */}
          <div className="flex-1 min-w-0 space-y-12">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-warm-beige flex items-center justify-center shrink-0">
                    <section.icon className="w-4 h-4 text-clay" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-deep-brown">
                    {section.title}
                  </h2>
                </div>

                <div className="pl-12 space-y-5">
                  {section.content.map((block) => (
                    <div key={block.subtitle}>
                      <h3 className="text-sm font-body font-semibold text-brown uppercase tracking-wider mb-2">
                        {block.subtitle}
                      </h3>
                      <p className="text-sm font-body text-muted-brown leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  ))}
                </div>

                {i < sections.length - 1 && (
                  <div className="mt-10 border-b border-border/40" />
                )}
              </section>
            ))}

            {/* Contact Block */}
            <section className="scroll-mt-28 animate-fade-up bg-ivory border border-border/50 rounded-lg p-7 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-warm-beige flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-clay" />
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-deep-brown">
                  10. Contact Us
                </h2>
              </div>
              <p className="pl-12 text-sm font-body text-muted-brown leading-relaxed mb-5">
                If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please don't hesitate to reach out:
              </p>
              <div className="pl-12 space-y-2 text-sm font-body text-brown">
                <p><span className="text-muted-brown">Email: </span><a href="mailto:privacy@shasjewellery.com" className="text-clay hover:underline">privacy@shasjewellery.com</a></p>
                <p><span className="text-muted-brown">Address: </span>SHAS Jewellery Studio, Erode, Tamil Nadu, India</p>
                <p><span className="text-muted-brown">Phone: </span>+91 98765 43210</p>
              </div>
              <div className="pl-12 mt-6">
                <Link
                  to="/contact"
                  className="inline-block px-7 py-2.5 bg-clay text-white font-body font-semibold uppercase tracking-widest text-xs rounded hover:bg-burnt-gold transition-colors shadow-sm"
                >
                  Contact Support
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-border/50">
        <TrustStrip />
      </div>
    </main>
  );
}
