import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Store,
  Phone,
  Calendar,
  Lock,
  ExternalLink,
  Download
} from 'lucide-react';
import { Order, AppLanguage, AppCurrency } from '../../types';
import { translations, formatPrice } from '../../utils/i18n';
import { BrandLogo } from './BrandLogo';

interface EscrowQRModalProps {
  order: Order | null;
  language: AppLanguage;
  currency: AppCurrency;
  onClose: () => void;
  onConfirmDelivery?: (orderId: string) => void;
}

export const EscrowQRModal: React.FC<EscrowQRModalProps> = ({
  order,
  language,
  currency,
  onClose,
  onConfirmDelivery,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'receipt'>('qr');
  const [copiedPin, setCopiedPin] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [deliveredSuccess, setDeliveredSuccess] = useState(false);

  const t = translations[language] || translations.fr;
  const pinCode = order?.escrowPin || '4892';

  useEffect(() => {
    if (!order) return;
    const payload = JSON.stringify({
      orderId: order.id,
      orderNumber: order.orderNumber,
      pin: pinCode,
      totalHTG: order.totalAmountHTG,
      store: order.storeName,
      status: order.orderStatus,
      escrowSecured: true,
      timestamp: new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#002244',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [order, pinCode]);

  if (!order) return null;

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pinCode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const handleSimulateDelivery = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setDeliveredSuccess(true);
      if (onConfirmDelivery) {
        onConfirmDelivery(order.id);
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        id="escrow-qr-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-cyan-400 flex items-center justify-center border border-cyan-400/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Validasyon Kòmand & Escrow</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  MG Escrow
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{order.orderNumber}</p>
            </div>
          </div>

          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Kòd QR & PIN Livrè</span>
          </button>
          <button
            onClick={() => setActiveTab('receipt')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'receipt'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Fich Resi Ofisyèl</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'qr' ? (
            /* QR & PIN View */
            <div className="space-y-5 text-center">
              {/* QR Container */}
              <div className="relative inline-block p-4 rounded-3xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Escrow Validation QR Code"
                    className="w-52 h-52 mx-auto rounded-xl"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                    Chargement QR Code...
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                </div>
              </div>

              {/* Escrow PIN Display */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 max-w-sm mx-auto space-y-2">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Kòd Sekirite pou Remèt Livrè a (PIN Escrow) :
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-3xl font-black font-mono tracking-widest text-[#0066FF] dark:text-cyan-400 bg-white dark:bg-slate-900 px-5 py-2 rounded-xl border border-blue-300 dark:border-blue-800 shadow-inner">
                    {pinCode}
                  </div>
                  <button
                    onClick={handleCopyPin}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#0066FF] border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
                    title="Kopye PIN"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  * Bay livrè a kòd sa a SÈLMAN lè ou verifye tout pwodui ou yo nan men w.
                </p>
              </div>

              {/* Order quick overview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Boutik Machann :</span>
                  <span className="font-bold text-slate-900 dark:text-white">{order.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Peye (Escrow) :</span>
                  <span className="font-black text-[#0066FF] dark:text-cyan-400">
                    {formatPrice(order.totalAmountHTG, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mòd Livrezon :</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {order.deliveryAddress?.deliveryType === 'PICKUP_POINT'
                      ? `📍 Pwen Relè (${order.deliveryAddress?.pickupPointName || 'Relais'})`
                      : `🏠 Livrezon Lakay (${order.deliveryAddress?.city})`}
                  </span>
                </div>
              </div>

              {/* Courier simulation action */}
              {order.orderStatus !== 'DELIVERED' && !deliveredSuccess && (
                <button
                  id="simulate-courier-scan-btn"
                  onClick={handleSimulateDelivery}
                  disabled={isConfirming}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isConfirming ? 'Validasyon an kou...' : 'Simuler le Scan du Livreur & Débloquer Fonds'}
                  </span>
                </button>
              )}

              {deliveredSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Livrezon Konfime ak Siksè ! Lajan an debouse bay machann nan.</span>
                </div>
              )}
            </div>
          ) : (
            /* Printable Receipt View */
            <div className="space-y-4 printable-receipt text-xs" id="official-printable-receipt">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 space-y-4">
                {/* Receipt Header */}
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                  <BrandLogo size="md" />
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      RESI AKITANS PEMAN
                    </span>
                    <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString(language === 'ht' ? 'fr-HT' : language, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Buyer & Store Info Grid */}
                <div className="grid grid-cols-2 gap-4 py-2 text-[11px] border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase font-bold text-[9px]">Achtè / Destinataire</p>
                    <p className="font-bold text-slate-900 dark:text-white">{order.buyerName}</p>
                    <p className="text-slate-600 dark:text-slate-400">{order.buyerPhone}</p>
                    <p className="text-slate-600 dark:text-slate-400">{order.deliveryAddress?.city}, {order.deliveryAddress?.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase font-bold text-[9px]">Boutik Machann</p>
                    <p className="font-bold text-slate-900 dark:text-white">{order.storeName}</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Pèman: {order.paymentMethod === 'MONCASH' ? 'Digicel MonCash' : order.paymentMethod === 'NATCASH' ? 'Natcom NatCash' : 'Kach'}
                    </p>
                    <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                      Ref: {order.paymentReference || 'MC-894102-HT'}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2">
                  <p className="text-slate-400 uppercase font-bold text-[9px]">Detay Atik yo</p>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div className="flex-1 pr-2">
                          <p className="font-bold text-slate-900 dark:text-white">{it.productName}</p>
                          {it.selectedVariant && (
                            <p className="text-[10px] text-slate-500">Opsyon: {it.selectedVariant}</p>
                          )}
                          <p className="text-[10px] text-slate-400">
                            {it.quantity} x {formatPrice(it.price, currency)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatPrice(it.price * it.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Sou-total</span>
                    <span>{formatPrice(order.subtotalHTG, currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Frè Livrezon ({order.deliveryAddress?.deliveryType === 'PICKUP_POINT' ? 'Pwen Relè' : 'Lakay'})</span>
                    <span>{formatPrice(order.deliveryFeeHTG, currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Frè Sekirite Escrow MG</span>
                    <span>{formatPrice(order.serviceFeeHTG, currency)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                    <span>TOTAL PEYE</span>
                    <span className="text-[#0066FF] dark:text-cyan-400">
                      {formatPrice(order.totalAmountHTG, currency)}
                    </span>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    🛡️ Peman Garanti anba Séquestre MG Escrow Ayiti
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Platfòm MG Gestion | Sipò Kliyan: +509 3788-0000 | contact@mggestion.ht
                  </p>
                </div>
              </div>

              {/* Print CTA */}
              <div className="flex gap-2">
                <button
                  id="print-receipt-btn"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Enprime / Telechaje Fich Resi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
