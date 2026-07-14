import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, AlertCircle, Upload, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? -1 : Number(val)),
    z.number({ error: 'Price must be a number' })
     .min(0, 'Price must be a non-negative number')
  ) as unknown as z.ZodType<number, any, any>,
  stock: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? -1 : Number(val)),
    z.number({ error: 'Stock must be a number' })
     .int('Stock must be a non-negative integer')
     .min(0, 'Stock must be a non-negative integer')
  ) as unknown as z.ZodType<number, any, any>,
  description: z.string().optional().or(z.literal('')),
  image_url: z.string().refine((val) => {
    if (val === '') return true;
    if (val.startsWith('data:image/')) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: 'Please enter a valid image URL or upload an image file'
  }),
});

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  rating?: number;
  reviews_count?: number;
  details?: {
    dimensions: string;
    material: string;
    usage: string;
    colorFinish: string;
  };
  is_featured?: boolean;
  created_at?: string;
}

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: DbProduct | null;
  onSave: (values: ProductFormValues) => Promise<void>;
}

export function ProductFormModal({ isOpen, onClose, product, onSave }: ProductFormModalProps) {
  const [modalError, setModalError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: undefined,
      stock: undefined,
      description: '',
      image_url: '',
    },
  });

  const imageUrl = watch('image_url');

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setModalError(null);
      setUploadStatus(null);
      setUploading(false);
      if (product) {
        reset({
          name: product.name || '',
          category: product.category || '',
          price: product.price,
          stock: product.stock,
          description: product.description || '',
          image_url: product.image_url || '',
        });
      } else {
        reset({
          name: '',
          category: '',
          price: undefined,
          stock: undefined,
          description: '',
          image_url: '',
        });
      }
    }
  }, [isOpen, product, reset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Uploading image...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to Supabase storage bucket 'product-images'
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Retrieve public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setValue('image_url', publicUrl, { shouldValidate: true });
      setUploadStatus('Image uploaded successfully to storage!');
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to base64...', err);
      
      // Fallback: Read file locally as Base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setValue('image_url', reader.result, { shouldValidate: true });
          setUploadStatus('Image loaded successfully (local base64 fallback)');
        }
      };
      reader.onerror = () => {
        setUploadStatus('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const onSubmit = async (data: ProductFormValues) => {
    setModalError(null);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      const err = error as Error;
      setModalError(err.message || 'Failed to save product.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content container */}
      <div className="bg-white border border-border/40 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-fade-in max-h-[90vh] flex flex-col text-deep-brown">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-cream/40">
          <h3 className="text-xl font-heading font-semibold text-deep-brown tracking-wide">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-brown hover:text-deep-brown hover:bg-cream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {modalError && (
            <div className="p-4 bg-temple-red/10 border border-temple-red/20 text-deep-brown rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-temple-red flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Save Error</h4>
                <p className="text-xs text-muted-brown mt-1">{modalError}</p>
              </div>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-1.5">
            <label htmlFor="name-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
              Product Name
            </label>
            <input
              id="name-input"
              type="text"
              {...register('name')}
              placeholder="e.g. Bronze Dancing Shiva"
              className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
            />
            {errors.name && (
              <p className="text-xs text-temple-red font-medium tracking-wide">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label htmlFor="category-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
              Category
            </label>
            <input
              id="category-input"
              type="text"
              {...register('category')}
              placeholder="e.g. Temple, Home Decor, Living Room"
              className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
            />
            {errors.category && (
              <p className="text-xs text-temple-red font-medium tracking-wide">{errors.category.message}</p>
            )}
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="price-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
                Price
              </label>
              <input
                id="price-input"
                type="number"
                step="any"
                {...register('price')}
                placeholder="0"
                className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
              />
              {errors.price?.message && (
                <p className="text-xs text-temple-red font-medium tracking-wide">{errors.price.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="stock-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
                Stock
              </label>
              <input
                id="stock-input"
                type="number"
                {...register('stock')}
                placeholder="0"
                className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200"
              />
              {errors.stock?.message && (
                <p className="text-xs text-temple-red font-medium tracking-wide">{errors.stock.message as string}</p>
              )}
            </div>
          </div>

          {/* Image URL & File Upload */}
          <div className="space-y-3">
            <label htmlFor="image-url-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
              Image URL
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Preview Box */}
              <div className="sm:col-span-1 border border-border/30 rounded-lg bg-cream/20 flex items-center justify-center overflow-hidden h-28 relative group">
                {imageUrl ? (
                  <>
                    <img 
                      src={imageUrl} 
                      alt="Product Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('image_url', '', { shouldValidate: true })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-semibold uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <div className="text-center p-3 text-muted-brown/40">
                    <Package className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[10px] uppercase font-semibold">No Image</span>
                  </div>
                )}
              </div>

              {/* Upload & Input Controls */}
              <div className="sm:col-span-2 space-y-2.5">
                {/* File Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="image-file-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-file-input"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-dashed border-border/40 hover:border-temple-red/40 rounded-lg cursor-pointer text-xs font-semibold uppercase tracking-wider transition-all bg-cream/15 text-muted-brown hover:text-deep-brown ${
                      uploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-temple-red" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload from Device
                      </>
                    )}
                  </label>
                </div>

                {/* Direct Text Input */}
                <input
                  type="text"
                  id="image-url-input"
                  {...register('image_url')}
                  placeholder="Or paste external image URL..."
                  className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2 text-deep-brown placeholder-muted-brown/35 text-xs focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {uploadStatus && (
              <p className={`text-[10px] font-semibold tracking-wide uppercase ${
                uploadStatus.includes('successfully') || uploadStatus.includes('loaded')
                  ? 'text-green-600'
                  : 'text-temple-red'
              }`}>
                {uploadStatus}
              </p>
            )}

            {errors.image_url && (
              <p className="text-xs text-temple-red font-medium tracking-wide">{errors.image_url.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description-input" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
              Description
            </label>
            <textarea
              id="description-input"
              rows={3}
              {...register('description')}
              placeholder="Enter product description and details..."
              className="w-full bg-cream/30 border border-border/35 focus:border-temple-red/30 rounded-lg px-4 py-2.5 text-deep-brown placeholder-muted-brown/35 text-sm focus:outline-none transition-all duration-200 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-temple-red font-medium tracking-wide">{errors.description.message}</p>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-border/20 flex items-center justify-end gap-3 bg-cream/20 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-border/30 text-muted-brown hover:text-deep-brown hover:bg-cream transition-all text-xs uppercase tracking-wider font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-temple-red border border-temple-red hover:bg-temple-red/90 text-cream font-semibold text-xs uppercase tracking-widest shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
