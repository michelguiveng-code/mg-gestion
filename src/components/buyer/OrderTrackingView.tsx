import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Star,
  Receipt,
  Phone,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  X,
  QrCode,
  Building2,
  Lock
} from 'lucide-react';
import { Order, OrderStatusType, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { EscrowQRModal } from '../common/EscrowQRModal';

interface OrderTrackingViewProps {
  orders: Order[];
  selectedOrderId?: string;
  language: AppLanguage;
  currency?: AppCurrency;
  onBack: () => void;
  onRefreshOrders: () => void;
  onOpenChatWithStore?: (storeId: string, storeName: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  selectedOrderId,
  language,
  currency = 'HTG',
  onBack,
  onRefreshOrders,
  onOpenChatWithStore,
}) => {
  const t = translations[language] || translations.fr;
  const [activeOrderId, setActiveOrderId] = useState<string>(
    selectedOrderId || orders[0]?.id || ''
  );

  // Escrow modal state
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const timelineSteps: { status: OrderStatusType; label: string; icon: any }[] = [
    { status: 'CREATED', label: t.orderTracking.status.CREATED, icon: Clock },
    { status: 'PAID', label: t.orderTracking.status.PAID, icon: ShieldCheck },
    { status: 'CONFIRMED', label: t.orderTracking.status.CONFIRMED, icon: CheckCircle2 },
    { status: 'PREPARING', label: t.orderTracking.status.PREPARING, icon: Package },
    { status: 'IN_DELIVERY', label: t.orderTracking.status.IN_DELIVERY, icon: Truck },
    { status: 'DELIVERED', label: t.orderTracking.status.DELIVERED, icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatusType) => {
    switch (status) {
      case 'CREATED':
        return 0;
      case 'PAID':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'PREPARING':
        return 3;
      case 'IN_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;

  const handleSubmitReview = async () => {
    if (!activeOrder) return;
    setIsSubmittingReview(true);
    try {
      await fetch(`/api/orders/${activeOrder.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          authorName: activeOrder.buyerName,
        }),
      });
      setIsReviewModalOpen(false);
      setComment('');
      onRefreshOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!activeOrder) {
    return (
      <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {language === 'ht' ? 'Ou poko gen okenn kòmand' : 'Aucune commande enregistrée'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {language === 'ht'
            ? 'Kòmanse achte sou MG Gestion pou swiv pakèt ou an dirèk.'
            : 'Vos commandes passées apparaîtront ici avec leur suivi en temps réel.'}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-xs hover:bg-[#0052CC] cursor-pointer"
        >
          {t.common.back} à la boutique
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
      id="order-tracking-view"
    >
      {/* Top action bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <button
          id="orders-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back} à l'accueil</span>
        </button>

        <span className="text-xs text-slate-500 font-semibold">
          {orders.length} commande(s) au total
        </span>
      </motion.div>

      {/* Orders selector pills if multiple */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveOrderId(ord.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all cursor-pointer ${
                activeOrder.id === ord.id
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{ord.orderNumber}</span>
              <span className="ml-1.5 opacity-80 text-[10px]">
                ({formatPrice(ord.totalAmountHTG, currency)})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Order Tracking Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-8 space-y-8 shadow-sm"
      >
        {/* Order Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] dark:bg-blue-950/70 dark:text-cyan-400">
                {activeOrder.orderNumber}
              </span>
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                  activeOrder.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {t.orderTracking.status[activeOrder.orderStatus] || activeOrder.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Vendeur : <strong className="text-slate-700 dark:text-slate-200">{activeOrder.storeName}</strong> • Passée le{' '}
              {new Date(activeOrder.createdAt).toLocaleDateString('fr-HT', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Chat with Store */}
            {onOpenChatWithStore && (
              <button
                onClick={() => onOpenChatWithStore(activeOrder.storeId, activeOrder.storeName)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#0066FF] dark:text-cyan-400 text-xs font-bold hover:bg-[#0066FF] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Boutique</span>
              </button>
            )}

            {/* Escrow PIN & QR Code trigger */}
            <button
              id="open-escrow-qr-btn"
              onClick={() => setIsEscrowModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>QR & PIN Séquestre</span>
            </button>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total payé</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {formatPrice(activeOrder.totalAmountHTG, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Escrow Protection Badge Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                Paiement sous Séquestre Protégé (Escrow MG Gestion)
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Le montant de <strong>{formatPrice(activeOrder.totalAmountHTG, currency)}</strong> reste bloqué. Le vendeur ne recevra les fonds que lorsque vous présenterez votre QR ou donnerez votre PIN de déblocage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
              PIN : {activeOrder.escrowPin || '4892'}
            </span>
          </div>
        </div>

        {/* 6-Stage Timeline Graphic */}
        <div className="space-y-4" id="order-timeline-stepper">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Progression en Temps Réel
          </h3>

          <div className="relative">
            {/* Desktop progress bar */}
            <div className="hidden sm:grid grid-cols-6 gap-2 relative">
              {timelineSteps.map((s, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = s.icon;

                return (
                  <div key={s.status} className="flex flex-col items-center text-center space-y-2 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#0066FF] text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-blue-200 dark:ring-blue-900 scale-110' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-bold leading-tight ${
                        isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}

              {/* Connecting line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
                <div
                  className="h-full bg-[#0066FF] transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Mobile vertical timeline list */}
            <div className="sm:hidden space-y-3">
              {activeOrder.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.orderTracking.status[event.status] || event.status}
                    </p>
                    <p className="text-[11px] text-slate-500">{event.note}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString('fr-HT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Split: Items & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Purchased Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.orderTracking.itemsOrdered}
            </h4>
            <div className="space-y-2">
              {activeOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.productName}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Quantité : {item.quantity} {item.selectedVariant && `• ${item.selectedVariant}`}
                    </p>
                    <p className="text-xs font-black text-[#0066FF]">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Destination Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.orderTracking.deliveryAddress}
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeOrder.deliveryType === 'PICKUP_POINT' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <Building2 className="w-4 h-4" />
                    <span>Point Relais : {activeOrder.deliveryAddress.pickupPointName || 'Point Relais Partenaire'}</span>
                  </div>
                  <p className="pl-6 text-slate-600 dark:text-slate-300">
                    {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-[#0066FF]" />
                    <span>
                      {activeOrder.deliveryAddress.city} ({activeOrder.deliveryAddress.department})
                    </span>
                  </div>
                  <p className="pl-6 text-slate-500">
                    {activeOrder.deliveryAddress.street}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pl-6 pt-1 text-slate-600 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Destinataire : {activeOrder.deliveryAddress.fullName} ({activeOrder.deliveryAddress.phone})</span>
              </div>

              {activeOrder.deliveryAddress.deliveryNotes && (
                <p className="pl-6 text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  Note : "{activeOrder.deliveryAddress.deliveryNotes}"
                </p>
              )}
            </div>

            {/* Review Section if Delivered */}
            {activeOrder.orderStatus === 'DELIVERED' && (
              <div className="pt-2">
                {activeOrder.review ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Votre avis publié
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{activeOrder.review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 italic">
                      "{activeOrder.review.comment}"
                    </p>
                  </div>
                ) : (
                  <button
                    id="open-review-modal-btn"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>{t.orderTracking.leaveReviewBtn}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div
          id="review-modal-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.orderTracking.leaveReviewBtn}
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {t.orderTracking.rateExperience}
            </p>

            {/* Stars Picker */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${s <= rating ? 'fill-current' : 'stroke-slate-300'}`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience sur la qualité du produit et la rapidité du livreur..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
            />

            <button
              id="submit-review-btn"
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !comment.trim()}
              className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmittingReview ? 'Publication...' : t.orderTracking.submitReview}
            </button>
          </div>
        </div>
      )}

      {/* Escrow PIN & QR Code Modal */}
      {isEscrowModalOpen && (
        <EscrowQRModal
          order={activeOrder}
          language={language}
          currency={currency}
          onClose={() => setIsEscrowModalOpen(false)}
          onConfirmDelivery={() => {
            onRefreshOrders();
          }}
        />
      )}
    </motion.div>
  );
};
