import React from 'react';
import { Home, Search, ShoppingCart, Package } from 'lucide-react';
import { AppLanguage, UserSpace } from '../../types';
import { translations } from '../../utils/i18n';

interface MobileBottomNavProps {
  currentSpace: UserSpace;
  activeBuyerView: string;
  cartCount: number;
  language: AppLanguage;
  onNavigate: (tab: 'home' | 'search' | 'cart' | 'orders' | 'seller') => void;
}

interface NavItem {
  id: 'home' | 'search' | 'cart' | 'orders' | 'seller';
  label: string;
  icon: any;
  count?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentSpace,
  activeBuyerView,
  cartCount,
  language,
  onNavigate,
}) => {
  const t = translations[language] || translations.fr;

  const navItems: NavItem[] = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'search', label: t.nav.search, icon: Search },
    { id: 'orders', label: 'Suivi', icon: Package },
    { id: 'cart', label: t.nav.cart, icon: ShoppingCart, count: cartCount },
  ];

  const getIsActive = (id: string) => {
    if (id === 'seller') return currentSpace === 'seller';
    if (currentSpace !== 'buyer') return false;
    if (id === 'home') return activeBuyerView === 'home';
    if (id === 'search') return activeBuyerView === 'search';
    if (id === 'orders') return activeBuyerView === 'tracking';
    return false;
  };

  return (
    <div
      id="mobile-bottom-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.id);

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 relative transition-all ${
                isActive
                  ? 'text-[#0066FF] dark:text-cyan-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
