import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { CartItem, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  language: AppLanguage;
  currency?: AppCurrency;
  onClose: () => void;
  onUpdateQuantity: (productId: string, qty: number, variant?: string) => void;
  onRemoveItem: (productId: string, variant?: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  language,
  currency = 'HTG',
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations.fr;

  const subtotalHTG = (items || []).reduce(
    (sum, item) => sum + ((item?.product?.price || 0) * (item?.quantity || 0)),
    0
  );
  const deliveryEstimateHTG = items.length > 0 ? 350 : 0;
  const serviceFeeHTG = items.length > 0 ? 150 : 0;
  const totalHTG = subtotalHTG + deliveryEstimateHTG + serviceFeeHTG;

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#0066FF] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.cart.title}
              </h2>
              <span className="text-[11px] text-slate-500">
                {items.length} {t.cart.itemCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
              >
                {t.cart.clearCart}
              </button>
            )}
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart items list */}
        {items.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3" id="cart-items-list">
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.selectedVariant || idx}`}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3"
              >
                {/* Product image */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {item.product.storeName}
                    {item.selectedVariant && ` • ${item.selectedVariant}`}
                  </p>
                  <p className="text-xs font-black text-[#0066FF] dark:text-cyan-400">
                    {formatPrice(item.product.price, currency)}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.productId, item.selectedVariant)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1),
                          item.selectedVariant
                        )
                      }
                      className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.selectedVariant
                        )
                      }
                      className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty cart */
          <div
            id="empty-cart-view"
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.cart.emptyTitle}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t.cart.emptySubtitle}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onContinueShopping();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] transition-all shadow-xs cursor-pointer"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        )}

        {/* Footer with totals & Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(subtotalHTG, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.deliveryEstimate}</span>
                <span>{formatPrice(deliveryEstimateHTG, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.serviceFee}</span>
                <span>{formatPrice(serviceFeeHTG, currency)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>{t.cart.total}</span>
                <span className="text-[#0066FF] dark:text-cyan-400">
                  {formatPrice(totalHTG, currency)}
                </span>
              </div>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Garantie de remboursement MG Gestion</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
