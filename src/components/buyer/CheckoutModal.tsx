import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Smartphone,
  Check,
  MapPin,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CartItem,
  User,
  AppLanguage,
  AppCurrency,
  PaymentMethodType,
  DeliveryAddress,
  DeliveryType,
  Order,
} from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { HAITIAN_DEPARTMENTS, HAITIAN_CITIES, PICKUP_POINTS } from '../../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  currentUser: User | null;
  language: AppLanguage;
  currency?: AppCurrency;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  currentUser,
  language,
  currency = 'HTG',
  onClose,
  onOrderCreated,
}) => {
  if (!isOpen || items.length === 0) return null;

  const t = translations[language] || translations.fr;

  // Steps: 1: Delivery info / Pickup point, 2: Payment selection & Mobile Money confirmation
  const [step, setStep] = useState<1 | 2>(1);

  // Delivery type: home vs pickup point
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('HOME_DELIVERY');
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<string>(PICKUP_POINTS[0]?.id || '');

  // Address fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+509 ');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [department, setDepartment] = useState('Ouest');
  const [city, setCity] = useState(currentUser?.city || 'Port-au-Prince');
  const [street, setStreet] = useState(currentUser?.address || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('MONCASH');
  const [mobilePhone, setMobilePhone] = useState(phone.replace('+509', '').trim());
  const [otpCode, setOtpCode] = useState('5090'); // Default test code for ease of test
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Calculations
  const subtotalHTG = (items || []).reduce(
    (sum, item) => sum + ((item?.product?.price || 0) * (item?.quantity || 0)),
    0
  );
  const selectedPickup = PICKUP_POINTS.find((p) => p.id === selectedPickupPointId);
  const deliveryFeeHTG = deliveryType === 'PICKUP_POINT' ? (selectedPickup?.feeHTG ?? 200) : 350;
  const serviceFeeHTG = 150;
  const totalAmountHTG = subtotalHTG + deliveryFeeHTG + serviceFeeHTG;

  const availableCities = HAITIAN_CITIES[department] || ['Port-au-Prince'];

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const cities = HAITIAN_CITIES[dept];
    if (cities && cities.length > 0) {
      setCity(cities[0]);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (deliveryType === 'HOME_DELIVERY' && !street.trim()) {
      setErrorMessage('Veuillez préciser votre adresse exacte de livraison.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Process server-side payment
      const paymentRes = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountHTG: totalAmountHTG,
          method: paymentMethod,
          phone: mobilePhone || phone,
          otpCode: otpCode,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.message || 'Erreur lors de la validation du paiement.');
      }

      // 2. Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setPaymentSuccess(true);

      // Generate escrow PIN code (4 digits)
      const escrowPin = Math.floor(1000 + Math.random() * 9000).toString();

      // 3. Create real order on backend
      const deliveryAddress: DeliveryAddress = {
        fullName,
        phone,
        secondaryPhone: secondaryPhone || undefined,
        department: deliveryType === 'PICKUP_POINT' ? (selectedPickup?.city || department) : department,
        city: deliveryType === 'PICKUP_POINT' ? (selectedPickup?.city || city) : city,
        street: deliveryType === 'PICKUP_POINT' ? (selectedPickup?.address || street) : street,
        deliveryNotes: deliveryNotes || undefined,
        deliveryType,
        pickupPointId: deliveryType === 'PICKUP_POINT' ? selectedPickupPointId : undefined,
        pickupPointName: deliveryType === 'PICKUP_POINT' ? selectedPickup?.name : undefined,
      };

      const orderPayload = {
        buyerId: currentUser?.id || `user-guest-${Date.now()}`,
        buyerName: fullName,
        buyerPhone: phone,
        buyerEmail: currentUser?.email || 'acheteur@mggestion.ht',
        storeId: items[0].product.storeId,
        storeName: items[0].product.storeName,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          productImage: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity,
          selectedVariant: i.selectedVariant,
          storeId: i.product.storeId,
        })),
        subtotalHTG,
        deliveryFeeHTG,
        serviceFeeHTG,
        totalAmountHTG,
        deliveryAddress,
        deliveryType,
        escrowPin,
        paymentMethod,
        paymentStatus: 'SUCCESSFUL' as const,
        paymentReference: paymentData.transaction?.transactionRef,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const createdOrder = await orderRes.json();

      setTimeout(() => {
        setIsProcessing(false);
        onOrderCreated(createdOrder);
      }, 1200);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
    }
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="checkout-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            {step === 2 && !paymentSuccess && (
              <button
                onClick={() => setStep(1)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.checkout.title}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] dark:text-cyan-400">
                  Étape {step}/2
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {step === 1 ? t.checkout.deliveryInfo : t.checkout.paymentMethod}
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              id="close-checkout-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Delivery Mode & Information */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Delivery Type Selector: Home Delivery vs Pickup Point */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mòd Livrezon :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryType('HOME_DELIVERY')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      deliveryType === 'HOME_DELIVERY'
                        ? 'border-[#0066FF] bg-blue-50/50 dark:bg-blue-950/40 text-[#0066FF]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Truck className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Livrezon Lakay</p>
                      <p className="text-[10px] text-slate-500">350 HTG · Dirèk lakay ou</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryType('PICKUP_POINT')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                      deliveryType === 'PICKUP_POINT'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Pwen Relè (Pickup)</p>
                      <p className="text-[10px] text-slate-500">A partir de 150 HTG · An sekirite</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Point Selector */}
              {deliveryType === 'PICKUP_POINT' ? (
                <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Chwazi Pwen Rekiperasyon ou an Haïti :
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {PICKUP_POINTS.map((point) => (
                      <div
                        key={point.id}
                        onClick={() => setSelectedPickupPointId(point.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          selectedPickupPointId === point.id
                            ? 'border-emerald-600 bg-white dark:bg-slate-800 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-slate-900 dark:text-white">{point.name} · {point.city}</p>
                            <p className="text-[10px] text-slate-500 font-normal">{point.address} ({point.openingHours})</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                          {formatPrice(point.feeHTG, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Home delivery inputs */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Haitian Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.checkout.department} *
                    </label>
                    <select
                      id="checkout-department-select"
                      value={department}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                    >
                      {HAITIAN_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Haitian City */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.checkout.city} *
                    </label>
                    <select
                      id="checkout-city-select"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exact Street Address & Landmark */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.checkout.street} *
                    </label>
                    <input
                      id="checkout-street-input"
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="ex: 14 Rue Panaméricaine, en face Complexe Promenade"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.checkout.fullName} (Moun k ap resevwa l) *
                  </label>
                  <input
                    id="checkout-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Jean-Marc Baptiste"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.checkout.phone} (Nimewo pou SMS & Apèl) *
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+509 3700-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.checkout.deliveryNotes}
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="ex: Rele m lè w rive bò barrière gri a"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0066FF] focus:outline-hidden"
                />
              </div>

              {/* Order quick summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Articles ({items.length})</span>
                  <span>{formatPrice(subtotalHTG, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{deliveryType === 'PICKUP_POINT' ? 'Frais Point Relais' : 'Livraison express'}</span>
                  <span>{formatPrice(deliveryFeeHTG, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Frais de service & Séquestre</span>
                  <span>{formatPrice(serviceFeeHTG, currency)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                  <span>Total à régler</span>
                  <span className="text-[#0066FF] dark:text-cyan-400">
                    {formatPrice(totalAmountHTG, currency)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                id="checkout-step1-next-btn"
                className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuer vers le Paiement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Haitian Mobile Money Payment */}
          {step === 2 && !paymentSuccess && (
            <div className="space-y-5">
              {/* Payment Methods */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sélectionnez votre moyen de paiement sécurisé :
                </label>

                {/* MonCash Option */}
                <div
                  id="pay-opt-moncash"
                  onClick={() => setPaymentMethod('MONCASH')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'MONCASH'
                      ? 'border-[#E31837] bg-red-50/50 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E31837] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      MC
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Digicel MonCash</span>
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                          Instantané
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">{t.checkout.moncashDesc}</p>
                    </div>
                  </div>
                  {paymentMethod === 'MONCASH' && (
                    <CheckCircle2 className="w-5 h-5 text-[#E31837] shrink-0" />
                  )}
                </div>

                {/* NatCash Option */}
                <div
                  id="pay-opt-natcash"
                  onClick={() => setPaymentMethod('NATCASH')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'NATCASH'
                      ? 'border-[#FF6600] bg-orange-50/50 dark:bg-orange-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      NC
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Natcom NatCash</span>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold">
                          Instantané
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">{t.checkout.natcashDesc}</p>
                    </div>
                  </div>
                  {paymentMethod === 'NATCASH' && (
                    <CheckCircle2 className="w-5 h-5 text-[#FF6600] shrink-0" />
                  )}
                </div>
              </div>

              {/* Dynamic Payment Verification Box */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  paymentMethod === 'MONCASH'
                    ? 'border-red-200 bg-red-50/30 dark:border-red-900/60 dark:bg-red-950/20'
                    : 'border-orange-200 bg-orange-50/30 dark:border-orange-900/60 dark:bg-orange-950/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {paymentMethod === 'MONCASH' ? 'Compte Digicel MonCash' : 'Compte Natcom NatCash'}
                  </span>
                  <span className="font-black text-base text-[#0066FF] dark:text-cyan-400">
                    {formatPrice(totalAmountHTG, currency)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Numéro de téléphone compte (+509)
                    </label>
                    <input
                      type="text"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="3788-2341"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Code OTP / PIN SMS
                      </label>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Code test: 5090
                      </span>
                    </div>
                    <input
                      type="password"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="5090"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono font-bold tracking-widest text-center focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Validation sécurisée par API serveur MG Gestion. Vos fonds restent sous séquestre
                    jusqu'à réception confirmée via QR Code ou PIN Escrow.
                  </span>
                </div>
              </div>

              {/* Pay action */}
              <button
                id="execute-payment-btn"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  paymentMethod === 'MONCASH'
                    ? 'bg-[#E31837] hover:bg-[#C2132D] shadow-red-500/20'
                    : 'bg-[#FF6600] hover:bg-[#E05A00] shadow-orange-500/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Vérification sécurisée auprès de l'opérateur...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      Confirmer & Payer {formatPrice(totalAmountHTG, currency)} via{' '}
                      {paymentMethod === 'MONCASH' ? 'MonCash' : 'NatCash'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success state preview */}
          {paymentSuccess && (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Paiement Confirmé avec Succès !
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  La transaction a été validée par le serveur sécurisé. Redirection vers le suivi de
                  votre commande avec votre Code PIN & QR Séquestre...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
