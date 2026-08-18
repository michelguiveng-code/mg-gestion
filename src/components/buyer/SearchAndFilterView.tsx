import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Plus,
  ArrowUpDown,
  Store as StoreIcon,
  CheckCircle2,
  PackageOpen,
  Heart
} from 'lucide-react';
import { Product, Store, Category, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { HAITIAN_CITIES } from '../../data/mockData';
import {
  SearchAndFilterSkeleton,
  ProductCardSkeleton,
  StoreCardSkeleton,
} from '../common/SkeletonLoader';

interface SearchAndFilterViewProps {
  products: Product[];
  stores: Store[];
  categories: Category[];
  language: AppLanguage;
  currency?: AppCurrency;
  wishlist?: string[];
  isLoading?: boolean;
  onToggleWishlist?: (productId: string) => void;
  initialQuery?: string;
  initialSearchQuery?: string;
  initialCategory?: string;
  selectedCategory?: string | null;
  onSelectProduct?: (product: Product) => void;
  onSelectStore?: (store: Store) => void;
  onVisitStore?: (storeOrId: Store | string) => void;
  onAddToCart?: (product: Product) => void;
  onBackToHome?: () => void;
}

export const SearchAndFilterView: React.FC<SearchAndFilterViewProps> = ({
  products = [],
  stores = [],
  categories = [],
  language = 'fr',
  currency = 'HTG',
  wishlist = [],
  isLoading = false,
  onToggleWishlist,
  initialQuery = '',
  initialSearchQuery = '',
  initialCategory = 'all',
  selectedCategory: propCategory,
  onSelectProduct = (_p: Product) => {},
  onSelectStore,
  onVisitStore,
  onAddToCart = (_p: Product) => {},
  onBackToHome,
}) => {
  const t = translations[language] || translations.fr;

  const [query, setQuery] = useState(initialSearchQuery || initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    propCategory !== undefined && propCategory !== null ? propCategory : initialCategory
  );
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');

  const handleStoreClick = (st: Store) => {
    if (onSelectStore) {
      onSelectStore(st);
    } else if (onVisitStore) {
      onVisitStore(st);
    }
  };

  if (isLoading) {
    return <SearchAndFilterSkeleton activeTab={activeTab} />;
  }

  // List all cities flat
  const allCities = useMemo(() => {
    const list = new Set<string>();
    Object.values(HAITIAN_CITIES).forEach((cities) => cities.forEach((c) => list.add(c)));
    return Array.from(list).sort();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Query match
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchStore = p.storeName.toLowerCase().includes(q);
          const matchTag = p.tags?.some((tag) => tag.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchStore && !matchTag) return false;
        }

        // Category match
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // City match
        if (selectedCity !== 'all' && p.storeCity !== selectedCity) {
          return false;
        }

        // Stock match
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Verified store match
        if (verifiedOnly && !p.storeVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, query, selectedCategory, selectedCity, inStockOnly, verifiedOnly, sortBy]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCity = s.city.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchDesc) return false;
      }
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      if (selectedCity !== 'all' && s.city !== selectedCity) {
        return false;
      }
      if (verifiedOnly && !s.isVerified) {
        return false;
      }
      return true;
    });
  }, [stores, query, selectedCategory, selectedCity, verifiedOnly]);

  const getCategoryName = (cat: Category) => {
    if (language === 'ht') return cat.nameHt;
    if (language === 'en') return cat.nameEn;
    return cat.nameFr;
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setInStockOnly(false);
    setVerifiedOnly(false);
    setSortBy('relevance');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
      id="search-filter-container"
    >
      {/* Search Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        {/* Main Search Input */}
        <div className="relative">
          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab switch: Products vs Stores */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <button
              id="tab-products-btn"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Produits ({filteredProducts.length})
            </button>
            <button
              id="tab-stores-btn"
              onClick={() => setActiveTab('stores')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'stores'
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Boutiques ({filteredStores.length})
            </button>
          </div>

          {(selectedCategory !== 'all' || selectedCity !== 'all' || inStockOnly || verifiedOnly || query) && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0066FF]"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Ville / Commune
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0066FF]"
            >
              <option value="all">Toute Haïti</option>
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown (only for products) */}
          {activeTab === 'products' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0066FF]"
              >
                <option value="relevance">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          )}

          {/* Quick Checkbox Toggles */}
          <div className="flex flex-col justify-end gap-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-[#0066FF] focus:ring-0"
              />
              <span>Boutiques vérifiées</span>
            </label>

            {activeTab === 'products' && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-0"
                />
                <span>En stock uniquement</span>
              </label>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results Content */}
      {activeTab === 'products' ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" id="search-products-grid">
            {filteredProducts.map((prod, idx) => {
              const isFav = wishlist.includes(prod.id);
              return (
                <motion.div
                  key={prod.id}
                  id={`search-prod-card-${prod.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
                >
                  {/* Image */}
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
                        {prod.storeName} · {prod.storeCity}
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
                        id={`search-add-btn-${prod.id}`}
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
          /* Empty state */
          <motion.div
            id="empty-search-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ht' ? 'Poko gen pwodui ki koresponn' : 'Aucun produit correspondant'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'ht'
                ? 'Eseye chanje mo rechèch ou a oswa retire kèk filtè.'
                : 'Essayez d\'ajuster vos filtres de recherche ou sélectionnez une autre catégorie.'}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-xs hover:bg-[#0052CC]"
            >
              Effacer tous les filtres
            </button>
          </motion.div>
        )
      ) : /* Stores Results */
      filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="search-stores-grid">
          {filteredStores.map((st, idx) => (
            <motion.div
              key={st.id}
              id={`search-store-card-${st.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              whileHover={{ y: -4 }}
              onClick={() => handleStoreClick(st)}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-24 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={st.banner}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute -bottom-3 left-3">
                  <img
                    src={st.logo}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-900 shadow-md bg-white"
                  />
                </div>
              </div>

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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {st.description}
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
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <StoreIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Aucune boutique trouvée
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aucune boutique ne correspond à vos critères de recherche.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
