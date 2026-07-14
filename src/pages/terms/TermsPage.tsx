import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FileText, ShoppingBag, Shield, AlertTriangle, Scale, RefreshCw, Mail } from 'lucide-react';
import { TrustStrip } from '@/components/common/TrustStrip';

// ─── Data ────────────────────────────────────────────────────────────────────

const lastUpdated = 'July 14, 2026';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement',
        text: 'By accessing or using the SHAS Jewellery website (shasjewellery.com), placing an order, or creating an account, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use our website or services.',
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 18 years of age to place an order on SHAS Jewellery. By using our site, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding agreement.',
      },
    ],
  },
  {
    id: 'products-ordering',
    icon: ShoppingBag,
    title: '2. Products & Ordering',
    content: [
      {
        subtitle: 'Product Descriptions',
        text: 'We make every effort to display our products as accurately as possible. However, colours and finishes may vary slightly depending on your monitor settings. All gold weights and gemstone sizes listed are approximate. We reserve the right to modify product descriptions, pricing, and availability without prior notice.',
      },
      {
        subtitle: 'Order Acceptance',
        text: 'Placing an order constitutes an offer to purchase. Your order is only accepted when we send you a dispatch confirmation email. We reserve the right to cancel any order at our discretion — for example, in the event of a pricing error, stock unavailability, or suspected fraud — and will provide a full refund in such cases.',
      },
      {
        subtitle: 'Custom Orders',
        text: 'Custom and made-to-order items are non-cancellable once production has commenced (typically within 24 hours of design confirmation). Full payment or a booking advance is required upfront for all custom orders. Custom pieces are non-refundable unless they arrive defective.',
      },
      {
        subtitle: 'Pricing',
        text: 'All prices on SHAS Jewellery are listed in Indian Rupees (INR) unless otherwise specified. Prices are inclusive of applicable taxes. Shipping charges, if any, are calculated and displayed at checkout. International customers may be subject to additional customs duties and taxes imposed by the destination country, which are the buyer\'s responsibility.',
      },
    ],
  },
  {
    id: 'payment',
    icon: Shield,
    title: '3. Payment & Security',
    content: [
      {
        subtitle: 'Accepted Methods',
        text: 'We accept payments via credit/debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, and Cash on Delivery (select pin codes). International orders can be paid via Visa or Mastercard.',
      },
      {
        subtitle: 'Payment Processing',
        text: 'All online payments are processed securely through Razorpay, a PCI-DSS Level 1 compliant payment gateway. SHAS Jewellery does not store your card details on our servers.',
      },
      {
        subtitle: 'Failed Transactions',
        text: 'If a payment fails but your account is charged, the amount will typically be auto-reversed within 5–7 business days by your bank. Please contact us at payments@shasjewellery.com if you face any issues.',
      },
    ],
  },
  {
    id: 'shipping-delivery',
    icon: FileText,
    title: '4. Shipping & Delivery',
    content: [
      {
        subtitle: 'Delivery Timelines',
        text: 'Estimated delivery timelines are provided in good faith and are not guaranteed. SHAS Jewellery is not responsible for delays caused by courier partners, customs clearance, natural disasters, strikes, or other circumstances beyond our control.',
      },
      {
        subtitle: 'Risk of Loss',
        text: 'Risk of loss or damage passes to you upon dispatch of your order. All orders come with a tracking number and, for items above ₹3,000, shipping insurance. In the event of loss during transit, please contact us within 14 days of the expected delivery date.',
      },
    ],
  },
  {
    id: 'returns-refunds',
    icon: RefreshCw,
    title: '5. Returns & Refunds',
    content: [
      {
        subtitle: 'Return Eligibility',
        text: 'Items may be returned or exchanged within 7 days of delivery, provided they are unused, unaltered, and in original packaging. Custom-made, personalized, or made-to-order pieces are non-returnable unless defective.',
      },
      {
        subtitle: 'Refund Timeline',
        text: 'Approved refunds are processed within 5–7 business days of receiving the returned item. Refunds are credited to the original payment method.',
      },
      {
        subtitle: 'Full Policy',
        text: 'For complete details on our return and refund process, please refer to our Shipping & Returns Policy page.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Scale,
    title: '6. Intellectual Property',
    content: [
      {
        subtitle: 'Copyright & Trademarks',
        text: 'All content on the SHAS Jewellery website — including but not limited to text, images, graphics, logos, product photographs, and design — is the property of SHAS Jewellery or its content licensors and is protected by applicable Indian and international copyright, trademark, and intellectual property laws.',
      },
      {
        subtitle: 'Limited License',
        text: 'You may view, download, and print content from this website solely for your personal, non-commercial use. You may not reproduce, distribute, publish, modify, or create derivative works of any content without prior written consent from SHAS Jewellery.',
      },
      {
        subtitle: 'User Submissions',
        text: 'By submitting reviews, photos, or other content ("User Content") to our website, you grant SHAS Jewellery a non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, and display such content for any business purpose, including marketing and promotion.',
      },
    ],
  },
  {
    id: 'limitation-liability',
    icon: AlertTriangle,
    title: '7. Limitation of Liability',
    content: [
      {
        subtitle: 'Disclaimer of Warranties',
        text: 'SHAS Jewellery\'s website and services are provided "as is" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      },
      {
        subtitle: 'Limitation',
        text: 'To the fullest extent permitted by law, SHAS Jewellery shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of (or inability to use) our website or products. Our total liability in connection with any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    title: '8. Governing Law',
    content: [
      {
        subtitle: 'Jurisdiction',
        text: 'These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any dispute arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Erode, Tamil Nadu, India.',
      },
    ],
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: '9. Changes to Terms',
    content: [
      {
        subtitle: 'Modifications',
        text: 'SHAS Jewellery reserves the right to update these Terms & Conditions at any time. The revised version will be posted on this page with an updated "Last Updated" date. Your continued use of the website following such changes constitutes acceptance of the new terms.',
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TermsPage() {
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
          <span className="text-brown font-medium">Terms &amp; Conditions</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-14 md:mb-20 animate-fade-up">
          <p className="text-xs font-body uppercase tracking-[0.18em] text-clay font-bold mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-deep-brown mb-6 leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-base font-body text-muted-brown leading-relaxed mb-4">
            Please read these terms carefully before using SHAS Jewellery. By shopping with us, you agree to the following conditions that govern our relationship.
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
                If you have any questions, concerns, or requests regarding these Terms &amp; Conditions, please don't hesitate to reach out:
              </p>
              <div className="pl-12 space-y-2 text-sm font-body text-brown">
                <p><span className="text-muted-brown">Email: </span><a href="mailto:legal@shasjewellery.com" className="text-clay hover:underline">legal@shasjewellery.com</a></p>
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
