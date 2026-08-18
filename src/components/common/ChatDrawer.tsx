import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Phone,
  ShieldCheck,
  Store as StoreIcon,
  ExternalLink,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { ChatMessage, Store, Product, AppLanguage, AppCurrency } from '../../types';
import { formatPrice } from '../../utils/i18n';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  product?: Product | null;
  messages: ChatMessage[];
  onSendMessage: (storeId: string, text: string, productId?: string) => void;
  language: AppLanguage;
  currency: AppCurrency;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  store,
  product,
  messages,
  onSendMessage,
  language,
  currency,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen || !store) return null;

  const currentStoreMessages = messages.filter((m) => m.storeId === store.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(store.id, inputText.trim(), product?.id);
    setInputText('');
  };

  // WhatsApp link generation
  const cleanPhone = store.phone.replace(/[^0-9]/g, '');
  const productText = product
    ? `Bonjou ${store.name}! Mwen enterese achte pwodui "${product.name}" (${formatPrice(product.price, currency)}) sou MG Gestion. Èske li disponib toujou?`
    : `Bonjou ${store.name}! Mwen wè boutik ou sou platfòm MG Gestion epi m ta renmen plis enfòmasyon.`;
  const whatsappUrl = `https://wa.me/509${cleanPhone.replace(/^509/, '')}?text=${encodeURIComponent(productText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft"
        id="direct-chat-drawer"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={store.logo || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=150'}
                alt={store.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                  {store.name}
                </h3>
                {store.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">An liy kounye a • {store.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 text-[11px] font-bold"
              title="Ouvri nan WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Context Pill (if triggered from a product) */}
        {product && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-8 h-8 rounded-lg object-cover border border-blue-200 dark:border-blue-800 shrink-0"
              />
              <div className="truncate">
                <p className="font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                <p className="text-[10px] text-[#0066FF] dark:text-cyan-400 font-bold">
                  {formatPrice(product.price, currency)}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold shrink-0">
              Pwodui Chwazi
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
              🛡️ Diskisyon sa a an sekirite sou MG Gestion
            </span>
          </div>

          {currentStoreMessages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <MessageCircle className="w-10 h-10 mx-auto opacity-40 text-blue-500" />
              <p className="text-xs">Kòmanse pale ak machann nan dirèkteman.</p>
              <p className="text-[11px] text-slate-500">
                Poze kesyon sou livrezon, koulè, oswa garanti anvan w peye.
              </p>
            </div>
          ) : (
            currentStoreMessages.map((msg) => {
              const isMe = msg.sender === 'BUYER';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-[#0066FF] text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`text-[9px] text-right font-mono ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setInputText('Èske pwodui sa a disponib nan stòk toujou ?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-medium shrink-0 whitespace-nowrap transition-colors"
          >
            Disponib nan stòk ?
          </button>
          <button
            onClick={() => setInputText('Konbyen tan livrezon an ap pran pou rive ?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-medium shrink-0 whitespace-nowrap transition-colors"
          >
            Delè livrezon ?
          </button>
          <button
            onClick={() => setInputText('Èske m ka peye ak MonCash lè livrè a rive ?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-medium shrink-0 whitespace-nowrap transition-colors"
          >
            Peman MonCash ?
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ekri mesaj ou a bay machann nan..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-transparent focus:border-[#0066FF] focus:outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
