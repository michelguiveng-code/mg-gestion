import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store as StoreType,
  Product,
  Order,
  User,
  AppLanguage,
  OrderStatusType,
  Category
} from '../../types';
import { translations, formatHTG } from '../../utils/i18n';
import {
  Plus,
  Package,
  DollarSign,
  ShoppingBag,
  Star,
  CheckCircle2,
  Clock,
  Truck,
  Edit2,
  Trash2,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  X,
  CreditCard,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { HAITIAN_CITIES } from '../../data/mockData';

interface SellerDashboardProps {
  currentUser: User | null;
  store: StoreType | null;
  products: Product[];
  orders: Order[];
  categories: Category[];
  language: AppLanguage;
  onCreateStore: (storeData: Partial<StoreType>) => void;
  onAddProduct: (productData: Partial<Product>) => void;
  onUpdateProduct: (id: string, productData: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatusType, note?: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  store,
  products,
  orders,
  categories,
  language,
  onCreateStore,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const t = translations[language] || translations.fr;

  // Active subtab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodComparePrice, setProdComparePrice] = useState<number>(0);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodCategory, setProdCategory] = useState<string>('tech');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Store Onboarding Modal
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeSlogan, setStoreSlogan] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storeCategory, setStoreCategory] = useState('tech');
  const [storeCity, setStoreCity] = useState('Delmas');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('+509 ');
  const [storeMonCash, setStoreMonCash] = useState('');
  const [storeNatCash, setStoreNatCash] = useState('');

  // Pro Upgrade dialog
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // Filter store products & orders
  const storeProducts = store ? (products || []).filter((p) => p && p.storeId === store.id) : [];
  const storeOrders = store ? (orders || []).filter((o) => o && o.storeId === store.id) : [];

  const totalSalesHTG = (storeOrders || [])
    .filter((o) => o && o.paymentStatus === 'SUCCESSFUL')
    .reduce((sum, o) => sum + (o?.subtotalHTG || 0), 0);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(5000);
    setProdComparePrice(0);
    setProdStock(10);
    setProdCategory('tech');
    setProdDesc('');
    setProdImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdComparePrice(prod.comparePrice || 0);
    setProdStock(prod.stock);
    setProdCategory(prod.category);
    setProdDesc(prod.description);
    setProdImage(prod.images[0] || '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    const payload: Partial<Product> = {
      storeId: store.id,
      storeName: store.name,
      storeLogo: store.logo,
      storeCity: store.city,
      storeVerified: store.isVerified,
      name: prodName,
      price: Number(prodPrice),
      comparePrice: prodComparePrice > 0 ? Number(prodComparePrice) : undefined,
      stock: Number(prodStock),
      category: prodCategory,
      description: prodDesc,
      images: [prodImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      tags: [prodCategory, store.city.toLowerCase()]
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, payload);
    } else {
      onAddProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStore({
      sellerId: currentUser?.id || `user-seller-${Date.now()}`,
      name: storeName,
      slug: storeName.toLowerCase().replace(/\s+/g, '-'),
      slogan: storeSlogan || 'Boutik verifye sou MG Gestion',
      description: storeDesc || 'Boutik ofisyèl an Ayiti.',
      category: storeCategory,
      city: storeCity,
      address: storeAddress || 'Pòtoprens, Ayiti',
      phone: storePhone,
      monCashNumber: storeMonCash,
      natCashNumber: storeNatCash,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      subscriptionPlan: 'FREE',
    });
    setIsStoreModalOpen(false);
  };

  // If seller doesn't have a store yet, show attractive Onboarding screen
  if (!store) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6" id="seller-onboarding-view">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/70 text-[#0066FF] flex items-center justify-center mx-auto shadow-md">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Ouvrez votre Boutique sur MG Gestion
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vendez vos produits à des milliers de clients en Haïti. Recevez vos paiements
            directement par MonCash et NatCash en toute sécurité.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Créer ma boutique en 2 minutes
          </h3>

          <form onSubmit={handleCreateStoreSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nom de la boutique *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="ex: TechAyiti Delmas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catégorie principale *
                </label>
                <select
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ville d'implantation *
                </label>
                <input
                  type="text"
                  required
                  value={storeCity}
                  onChange={(e) => setStoreCity(e.target.value)}
                  placeholder="ex: Pétion-Ville, Delmas, Cap-Haïtien..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Numéro WhatsApp / Téléphone de contact *
              </label>
              <input
                type="text"
                required
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                placeholder="+509 3700-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Numéro MonCash pour les versements
                </label>
                <input
                  type="text"
                  value={storeMonCash}
                  onChange={(e) => setStoreMonCash(e.target.value)}
                  placeholder="37829901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Numéro NatCash pour les versements
                </label>
                <input
                  type="text"
                  value={storeNatCash}
                  onChange={(e) => setStoreNatCash(e.target.value)}
                  placeholder="41209901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              id="confirm-create-store-btn"
              className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Lancer ma Boutique sur MG Gestion
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
      id="seller-dashboard-container"
    >
      {/* Top Banner with Store identity & Pro status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md"
      >
        <div className="flex items-center gap-4">
          <img
            src={store.logo}
            alt={store.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 bg-white shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{store.name}</h1>
              {store.isVerified && (
                <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Vérifié</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              📍 {store.city} • Tél: {store.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Abonnement Vendeur Pro</span>
          </button>

          <button
            id="seller-add-product-btn"
            onClick={openAddProductModal}
            className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.seller.addProduct}</span>
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.seller.dashboard}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.seller.products} ({storeProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.seller.orders} ({storeOrders.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.seller.totalRevenue}</span>
              <p className="text-lg sm:text-xl font-black text-emerald-600">
                {formatHTG(totalSalesHTG)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.seller.totalOrders}</span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {storeOrders.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.seller.activeProducts}</span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {storeProducts.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.seller.storeRating}</span>
              <p className="text-lg sm:text-xl font-black text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{store.rating}</span>
                <span className="text-xs text-slate-400 font-normal">({store.reviewsCount})</span>
              </p>
            </motion.div>
          </div>

          {/* Recent Orders to Fulfill */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Commandes Récentes à Traiter ({storeOrders.length})
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#0066FF] hover:underline"
              >
                Voir tout
              </button>
            </div>

            {storeOrders.length > 0 ? (
              <div className="space-y-3">
                {storeOrders.slice(0, 3).map((ord, idx) => (
                  <motion.div
                    key={ord.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Client : {ord.buyerName} ({ord.buyerPhone}) • {ord.deliveryAddress.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {formatHTG(ord.totalAmountHTG)}
                      </span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as OrderStatusType)
                        }
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-hidden"
                      >
                        <option value="CREATED">CREATED</option>
                        <option value="PAID">PAID</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="IN_DELIVERY">IN_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                Aucune nouvelle commande pour le moment.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Catalogue Produits ({storeProducts.length})
            </h3>
            <button
              onClick={openAddProductModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-xs hover:bg-[#0052CC] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.seller.addProduct}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeProducts.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                whileHover={{ y: -3 }}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex gap-3.5 shadow-xs"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-[#0066FF] dark:text-cyan-400">
                      {formatHTG(prod.price)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Stock : {prod.stock} unités
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openEditProductModal(prod)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 text-xs flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Gestion des Commandes Vendeur ({storeOrders.length})
          </h3>

          <div className="space-y-3">
            {storeOrders.map((ord, idx) => (
              <motion.div
                key={ord.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-[#0066FF]">
                      {ord.orderNumber}
                    </span>
                    <p className="text-xs text-slate-500">
                      Client : <strong>{ord.buyerName}</strong> • {ord.buyerPhone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Statut :</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        onUpdateOrderStatus(ord.id, e.target.value as OrderStatusType)
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      <option value="CREATED">CREATED (Créée)</option>
                      <option value="PAID">PAID (Payée)</option>
                      <option value="CONFIRMED">CONFIRMED (Confirmée)</option>
                      <option value="PREPARING">PREPARING (En préparation)</option>
                      <option value="IN_DELIVERY">IN_DELIVERY (En livraison)</option>
                      <option value="DELIVERED">DELIVERED (Livrée)</option>
                      <option value="CANCELLED">CANCELLED (Annulée)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Articles</span>
                    {ord.items.map((it, idx) => (
                      <p key={idx} className="text-slate-700 dark:text-slate-300">
                        {it.quantity}x {it.productName} ({formatHTG(it.price)})
                      </p>
                    ))}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Adresse de livraison</span>
                    <p className="text-slate-700 dark:text-slate-300">
                      📍 {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingProduct ? t.seller.editProduct : t.seller.addProduct}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.seller.productName} *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="ex: Samsung Galaxy A55 5G"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.seller.productPrice} *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.seller.productStock} *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.seller.productCategory} *
                </label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  URL de l'image principale
                </label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.seller.productDesc}
                </label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Détails du produit..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t.seller.saveProduct}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pro Upgrade Modal */}
      {isProModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.seller.proBadge}
              </h3>
              <button
                onClick={() => setIsProModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
              <span className="text-lg font-black text-amber-900 dark:text-amber-300">
                750 HTG / mois
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {t.seller.proBenefits}
              </p>
            </div>

            <button
              onClick={() => {
                alert('Abonnement Pro activé avec succès !');
                setIsProModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Souscrire avec MonCash / NatCash
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
