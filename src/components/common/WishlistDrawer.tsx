import React from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Product, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onAddAllToCart: () => void;
  onSelectProduct: (product: Product) => void;
  language: AppLanguage;
  currency: AppCurrency;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onAddAllToCart,
  onSelectProduct,
  language,
  currency,
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations.fr;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft"
        id="wishlist-drawer"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Heart className="w-4 h-4 fill-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Lis Pwodui Prefere</h3>
                <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black">
                  {wishlistProducts.length} atik
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Pwodui ou sove pou achte pita</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Header */}
        {wishlistProducts.length > 0 && (
          <div className="px-4 py-2.5 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              Sove tout kòmand ou yo fasilman
            </span>
            <button
              onClick={onAddAllToCart}
              className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Mete tout nan Panye</span>
            </button>
          </div>
        )}

        {/* Product List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Ou poko gen favori
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Klike sou ti kè ❤️ ki sou nenpòt pwodui pou sove l epi jwenn li fasilman pita.
              </p>
            </div>
          ) : (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3 group hover:border-[#0066FF] transition-all"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  onClick={() => onSelectProduct(prod)}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <p
                    onClick={() => onSelectProduct(prod)}
                    className="font-bold text-xs text-slate-900 dark:text-white truncate cursor-pointer hover:text-[#0066FF]"
                  >
                    {prod.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{prod.storeName}</p>
                  <p className="text-xs font-black text-[#0066FF] dark:text-cyan-400 mt-1">
                    {formatPrice(prod.price, currency)}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="p-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white transition-colors cursor-pointer shadow-xs"
                    title="Mete nan panyen"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Retire nan favori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
