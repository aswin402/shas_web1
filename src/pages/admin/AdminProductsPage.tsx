import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useProductsQuery } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { ProductFormModal } from './components/ProductFormModal';
import { AdminTableSkeleton } from '@/components/common/LoadingSkeletons';
import { useToastStore } from '@/store/useToastStore';
import type { DbProduct, ProductFormValues } from './components/ProductFormModal';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  IndianRupee, 
  Inbox,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { data: productsData, isLoading, isError, error } = useProductsQuery();
  const products = productsData as DbProduct[] | undefined;

  if (isLoading) {
    return (
      <AdminTableSkeleton 
        title="Catalog Inventory" 
        subtitle="Manage shop collection products and stock counts" 
      />
    );
  }
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<DbProduct | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Categories helper list
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set((products || []).map((p: DbProduct) => p.category).filter(Boolean)))];
  }, [products]);

  // In-memory searching & filtering
  const filteredProducts = useMemo(() => {
    return (products || []).filter((product: DbProduct) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: DbProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formValues: ProductFormValues) => {
    setActionError(null);
    const dataToSave = {
      ...formValues,
      // If we are editing, map the current product ID
      ...(editingProduct?.id ? { id: editingProduct.id } : {}),
      // Set some defaults for details, rating, reviews if not present
      rating: editingProduct?.rating ?? 0,
      reviews_count: editingProduct?.reviews_count ?? 0,
      details: editingProduct?.details ?? {
        dimensions: '',
        material: '',
        usage: '',
        colorFinish: ''
      }
    };

    const { error: saveError } = await supabase.from('products').upsert(dataToSave);
    if (saveError) {
      setActionError(saveError.message);
      addToast(saveError.message, 'error');
      throw saveError;
    }

    addToast(
      editingProduct 
        ? `Product "${formValues.name}" updated successfully.`
        : `Product "${formValues.name}" created successfully.`,
      'success'
    );

    // Refresh query client keys so other pages get updated
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handleDeleteProduct = (product: DbProduct) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setActionError(null);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productToDelete.id);

    if (deleteError) {
      setActionError(deleteError.message);
      addToast(deleteError.message, 'error');
    } else {
      addToast(`Product "${productToDelete.name}" deleted successfully.`, 'success');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }

    setProductToDelete(null);
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-deep-brown tracking-wide">
            Products Catalog
          </h1>
          <p className="text-sm text-muted-brown uppercase tracking-widest mt-1">
            Create, Edit, and Manage store products
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-temple-red border border-temple-red hover:bg-temple-red/90 text-cream font-semibold text-xs uppercase tracking-widest shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Error alert */}
      {(isError || actionError) && (
        <div className="p-4 bg-temple-red/10 border border-temple-red/20 text-deep-brown rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-temple-red flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">System Error</h4>
            <p className="text-xs text-muted-brown mt-1">
              {actionError || error?.message || 'Failed to process operation on Supabase products.'}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/80 border border-border/40 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-brown/40" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cream/30 border border-border/25 focus:border-temple-red/30 rounded-lg pl-10 pr-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="category-select" className="text-xs font-semibold uppercase tracking-wider text-muted-brown whitespace-nowrap">
            Filter by Category
          </label>
          <select
            id="category-select"
            aria-label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 bg-cream border border-border/30 focus:border-temple-red/30 rounded-lg px-3 py-2.5 text-deep-brown text-sm focus:outline-none transition-all duration-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError ? null : filteredProducts.length === 0 ? (
        /* Empty state */
        <div className="min-h-[45vh] flex flex-col items-center justify-center gap-4 text-center px-4 border border-dashed border-border/30 rounded-xl bg-white/80 shadow-sm">
          <Inbox className="w-12 h-12 text-muted-brown/30" />
          <div>
            <h3 className="text-lg font-heading font-medium text-deep-brown">No Products Found</h3>
            <p className="text-xs text-muted-brown max-w-sm mt-1">
              There are no products matching your search query or category filters. Try resetting filters or adding a new product.
            </p>
          </div>
        </div>
      ) : (
        /* Products Table Grid */
        <div className="bg-white border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/45 border-b border-border/30">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-brown text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredProducts.map((product: DbProduct) => (
                  <tr key={product.id} className="hover:bg-cream/15 transition-colors">
                    {/* Product details info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-border/30 bg-cream"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-cream border border-border/30 flex items-center justify-center text-muted-brown">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div className="max-w-xs md:max-w-sm">
                          <h4 className="font-heading font-semibold text-deep-brown text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-brown truncate mt-0.5">{product.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-temple-red/10 border border-temple-red/10 text-temple-red">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-deep-brown text-sm">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-brown" />
                        <span>{formatCurrency(Number(product.price) || 0)}</span>
                      </div>
                    </td>

                    {/* Stock level indicators */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          (Number(product.stock) || 0) === 0 
                            ? 'bg-temple-red' 
                            : (Number(product.stock) || 0) < 5 
                              ? 'bg-amber-500 animate-pulse' 
                              : 'bg-green-500'
                        }`} />
                        <span className="text-deep-brown font-medium text-sm">
                          {product.stock} <span className="text-muted-brown text-xs font-normal">units</span>
                        </span>
                      </div>
                    </td>

                    {/* Edit/Delete Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-lg hover:bg-cream border border-transparent hover:border-border/30 text-muted-brown hover:text-deep-brown transition-all duration-200"
                          title="Edit Product"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 rounded-lg hover:bg-temple-red/10 border border-transparent hover:border-temple-red/20 text-muted-brown hover:text-temple-red transition-all duration-200"
                          title="Delete Product"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Custom Delete Confirmation Modal */}
      {productToDelete && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setProductToDelete(null)}
          />

          {/* Modal Content container */}
          <div className="bg-white border border-border/40 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 flex flex-col text-deep-brown p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-temple-red/10 border border-temple-red/25 flex items-center justify-center text-temple-red flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-semibold text-deep-brown">Delete Product</h3>
                <p className="text-sm text-muted-brown leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-deep-brown">"{productToDelete.name}"</span>? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-lg border border-border/30 text-muted-brown hover:text-deep-brown hover:bg-cream transition-all text-xs uppercase tracking-wider font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-lg bg-temple-red hover:bg-temple-red/90 text-cream font-semibold text-xs uppercase tracking-widest shadow-md transition-all duration-200"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
