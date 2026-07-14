import { ShieldCheck } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export function OrderSummary({ subtotal }: OrderSummaryProps) {
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <div className="bg-ivory border border-border/50 rounded-lg p-6 lg:p-8 sticky top-28">
      <h2 className="text-xl font-heading font-semibold text-deep-brown mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 text-sm font-body">
        <div className="flex justify-between text-brown">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-brown">
          <span>Shipping</span>
          <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-muted-brown text-right">Free shipping on orders over ₹5,000</p>
        )}
        <div className="flex justify-between text-brown">
          <span>Taxes</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
      </div>

      <div className="border-t border-border/50 pt-4 mb-8">
        <div className="flex justify-between items-end">
          <span className="font-body text-brown font-medium">Estimated Total</span>
          <span className="text-2xl font-heading font-semibold text-deep-brown">{formatPrice(total)}</span>
        </div>
      </div>

      <button className="w-full h-12 flex items-center justify-center bg-temple-red text-cream font-body font-semibold uppercase tracking-[0.12em] text-xs rounded-md hover:bg-deep-red transition-all duration-300 active:scale-[0.98] mb-4">
        Proceed to Checkout
      </button>

      <div className="flex items-center justify-center gap-2 text-xs font-body text-muted-brown">
        <ShieldCheck className="w-4 h-4 text-clay" />
        Secure Checkout
      </div>

      {/* Trust Badges placeholder */}
      <div className="mt-8 pt-6 border-t border-border/50 flex justify-center gap-3 opacity-60 grayscale">
        <div className="h-6 w-10 bg-border/40 rounded-sm"></div>
        <div className="h-6 w-10 bg-border/40 rounded-sm"></div>
        <div className="h-6 w-10 bg-border/40 rounded-sm"></div>
        <div className="h-6 w-10 bg-border/40 rounded-sm"></div>
      </div>
    </div>
  );
}
