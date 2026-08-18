import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Store as StoreIcon,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Package,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { User, AppLanguage, AppTheme, AppCurrency, CartItem } from '../../types';
import { translations } from '../../utils/i18n';
import { Bell, Heart, DollarSign } from 'lucide-react';

interface NavbarProps {
  currentUser?: User | null;
  activeSpace?: 'BUYER' | 'SELLER' | 'ADMIN' | 'buyer' | 'seller' | 'admin';
  currentSpace?: 'BUYER' | 'SELLER' | 'ADMIN' | 'buyer' | 'seller' | 'admin';
  language?: AppLanguage;
  currency?: AppCurrency;
  onCurrencyChange?: (c: AppCurrency) => void;
  theme?: AppTheme;
  darkMode?: boolean;
  cartItems?: CartItem[];
  cartCount?: number;
  wishlistCount?: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenWishlist?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onSwitchSpace?: (space: any) => void;
  onSpaceChange?: (space: any) => void;
  onSetLanguage?: (lang: AppLanguage) => void;
  onLanguageChange?: (lang: AppLanguage) => void;
  onSetTheme?: (theme: AppTheme) => void;
  onToggleDarkMode?: () => void;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onOpenOrders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser = null,
  activeSpace,
  currentSpace,
  language = 'fr',
  currency = 'HTG',
  onCurrencyChange = (_c: AppCurrency) => {},
  theme,
  darkMode,
  cartItems = [],
  cartCount,
  wishlistCount = 0,
  unreadNotificationsCount = 0,
  onOpenNotifications = () => {},
  onOpenWishlist = () => {},
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onOpenSearch,
  onOpenCart = () => {},
  onOpenAuth = () => {},
  onSwitchSpace,
  onSpaceChange,
  onSetLanguage,
  onLanguageChange,
  onSetTheme,
  onToggleDarkMode,
  onLogout = () => {},
  onNavigateHome = () => {},
  onOpenOrders = () => {},
}) => {
  const t = translations[language] || translations.fr;
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Normalize active space
  const rawSpace = (currentSpace || activeSpace || 'buyer').toString().toUpperCase();
  const normalizedSpace: 'BUYER' | 'SELLER' | 'ADMIN' =
    rawSpace === 'SELLER' ? 'SELLER' : rawSpace === 'ADMIN' ? 'ADMIN' : 'BUYER';

  // Handle space switch dispatch
  const handleSpaceChange = (target: 'BUYER' | 'SELLER' | 'ADMIN') => {
    if (onSwitchSpace) onSwitchSpace(target);
    if (onSpaceChange) onSpaceChange(target.toLowerCase() as any);
  };

  // Handle language change dispatch
  const handleLanguageChange = (lang: AppLanguage) => {
    if (onSetLanguage) onSetLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  // Handle theme toggle
  const isDark = darkMode !== undefined ? darkMode : theme === 'dark';
  const handleToggleTheme = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else if (onSetTheme) {
      onSetTheme(isDark ? 'light' : 'dark');
    }
  };

  // Safe cart count computation
  const totalCartCount =
    typeof cartCount === 'number'
      ? cartCount
      : (cartItems || []).reduce((sum, i) => sum + (i?.quantity || 0), 0);

  const langNames: Record<AppLanguage, { label: string; flag: string }> = {
    fr: { label: 'Français', flag: '🇫🇷' },
    ht: { label: 'Kreyòl Ayisyen', flag: '🇭🇹' },
    en: { label: 'English', flag: '🇺🇸' },
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white/95 dark:bg-[#07101E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
    >
      {/* Top micro-bar for space indicator & Haitian security promise */}
      <div className="bg-[#0A192F] text-slate-300 text-xs px-4 py-1.5 hidden md:flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {t.brand.slogan}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Paiements vérifiés MonCash & NatCash</span>
        </div>

        {/* Space Switcher Pills */}
        <div className="flex items-center gap-1.5" id="space-switcher-pills">
          <button
            id="nav-switch-buyer-btn"
            onClick={() => handleSpaceChange('BUYER')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
              normalizedSpace === 'BUYER'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {t.nav.buyerSpace}
          </button>
          <button
            id="nav-switch-seller-btn"
            onClick={() => handleSpaceChange('SELLER')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              normalizedSpace === 'SELLER'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <StoreIcon className="w-3 h-3" />
            {t.nav.sellerSpace}
          </button>
          <button
            id="nav-switch-admin-btn"
            onClick={() => handleSpaceChange('ADMIN')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              normalizedSpace === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {t.nav.adminSpace}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          id="navbar-logo-btn"
          onClick={onNavigateHome}
          className="focus:outline-hidden hover:opacity-95 transition-opacity"
        >
          <BrandLogo variant="full" size="md" showSlogan={true} />
        </button>

        {/* Search Bar on Desktop */}
        {normalizedSpace === 'BUYER' && (
          <div className="hidden lg:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Right Tools & Account */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Active Space Badge on Mobile */}
          <div className="md:hidden">
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                normalizedSpace === 'BUYER'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : normalizedSpace === 'SELLER'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
              }`}
            >
              {normalizedSpace === 'BUYER' ? 'Achtè' : normalizedSpace === 'SELLER' ? 'Machann' : 'Admin'}
            </span>
          </div>

          {/* Currency Toggle (HTG / USD) */}
          <button
            id="currency-toggle-btn"
            onClick={() => onCurrencyChange(currency === 'HTG' ? 'USD' : 'HTG')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Chanje Deviz (HTG / USD)"
          >
            <span className="text-[#0066FF] dark:text-cyan-400 font-bold">{currency}</span>
            <span className="text-[10px] text-slate-400">⇄</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              id="lang-switcher-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span>{langNames[language].flag}</span>
              <span className="hidden xl:inline">{langNames[language].label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div
                id="lang-dropdown-menu"
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {(['fr', 'ht', 'en'] as AppLanguage[]).map((lng) => (
                  <button
                    key={lng}
                    id={`lang-select-${lng}`}
                    onClick={() => {
                      handleLanguageChange(lng);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors ${
                      language === lng
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-[#0066FF] dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base">{langNames[lng].flag}</span>
                    <span>{langNames[lng].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            id="navbar-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Notifikasyon & Alèt SMS"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Wishlist Button (Buyer space) */}
          {normalizedSpace === 'BUYER' && (
            <button
              id="navbar-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Pwodui Prefere (Wishlist)"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart button for Buyer */}
          {normalizedSpace === 'BUYER' && (
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-bounce"
                >
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Menu */}
          <div className="relative">
            {currentUser ? (
              <button
                id="user-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 transition-all"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                id="auth-open-btn"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {isUserMenuOpen && currentUser && (
              <div
                id="user-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.phone}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <button
                    id="menu-my-orders-btn"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium"
                  >
                    <Package className="w-4 h-4 text-blue-500" />
                    <span>Mes Commandes & Suivis</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                  {/* Switch spaces */}
                  <button
                    id="menu-switch-buyer"
                    onClick={() => {
                      handleSpaceChange('BUYER');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs ${
                      normalizedSpace === 'BUYER'
                        ? 'text-[#0066FF] font-bold bg-blue-50/50 dark:bg-blue-950/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <span>{t.nav.buyerSpace}</span>
                    </div>
                    {normalizedSpace === 'BUYER' && <span className="text-[10px] font-bold">Actif</span>}
                  </button>

                  <button
                    id="menu-switch-seller"
                    onClick={() => {
                      handleSpaceChange('SELLER');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs ${
                      normalizedSpace === 'SELLER'
                        ? 'text-amber-500 font-bold bg-amber-50/50 dark:bg-amber-950/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <StoreIcon className="w-4 h-4 text-amber-500" />
                      <span>{t.nav.sellerSpace}</span>
                    </div>
                    {normalizedSpace === 'SELLER' && <span className="text-[10px] font-bold">Actif</span>}
                  </button>

                  <button
                    id="menu-switch-admin"
                    onClick={() => {
                      handleSpaceChange('ADMIN');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs ${
                      normalizedSpace === 'ADMIN'
                        ? 'text-purple-500 font-bold bg-purple-50/50 dark:bg-purple-950/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      <span>{t.nav.adminSpace}</span>
                    </div>
                    {normalizedSpace === 'ADMIN' && <span className="text-[10px] font-bold">Actif</span>}
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <button
                  id="menu-logout-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
