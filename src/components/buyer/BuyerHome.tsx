import React from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  Zap,
  ShoppingBag,
  Palette,
  Coffee,
  Home as HomeIcon,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight,
  Star,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Flame,
  BadgePercent,
  Heart
} from 'lucide-react';
import { Category, Store, Product, AppLanguage, AppCurrency, CartItem } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { BuyerHomeSkeleton } from '../common/SkeletonLoader';

interface BuyerHomeProps {
  categories: Category[];
  stores: Store[];
  products: Product[];
  language: AppLanguage;
  currency?: AppCurrency;
  wishlist?: string[];
  isLoading?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  onSelectStore?: (store: Store) => void;
  onVisitStore?: (storeOrId: Store | string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onExploreSearch?: () => void;
  onViewAllProducts?: () => void;
  onOpenCreateStore?: () => void;
  onOpenSellerSpace?: () => void;
}

export const BuyerHome: React.FC<BuyerHomeProps> = ({
  categories = [],
  stores = [],
  products = [],
  language = 'fr',
  currency = 'HTG',
  wishlist = [],
  isLoading = false,
  onToggleWishlist,
  onSelectCategory = (_catId: string) => {},
  onSelectStore,
  onVisitStore,
  onSelectProduct = (_p: Product) => {},
  onAddToCart = (_p: Product) => {},
  onExploreSearch,
  onViewAllProducts,
  onOpenCreateStore,
  onOpenSellerSpace,
}) => {
  const t = translations[language] || translations.fr;

  if (isLoading) {
    return <BuyerHomeSkeleton />;
  }

  const handleStoreClick = (st: Store) => {
    if (onSelectStore) {
      onSelectStore(st);
    } else if (onVisitStore) {
      onVisitStore(st);
    }
  };

  const handleExplore = () => {
    if (onExploreSearch) {
      onExploreSearch();
    } else if (onViewAllProducts) {
      onViewAllProducts();
    }
  };

  const handleSellerOpen = () => {
    if (onOpenSellerSpace) {
      onOpenSellerSpace();
    } else if (onOpenCreateStore) {
      onOpenCreateStore();
    }
  };

  // Helper to map string icon to Lucide component
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Home':
        return <HomeIcon className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const getCategoryName = (cat: Category) => {
    if (language === 'ht') return cat.nameHt;
    if (language === 'en') return cat.nameEn;
    return cat.nameFr;
  };

  const featuredProducts = products.filter((p) => p.isFeatured || p.stock > 0).slice(0, 8);
  const verifiedStores = stores.filter((s) => s.isVerified).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
      id="buyer-home-container"
    >
      {/* Hero Haitian Commerce Banner */}
      <motion.section
        id="hero-banner-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#0052CC] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-white/10"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Marketplace 100% Haïtienne & Sécurisée</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Vann. Achte. Jere.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
              An sekirite.
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
            Achetez directement auprès de boutiques locales vérifiées en Haïti. Payez en toute
            confiance via <strong className="text-white">Digicel MonCash</strong> et{' '}
            <strong className="text-white">Natcom NatCash</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-explore-btn"
              onClick={handleExplore}
              className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 group cursor-pointer"
            >
              <span>{t.home.viewAll} les produits</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-open-store-btn"
              onClick={handleSellerOpen}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{t.nav.createStore}</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Trust & Guarantee Highlights Bar */}
      <section
        id="trust-highlights-bar"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-cyan-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {t.trust.monCashVerified}
            </h3>
            <p className="text-[11px] text-slate-500">MonCash & NatCash dirèk</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {t.trust.escrowGuarantee}
            </h3>
            <p className="text-[11px] text-slate-500">Peman bloke jiskaske w resevwa l</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {t.trust.localDelivery}
            </h3>
            <p className="text-[11px] text-slate-500">Pòtoprens ak tout pwovens</p>
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section id="categories-section" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t.home.categories}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              id={`cat-card-${cat.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0066FF] dark:hover:border-[#0066FF] hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-blue-50 group-hover:text-[#0066FF] dark:group-hover:bg-blue-950/60 dark:group-hover:text-cyan-400 flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0066FF] dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                {getCategoryName(cat)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {cat.itemCount} articles
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Verified Stores Spotlight */}
      <section id="verified-stores-section" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t.home.featuredStores}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] dark:text-cyan-300 text-[10px] font-extrabold uppercase">
              Certifiées
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {verifiedStores.map((st, idx) => (
            <motion.div
              key={st.id}
              id={`store-card-${st.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => handleStoreClick(st)}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Store banner & Logo */}
              <div className="relative h-24 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={st.banner}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute -bottom-3 left-3 flex items-end gap-2">
                  <img
                    src={st.logo}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-900 shadow-md bg-white"
                  />
                </div>
              </div>

              {/* Store Details */}
              <div className="p-4 pt-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {st.name}
                    </h3>
                    {st.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#0066FF] fill-blue-50 dark:fill-blue-950 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {st.slogan}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    📍 {st.city}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{st.rating}</span>
                    <span className="text-slate-400 font-normal">({st.reviewsCount})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Products Grid */}
      <section id="popular-products-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>{t.home.popularProducts}</span>
            </h2>
            <p className="text-xs text-slate-500">Sélectionnés avec garantie de stock immédiat</p>
          </div>
          <button
            id="see-all-products-btn"
            onClick={handleExplore}
            className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.home.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((prod, idx) => {
            const isFav = wishlist.includes(prod.id);
            return (
              <motion.div
                key={prod.id}
                id={`prod-card-${prod.id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Product Image & Badges */}
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

                {/* Info & Add to Cart */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0066FF] dark:text-cyan-400 truncate">
                      {prod.storeName}
                    </p>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-[#0066FF] transition-colors leading-snug mt-0.5"
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
                      id={`add-to-cart-btn-${prod.id}`}
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
      </section>

      {/* MonCash & NatCash Banner Callout */}
      <motion.section
        id="haiti-payments-callout"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-6 bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Paiement Digital Haïti
            </span>
          </div>
          <h3 className="text-xl font-black">
            Payer directement avec votre compte Digicel ou Natcom
          </h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Aucune carte de crédit internationale requise. Vos gourdes restent sous séquestre
            protégé jusqu'à validation de livraison.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-[#E31837] text-white font-black text-xs flex items-center gap-2 shadow-md">
            <span>Digicel MonCash</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#FF6600] text-white font-black text-xs flex items-center gap-2 shadow-md">
            <span>Natcom NatCash</span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};
