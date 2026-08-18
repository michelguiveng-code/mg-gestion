import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store as StoreType,
  Product,
  AppLanguage,
  AppCurrency,
} from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { StoreProfileSkeleton } from '../common/SkeletonLoader';
import {
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  ArrowLeft,
  Plus,
  Heart,
  Share2,
  ShieldCheck,
  Package,
  Layers,
  MessageSquare,
  MessageCircle
} from 'lucide-react';

interface StoreProfileViewProps {
  store?: StoreType | null;
  products: Product[];
  language: AppLanguage;
  currency?: AppCurrency;
  wishlist?: string[];
  isLoading?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenChatWithStore?: (store: StoreType) => void;
}

export const StoreProfileView: React.FC<StoreProfileViewProps> = ({
  store,
  products = [],
  language = 'fr',
  currency = 'HTG',
  wishlist = [],
  isLoading = false,
  onToggleWishlist,
  onBack,
  onSelectProduct,
  onAddToCart,
  onOpenChatWithStore,
}) => {
  const t = translations[language] || translations.fr;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(store?.followersCount || 0);
  const [selectedCat, setSelectedCat] = useState<string>('all');

  if (isLoading) {
    return <StoreProfileSkeleton />;
  }

  if (!store) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <p className="text-slate-500">Boutique introuvable ou indisponible.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const storeProducts = (products || []).filter((p) => p && p.storeId === store.id);
  const filteredProducts =
    selectedCat === 'all'
      ? storeProducts
      : storeProducts.filter((p) => p.category === selectedCat);

  const handleToggleFollow = () => {
    if (isFollowing) {
      setFollowersCount(followersCount - 1);
      setIsFollowing(false);
    } else {
      setFollowersCount(followersCount + 1);
      setIsFollowing(true);
    }
  };

  const phone = store?.phone || '+509 3788-2940';
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^509/, '');
  const waMsg = `Bonjou! Mwen wè boutique "${store.name}" sou MG Gestion. Mwen ta renmen poze yon kesyon.`;
  const whatsappUrl = `https://wa.me/509${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
      id="store-profile-container"
    >
      {/* Back Button */}
      <button
        id="store-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back} aux boutiques</span>
      </button>

      {/* Store Header Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
      >
        {/* Banner image */}
        <div className="relative h-44 sm:h-56 bg-slate-200 dark:bg-slate-800">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="p-4 sm:p-6 relative -mt-16 sm:-mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Logo & Name */}
            <div className="flex items-end gap-3.5">
              <img
                src={store.logo}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {store.name}
                  </h1>
                  {store.isVerified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0066FF] bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      <span>{t.home.verifiedBadge}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">{store.slogan}</p>
              </div>
            </div>

            {/* Follow & Contact Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {onOpenChatWithStore && (
                <button
                  onClick={() => onOpenChatWithStore(store)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Dirèk</span>
                </button>
              )}

              <button
                id="store-follow-btn"
                onClick={handleToggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                }`}
              >
                {isFollowing ? 'Abonné(e) ✓' : '+ Suivre'}
              </button>
            </div>
          </div>

          {/* Store Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{store.address}, {store.city}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{store.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{store.rating} ({store.reviewsCount} avis)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Package className="w-4 h-4 text-[#0066FF]" />
              <span>{followersCount} abonnés</span>
            </div>
          </div>

          {/* Description & Haitian payment options */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {store.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 border-t border-slate-200/50 dark:border-slate-700/50">
              <span>Moyens de versement :</span>
              {store.monCashNumber && (
                <span className="font-bold text-[#E31837] flex items-center gap-1">
                  ● MonCash: (+509) {store.monCashNumber}
                </span>
              )}
              {store.natCashNumber && (
                <span className="font-bold text-[#FF6600] flex items-center gap-1">
                  ● NatCash: (+509) {store.natCashNumber}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Store Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Produits de la boutique ({storeProducts.length})
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod, idx) => {
              const isFav = wishlist.includes(prod.id);
              return (
                <motion.div
                  key={prod.id}
                  id={`store-prod-card-${prod.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
                >
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.comparePrice && prod.comparePrice > prod.price && (
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        PROMO
                      </span>
                    )}
                    {onToggleWishlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(prod.id);
                        }}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs transition-colors ${
                          isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-500 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <span>{prod.rating}</span>
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(prod)}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-[#0066FF] transition-colors leading-snug"
                      >
                        {prod.name}
                      </h3>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {formatPrice(prod.price, currency)}
                        </p>
                        {prod.comparePrice && prod.comparePrice > prod.price && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatPrice(prod.comparePrice, currency)}
                          </p>
                        )}
                      </div>

                      <button
                        id={`store-add-btn-${prod.id}`}
                        onClick={() => onAddToCart(prod)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#0066FF] hover:bg-[#0066FF] hover:text-white dark:hover:bg-[#0066FF] transition-all shadow-xs cursor-pointer"
                        title={t.product.addToCart}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <p className="text-xs text-slate-500">
              Aucun produit dans cette boutique pour le moment.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
