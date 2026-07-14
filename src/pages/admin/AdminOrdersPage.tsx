import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAdminOrdersQuery, useUpdateOrderStatusMutation, type OrderDetail } from '@/hooks/useOrders';
import { AdminTableSkeleton } from '@/components/common/LoadingSkeletons';
import {
  Search,
  Loader2,
  ShoppingBag,
  AlertCircle,
  X,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  CircleDot
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
}

function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus: OrderDetail['status']) => {
    setLocalError(null);
    try {
      await updateStatusMutation.mutateAsync({ orderId: order.id, status: newStatus });
    } catch (err) {
      const error = err as Error;
      setLocalError(error.message || 'Failed to update order status.');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white border border-border/40 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-fade-in max-h-[90vh] flex flex-col text-deep-brown">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-cream/40">
          <div>
            <h3 className="text-xl font-heading font-semibold text-deep-brown tracking-wide">
              Order Details
            </h3>
            <p className="text-xs text-muted-brown uppercase tracking-wider mt-0.5 font-mono">
              ID: {order.id}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-muted-brown hover:text-deep-brown hover:bg-cream transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {localError && (
            <div className="p-3.5 bg-temple-red/10 border border-temple-red/20 text-deep-brown rounded-lg flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-4 h-4 text-temple-red shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-cream/20 border border-border/20 rounded-lg p-3.5 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Ordered At
              </span>
              <p className="text-sm font-medium text-deep-brown">{formatDate(order.created_at)}</p>
            </div>
            <div className="bg-cream/20 border border-border/20 rounded-lg p-3.5 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Order Total
              </span>
              <p className="text-sm font-semibold text-deep-brown">₹{formatCurrency(order.total_amount)}</p>
            </div>
            <div className="bg-cream/20 border border-border/20 rounded-lg p-3.5 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5" /> Payment Status
              </span>
              <p className="text-sm font-medium text-deep-brown uppercase tracking-wider text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${
                  order.payment_status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : order.payment_status === 'Refunded'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border/20 pt-5">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <User className="w-4 h-4 text-temple-red" /> Customer Information
              </h4>
              <div className="text-sm space-y-1 pl-5">
                <p className="font-semibold">{order.shipping_address.fullName}</p>
                <p className="text-muted-brown text-xs">Account ID: {order.user_id || 'Guest/Deleted'}</p>
                <p className="text-deep-brown font-mono mt-1 text-xs">Ph: {order.shipping_address.phone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-brown flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-temple-red" /> Shipping Address
              </h4>
              <div className="text-sm pl-5 space-y-0.5 text-muted-brown">
                <p>{order.shipping_address.street}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                <p className="font-mono text-xs text-deep-brown font-semibold mt-0.5">PIN: {order.shipping_address.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Modifier */}
          <div className="border-t border-border/20 pt-5 space-y-2.5">
            <label htmlFor="fulfillment-select" className="text-xs font-bold uppercase tracking-wider text-muted-brown">
              Fulfillment Status
            </label>
            <div className="flex items-center gap-3">
              <select
                id="fulfillment-select"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderDetail['status'])}
                disabled={updateStatusMutation.isPending}
                className="bg-cream border border-border/30 focus:border-temple-red/35 rounded-lg px-4 py-2 text-sm text-deep-brown focus:outline-none transition-all duration-200"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-temple-red" />}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border-t border-border/20 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-brown">Items Summary</h4>
            <div className="border border-border/25 rounded-lg overflow-hidden bg-cream/10">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-cream/35 border-b border-border/25 text-xs uppercase tracking-wider text-muted-brown">
                    <th className="px-4 py-2.5 font-semibold">Product</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Qty</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Price</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/15">
                  {order.order_items.map((item) => (
                    <tr key={item.id} className="hover:bg-cream/10">
                      <td className="px-4 py-3 font-medium text-deep-brown">
                        {item.products ? item.products.name : 'Unknown Product'}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-brown font-mono">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        ₹{formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-xs">
                        ₹{formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/20 bg-cream/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-deep-brown bg-cream border border-border/30 hover:bg-cream/80 rounded-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function AdminOrdersPage() {
  const { data: orders, isLoading, isError, error } = useAdminOrdersQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) {
    return (
      <AdminTableSkeleton 
        title="Orders & Fulfillment" 
        subtitle="Monitor and fulfill customer shopping orders" 
        srText="Loading Client Orders..."
      />
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-temple-red/10 border border-temple-red/20 rounded-xl text-deep-brown flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-temple-red flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm">Failed to Load Orders</h3>
          <p className="text-xs text-muted-brown mt-1">{(error as Error).message || 'Database query error.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-heading font-semibold text-deep-brown tracking-wide">
          Orders & Fulfillment
        </h1>
        <p className="text-sm text-muted-brown uppercase tracking-widest mt-1">
          Monitor and fulfill customer shopping orders
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white/80 border border-border/40 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-brown/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, name, or phone number..."
            className="w-full bg-cream/30 border border-border/25 focus:border-temple-red/30 rounded-lg pl-10 pr-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="status-select" className="text-xs font-semibold uppercase tracking-wider text-muted-brown whitespace-nowrap">
            Status
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 bg-cream border border-border/30 focus:border-temple-red/30 rounded-lg px-3 py-2.5 text-deep-brown text-sm focus:outline-none transition-all duration-200"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid/Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white/80 border border-border/40 rounded-xl p-12 text-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-muted-brown/35 mx-auto mb-3 stroke-1" />
          <h3 className="text-lg font-semibold text-deep-brown">No Orders Found</h3>
          <p className="text-xs text-muted-brown mt-1 uppercase tracking-wider">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try modifying your search queries or status filters' 
              : 'There are no client orders logged in database yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/45 border-b border-border/30">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Date Placed</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-cream/20 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-deep-brown font-semibold max-w-[120px] truncate">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-deep-brown">
                        {order.shipping_address.fullName}
                      </div>
                      <div className="text-xs text-muted-brown font-mono mt-0.5">
                        {order.shipping_address.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-brown">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-deep-brown text-sm">
                      ₹{formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal portal */}
      <OrderDetailModal 
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
