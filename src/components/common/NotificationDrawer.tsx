import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Smartphone,
  Package,
  Sparkles,
  ShieldAlert,
  Info,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { AppNotification, AppLanguage } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
  language: AppLanguage;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectNotification,
  language,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'SMS':
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case 'ORDER':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'PROMO':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'PAYMENT':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft"
        id="notifications-drawer"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-cyan-400 flex items-center justify-center border border-cyan-400/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Notifikasyon & Alèt SMS</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {unreadCount} nouvo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Suivi kòmand, peman ak mesaj an dirèk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Make tout kòm li</span>
          </button>
          <button
            onClick={onClearNotifications}
            className="text-slate-500 hover:text-rose-500 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Efase tout</span>
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-50/50 dark:bg-slate-950/50">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Bell className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Pa gen okenn notifikasyon
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tout enfòmasyon sou kòmand, peman MonCash/NatCash ak alèt livrezon ap parèt isit la.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification && onSelectNotification(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.orderId && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#0066FF] dark:text-cyan-400 font-bold">
                        Gade detay kòmand <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
