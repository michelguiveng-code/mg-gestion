import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingCart,
  Store,
  Share2,
  Heart,
  ChevronRight,
  Sparkles,
  MessageCircle,
  MessageSquare
} from 'lucide-react';
import { Product, Store as StoreType, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice, formatHTG } from '../../utils/i18n';

interface ProductDetailModalProps {
  product: Product | null;
  store?: StoreType;
  language: AppLanguage;
  currency?: AppCurrency;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariant?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedVariant?: string) => void;
  onVisitStore: (storeId: string) => void;
  onOpenChatWithStore?: (store: StoreType, product?: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  store,
  language,
  currency = 'HTG',
  isWishlisted = false,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  onVisitStore,
  onOpenChatWithStore,
}) => {
  if (!product) return null;

  const t = translations[language] || translations.fr;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.[0]?.options[0] || ''
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // WhatsApp Link
  const phone = store?.phone || '+509 3788-2940';
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^509/, '');
  const waMsg = `Bonjou! Mwen enterese nan pwodui "${product.name}" (${formatPrice(product.price, currency)}) sou MG Gestion. Èske li disponib toujou?`;
  const whatsappUrl = `https://wa.me/509${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div
      id="product-detail-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="product-detail-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top bar with close */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-cyan-400">
              {product.category.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleWishlist?.(product.id)}
              className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
              }`}
              title="Mete nan Favori"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              id="close-product-detail-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isCopied && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
              Lien du produit copié dans le presse-papier !
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Product Images Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    ÉCONOMISEZ {formatPrice(product.comparePrice - product.price, currency)}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#0066FF] scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Direct Seller Contact Buttons */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Kominike dirèkteman ak machann nan :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  {store && onOpenChatWithStore && (
                    <button
                      onClick={() => onOpenChatWithStore(store, product)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Dirèk</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Info & Options */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Store mini link */}
                <div
                  id="product-store-link"
                  onClick={() => onVisitStore(product.storeId)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {product.storeName}
                  </span>
                  {product.storeVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] fill-blue-50 dark:fill-blue-950" />
                  )}
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>

                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} avis)</span>
                  </div>

                  <span
                    className={`font-semibold ${
                      product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0
                      ? `✓ ${product.stock} ${t.product.stockAvailable}`
                      : '✗ ' + t.home.outOfStock}
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {formatPrice(product.price, currency)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(product.comparePrice, currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Paiement garanti via MonCash / NatCash à la finalisation
                  </p>
                </div>

                {/* Variants if any */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {product.variants[0].name} :
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants[0].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedVariant === opt
                              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Quantité :
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="modal-add-cart-btn"
                    onClick={() => {
                      onAddToCart(product, quantity, selectedVariant);
                    }}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#0066FF] hover:bg-blue-100 dark:hover:bg-blue-900/80 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.product.addToCart}</span>
                  </button>

                  <button
                    id="modal-buy-now-btn"
                    onClick={() => {
                      onBuyNow(product, quantity, selectedVariant);
                    }}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{t.product.buyNow}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Livraison rapide Haïti</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Garantie MG Escrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.product.productDetails}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
