import { useProductsQuery } from '@/hooks/useProducts';
import { useContactSubmissions } from '@/hooks/useContactSubmissions';
import { AdminDashboardSkeleton } from '@/components/common/LoadingSkeletons';
import { 
  Database, 
  IndianRupee, 
  AlertTriangle, 
  Mail, 
  ChevronRight,
  TrendingUp,
  PackageCheck,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const { 
    data: products, 
    isLoading: productsLoading, 
    isError: productsError, 
    error: productsErrorObj 
  } = useProductsQuery();

  const { 
    data: submissions, 
    isLoading: submissionsLoading, 
    isError: submissionsError, 
    error: submissionsErrorObj 
  } = useContactSubmissions();

  if (productsLoading || submissionsLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (productsError || submissionsError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertTriangle className="w-12 h-12 text-temple-red" />
        <h3 className="text-xl font-semibold text-cream">Error Loading Dashboard Metrics</h3>
        <p className="text-sm text-sand/70 max-w-md">
          {productsErrorObj?.message || submissionsErrorObj?.message || 'Failed to retrieve administrative data from Supabase.'}
        </p>
      </div>
    );
  }

  const productList = products || [];
  const submissionList = submissions || [];

  // ── Metrics Calculations ──
  const totalCatalogItems = productList.length;
  
  const totalInventoryValue = productList.reduce((sum, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    return sum + (price * stock);
  }, 0);

  const lowStockThreshold = 5;
  const lowStockProducts = productList.filter(product => (Number(product.stock) || 0) < lowStockThreshold);
  const stockAlertsCount = lowStockProducts.length;

  const totalInquiriesCount = submissionList.length;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-semibold text-deep-brown tracking-wide">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-brown uppercase tracking-widest mt-1">
          Real-time Catalog & Inquiry Metrics
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Catalog Items */}
        <div className="bg-white/80 border border-border/40 p-6 rounded-xl relative overflow-hidden group hover:border-temple-red/30 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-temple-red/5 rounded-full blur-xl pointer-events-none group-hover:bg-temple-red/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">Catalog Products</span>
            <div className="w-10 h-10 rounded-lg bg-temple-red/15 border border-temple-red/20 text-temple-red flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-deep-brown tracking-wider">{totalCatalogItems}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-brown">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active catalog items</span>
          </div>
        </div>

        {/* Card 2: Total Inventory Value */}
        <div className="bg-white/80 border border-border/40 p-6 rounded-xl relative overflow-hidden group hover:border-temple-red/30 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-temple-red/5 rounded-full blur-xl pointer-events-none group-hover:bg-temple-red/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">Inventory Value</span>
            <div className="w-10 h-10 rounded-lg bg-temple-red/15 border border-temple-red/20 text-temple-red flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-deep-brown tracking-wider">{formatCurrency(totalInventoryValue)}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-brown">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Valuation based on price * stock</span>
          </div>
        </div>

        {/* Card 3: Stock Alerts */}
        <div className="bg-white/80 border border-border/40 p-6 rounded-xl relative overflow-hidden group hover:border-temple-red/30 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-temple-red/5 rounded-full blur-xl pointer-events-none group-hover:bg-temple-red/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">Low Stock Warnings</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              stockAlertsCount > 0 
                ? 'bg-temple-red/20 border border-temple-red/30 text-temple-red animate-pulse' 
                : 'bg-cream border border-border/30 text-muted-brown'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-deep-brown tracking-wider">{stockAlertsCount}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-brown">
            <span>Threshold: stock &lt; {lowStockThreshold} units</span>
          </div>
        </div>

        {/* Card 4: Inquiry Summaries */}
        <div className="bg-white/80 border border-border/40 p-6 rounded-xl relative overflow-hidden group hover:border-temple-red/30 transition-all duration-300 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-temple-red/5 rounded-full blur-xl pointer-events-none group-hover:bg-temple-red/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">Inquiries Received</span>
            <div className="w-10 h-10 rounded-lg bg-temple-red/15 border border-temple-red/20 text-temple-red flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-deep-brown tracking-wider">{totalInquiriesCount}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-brown">
            <Calendar className="w-3.5 h-3.5" />
            <span>Messages from contact forms</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Low Stock & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Box: Low Stock Inventory */}
        <div className="bg-white/80 border border-border/40 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-deep-brown">Low Stock Inventory</h2>
              <p className="text-xs text-muted-brown uppercase tracking-wider mt-0.5">Critical restock indicators</p>
            </div>
            <Link 
              to="/admin-dashboard/products" 
              className="text-xs text-temple-red hover:text-deep-brown flex items-center gap-1 transition-colors font-semibold"
            >
              Manage Products
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="h-48 flex items-center justify-center border border-dashed border-border/30 rounded-lg text-muted-brown/50 text-sm">
              All products are sufficiently stocked.
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {lowStockProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between p-4 bg-cream/35 border border-border/20 rounded-lg hover:border-temple-red/20 transition-all"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-deep-brown truncate">{product.name}</p>
                    <p className="text-xs text-muted-brown mt-0.5">{product.category || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    <div>
                      <p className="text-sm font-semibold text-deep-brown">{formatCurrency(product.price)}</p>
                      <p className={`text-xs font-bold mt-0.5 ${product.stock === 0 ? 'text-temple-red' : 'text-terracotta'}`}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Box: Recent Inquiries */}
        <div className="bg-white/80 border border-border/40 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-deep-brown">Recent Inquiries</h2>
              <p className="text-xs text-muted-brown uppercase tracking-wider mt-0.5">Inbox Activity</p>
            </div>
            <Link 
              to="/admin-dashboard/messages" 
              className="text-xs text-temple-red hover:text-deep-brown flex items-center gap-1 transition-colors font-semibold"
            >
              View Message Box
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {submissionList.length === 0 ? (
            <div className="h-48 flex items-center justify-center border border-dashed border-border/30 rounded-lg text-muted-brown/50 text-sm">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {submissionList.slice(0, 5).map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-4 bg-cream/35 border border-border/20 rounded-lg hover:border-temple-red/20 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-deep-brown">{sub.name}</p>
                      <p className="text-xs text-muted-brown">{sub.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-brown font-medium">{formatDate(sub.created_at)}</span>
                  </div>
                  {sub.subject && (
                    <p className="text-xs text-temple-red font-semibold uppercase tracking-wider truncate">
                      Subject: {sub.subject}
                    </p>
                  )}
                  <p className="text-xs text-brown line-clamp-2 bg-cream/60 p-2 rounded italic">
                    "{sub.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
