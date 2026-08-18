import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store as StoreType,
  Product,
  Order,
  PaymentTransaction,
  AppLanguage,
} from '../../types';
import { translations, formatHTG } from '../../utils/i18n';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Store,
  Package,
  Layers,
  Search,
  Filter,
  Eye,
  Sliders,
  Check,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  stores: StoreType[];
  products: Product[];
  orders: Order[];
  transactions: PaymentTransaction[];
  language: AppLanguage;
  onToggleStoreVerification: (storeId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stores,
  products,
  orders,
  transactions,
  language,
  onToggleStoreVerification,
  onDeleteProduct,
  onRefreshData,
}) => {
  const t = translations[language] || translations.fr;
  const [adminTab, setAdminTab] = useState<'overview' | 'stores' | 'products' | 'transactions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalGMV = (orders || [])
    .filter((o) => o && o.paymentStatus === 'SUCCESSFUL')
    .reduce((sum, o) => sum + (o?.totalAmountHTG || 0), 0);

  const platformCommissionsHTG = Math.round(totalGMV * 0.035); // 3.5% commission

  const successfulTxnCount = (transactions || []).filter((tx) => tx && tx.status === 'SUCCESS').length;
  const verifiedStoresCount = (stores || []).filter((s) => s && s.isVerified).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
      id="admin-dashboard-container"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black">{t.admin.title}</h1>
            <span className="text-[10px] uppercase font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-800">
              Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Contrôle des flux financiers MonCash/NatCash, modération des boutiques et litiges.
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          Actualiser les métriques
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.admin.overview}
        </button>
        <button
          onClick={() => setAdminTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'stores'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.admin.stores} ({stores.length})
        </button>
        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'products'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.admin.products} ({products.length})
        </button>
        <button
          onClick={() => setAdminTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'transactions'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.admin.transactions} ({transactions.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.admin.totalGMV}</span>
              <p className="text-lg sm:text-xl font-black text-emerald-600">
                {formatHTG(totalGMV)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.admin.platformCommissions}</span>
              <p className="text-lg sm:text-xl font-black text-[#0066FF] dark:text-cyan-400">
                {formatHTG(platformCommissionsHTG)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">Boutiques Validées</span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {verifiedStoresCount} / {stores.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
            >
              <span className="text-[11px] text-slate-500 font-semibold">Transactions MonCash/NatCash</span>
              <p className="text-lg sm:text-xl font-black text-amber-500">
                {successfulTxnCount}
              </p>
            </motion.div>
          </div>

          {/* Pending Verifications & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-[#0066FF]" />
                <span>Boutiques enregistrées</span>
              </h3>
              <div className="space-y-3">
                {stores.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.logo}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.city} • {s.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleStoreVerification(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        s.isVerified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {s.isVerified ? '✓ Vérifié' : 'En attente'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Derniers Paiements Opérateurs</span>
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {tx.transactionRef}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {tx.method} • {tx.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600">
                        +{formatHTG(tx.amountHTG)}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleTimeString('fr-HT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* STORES TAB */}
      {adminTab === 'stores' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                whileHover={{ y: -3 }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.logo}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</h4>
                    <p className="text-[11px] text-slate-500">📍 {s.address}, {s.city}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Contact: {s.phone}</p>
                  {s.monCashNumber && <p className="text-red-600">MonCash: {s.monCashNumber}</p>}
                  {s.natCashNumber && <p className="text-orange-600">NatCash: {s.natCashNumber}</p>}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-amber-500 font-bold">★ {s.rating}</span>
                  <button
                    onClick={() => onToggleStoreVerification(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      s.isVerified
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                    }`}
                  >
                    {s.isVerified ? 'Révoquer le badge' : 'Approuver & Vérifier'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* PRODUCTS MODERATION TAB */}
      {adminTab === 'products' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3 shadow-xs"
              >
                <img
                  src={p.images[0]}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{p.storeName}</p>
                  <p className="text-xs font-black text-[#0066FF]">{formatHTG(p.price)}</p>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                  >
                    Supprimer du marketplace
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TRANSACTIONS AUDIT TAB */}
      {adminTab === 'transactions' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Journal d'Audit des Paiements MonCash & NatCash
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Référence TXN</th>
                  <th className="p-3">Opérateur</th>
                  <th className="p-3">Numéro</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Horodatage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-[#0066FF]">{tx.transactionRef}</td>
                    <td className="p-3 font-semibold">{tx.method}</td>
                    <td className="p-3 font-mono">{tx.phone}</td>
                    <td className="p-3 font-black text-slate-900 dark:text-white">
                      {formatHTG(tx.amountHTG)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(tx.createdAt).toLocaleString('fr-HT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
