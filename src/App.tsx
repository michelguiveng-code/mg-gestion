import React, { useState, useEffect } from 'react';
import {
  AppLanguage,
  AppCurrency,
  UserSpace,
  User,
  Product,
  Store as StoreType,
  Order,
  CartItem,
  PaymentTransaction,
  OrderStatusType,
  Category,
  AppNotification,
  ChatMessage
} from './types';
import {
  MOCK_PRODUCTS,
  MOCK_STORES,
  MOCK_ORDERS,
  MOCK_CATEGORIES,
  MOCK_TRANSACTIONS,
  MOCK_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES
} from './data/mockData';
import { loadSession, saveSession, clearSession, registerUser, authenticateUser } from './utils/auth';
import { translations, formatPrice } from './utils/i18n';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { BuyerHome } from './components/buyer/BuyerHome';
import { SearchAndFilterView } from './components/buyer/SearchAndFilterView';
import { StoreProfileView } from './components/buyer/StoreProfileView';
import { ProductDetailModal } from './components/buyer/ProductDetailModal';
import { CartDrawer } from './components/buyer/CartDrawer';
import { CheckoutModal } from './components/buyer/CheckoutModal';
import { OrderTrackingView } from './components/buyer/OrderTrackingView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { BrandLogo } from './components/common/BrandLogo';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ChatDrawer } from './components/common/ChatDrawer';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Heart,
  Store,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Localization, Currency & Theme
  const [language, setLanguage] = useState<AppLanguage>('fr');
  const [currency, setCurrency] = useState<AppCurrency>('HTG');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Authentication & Navigation
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSpace, setCurrentSpace] = useState<UserSpace>('buyer');
  const [activeBuyerView, setActiveBuyerView] = useState<'home' | 'search' | 'store' | 'tracking'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Active Chat Target
  const [activeChatStore, setActiveChatStore] = useState<StoreType | null>(MOCK_STORES[0]);
  const [activeChatProduct, setActiveChatProduct] = useState<Product | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data Collections
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [stores, setStores] = useState<StoreType[]>(MOCK_STORES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-4']);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedOrders = window.localStorage.getItem('mg-gestion-orders');
    const savedCart = window.localStorage.getItem('mg-gestion-cart');
    const savedWishlist = window.localStorage.getItem('mg-gestion-wishlist');
    const savedNotifications = window.localStorage.getItem('mg-gestion-notifications');

    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch {}
    }
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch {}
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch {}
    }
    if (savedNotifications) {
      try { setNotifications(JSON.parse(savedNotifications)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('mg-gestion-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('mg-gestion-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('mg-gestion-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('mg-gestion-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const savedUser = loadSession();
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentSpace(savedUser.activeSpace.toLowerCase() as UserSpace);
    } else {
      setCurrentUser(MOCK_USERS[0]);
    }
  }, []);

  // Fetch from server on load
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pRes, sRes, oRes, cRes, aRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/stores').catch(() => null),
        fetch('/api/orders').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/admin/metrics').catch(() => null),
      ]);

      if (pRes && pRes.ok) setProducts(await pRes.json());
      if (sRes && sRes.ok) setStores(await sRes.json());
      if (oRes && oRes.ok) setOrders(await oRes.json());
      if (cRes && cRes.ok) setCategories(await cRes.json());
      if (aRes && aRes.ok) {
        const metrics = await aRes.json();
        if (metrics.transactions) setTransactions(metrics.transactions);
      }
    } catch (e) {
      console.warn('Using initial seed state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync dark mode class with root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Chat launcher
  const handleOpenChat = (storeOrId?: StoreType | string, product?: Product) => {
    if (storeOrId) {
      const foundStore =
        typeof storeOrId === 'string'
          ? stores.find((s) => s.id === storeOrId) || stores[0]
          : storeOrId;
      setActiveChatStore(foundStore);
    } else {
      setActiveChatStore(stores[0]);
    }
    setActiveChatProduct(product || null);
    setIsChatOpen(true);
  };

  // Chat message sender
  const handleSendChatMessage = (storeId: string, text: string, productId?: string) => {
    const targetStore = stores.find((s) => s.id === storeId) || activeChatStore || stores[0];
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      storeId: targetStore.id,
      storeName: targetStore.name,
      storeLogo: targetStore.logo,
      sender: 'BUYER',
      senderName: currentUser?.fullName || 'Mwen',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      productId,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated automated response from store after 1.2s
    setTimeout(() => {
      const storeReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        storeId: targetStore.id,
        storeName: targetStore.name,
        storeLogo: targetStore.logo,
        sender: 'SELLER',
        senderName: `${targetStore.name} (Sèvis Kliyan)`,
        text: `Mèsi pou mesaj ou a! Nou resevwa l byen. Ekip ${targetStore.name} an ap prepare repons lan pou ou rapidman. Ou ka pase kòmand ou an dirèk ak MonCash/NatCash sou platfòm lan!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, storeReply]);
    }, 1200);
  };

  // Notification handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id && item.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          selectedVariant,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart([
      {
        productId: product.id,
        product,
        quantity,
        selectedVariant,
      },
    ]);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    quantity: number,
    variant?: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariant === variant)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentSpace(user.activeSpace.toLowerCase() as UserSpace);
    saveSession(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearSession();
    setIsAuthOpen(true);
  };

  // Add all wishlist items to cart
  const handleAddAllWishlistToCart = () => {
    const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
    wishlistProducts.forEach((prod) => {
      handleAddToCart(prod, 1);
    });
    setIsWishlistOpen(false);
  };

  // Checkout completed
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setActiveBuyerView('tracking');

    // Add immediate order notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'ORDER',
      title: 'Nouvo Kòmand Konfime ! 🎉',
      message: `Kòmand #${newOrder.orderNumber} ou an peye ak siksè. Kòd PIN Séquestre ou se ${newOrder.escrowPin || '4892'}.`,
      timestamp: 'À l\'instant',
      isRead: false,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Navigation handlers
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setActiveBuyerView('search');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setActiveBuyerView('search');
  };

  const handleVisitStore = (storeOrId: string | StoreType) => {
    const storeId = typeof storeOrId === 'string' ? storeOrId : storeOrId.id;
    setSelectedStoreId(storeId);
    setSelectedProduct(null);
    setActiveBuyerView('store');
  };

  // Seller operations
  const handleCreateStore = async (storeData: Partial<StoreType>) => {
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      const created = await res.json();
      setStores((prev) => [...prev, created]);
      if (currentUser) {
        setCurrentUser({ ...currentUser, storeId: created.id, role: 'SELLER' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatusType,
    note?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.error(e);
    }
  };

  // Admin operations
  const handleToggleStoreVerification = async (storeId: string) => {
    const target = stores.find((s) => s.id === storeId);
    if (!target) return;
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !target.isVerified }),
      });
      const updated = await res.json();
      setStores((prev) => prev.map((s) => (s.id === storeId ? updated : s)));
    } catch (e) {
      console.error(e);
    }
  };

  // Current store for seller dashboard
  const userStore =
    stores.find((s) => s.sellerId === currentUser?.id || s.id === currentUser?.storeId) ||
    (currentUser?.role === 'SELLER' ? stores[0] : null);

  const selectedStoreObj = stores.find((s) => s.id === selectedStoreId) || stores[0];

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const t = translations[language] || translations.fr;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Main Navigation Bar */}
      <Navbar
        language={language}
        currency={currency}
        currentSpace={currentSpace}
        currentUser={currentUser}
        cartItems={cart}
        cartCount={(cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0)}
        wishlistCount={wishlist.length}
        unreadNotificationsCount={unreadNotifCount}
        darkMode={darkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLanguageChange={setLanguage}
        onSetLanguage={setLanguage}
        onCurrencyChange={setCurrency}
        onSpaceChange={setCurrentSpace}
        onSwitchSpace={(space) => setCurrentSpace(space.toLowerCase() as any)}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSetTheme={(t) => setDarkMode(t === 'dark')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => {
          setCurrentSpace('buyer');
          setActiveBuyerView('tracking');
        }}
        onNavigateHome={() => {
          setCurrentSpace('buyer');
          setActiveBuyerView('home');
          setSelectedCategory(null);
          setSearchQuery('');
        }}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:pb-12">
        {/* BUYER SPACE */}
        {currentSpace === 'buyer' && (
          <>
            {activeBuyerView === 'home' && (
              <BuyerHome
                products={products}
                stores={stores}
                categories={categories}
                language={language}
                currency={currency}
                wishlist={wishlist}
                isLoading={isLoading}
                onToggleWishlist={handleToggleWishlist}
                onSelectCategory={handleCategorySelect}
                onSelectProduct={setSelectedProduct}
                onAddToCart={handleAddToCart}
                onSelectStore={handleVisitStore}
                onVisitStore={handleVisitStore}
                onExploreSearch={() => {
                  setSelectedCategory(null);
                  setActiveBuyerView('search');
                }}
                onViewAllProducts={() => {
                  setSelectedCategory(null);
                  setActiveBuyerView('search');
                }}
                onOpenCreateStore={() => setCurrentSpace('seller')}
                onOpenSellerSpace={() => setCurrentSpace('seller')}
              />
            )}

            {activeBuyerView === 'search' && (
              <SearchAndFilterView
                products={products}
                stores={stores}
                categories={categories}
                selectedCategory={selectedCategory}
                initialSearchQuery={searchQuery}
                initialQuery={searchQuery}
                language={language}
                currency={currency}
                wishlist={wishlist}
                isLoading={isLoading}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onAddToCart={handleAddToCart}
                onSelectStore={handleVisitStore}
                onVisitStore={handleVisitStore}
                onBackToHome={() => setActiveBuyerView('home')}
              />
            )}

            {activeBuyerView === 'store' && (
              <StoreProfileView
                store={selectedStoreObj}
                products={products}
                language={language}
                currency={currency}
                wishlist={wishlist}
                isLoading={isLoading}
                onToggleWishlist={handleToggleWishlist}
                onBack={() => setActiveBuyerView('home')}
                onSelectProduct={setSelectedProduct}
                onAddToCart={handleAddToCart}
                onOpenChat={(st) => handleOpenChat(st)}
              />
            )}

            {activeBuyerView === 'tracking' && (
              <OrderTrackingView
                orders={orders}
                language={language}
                currency={currency}
                onBack={() => setActiveBuyerView('home')}
                onRefreshOrders={fetchData}
                onOpenChatWithStore={(storeId, storeName) => {
                  const s = stores.find((st) => st.id === storeId);
                  handleOpenChat(s || storeId);
                }}
              />
            )}
          </>
        )}

        {/* SELLER SPACE */}
        {currentSpace === 'seller' && (
          <SellerDashboard
            currentUser={currentUser}
            store={userStore}
            products={products}
            orders={orders}
            categories={categories}
            language={language}
            onCreateStore={handleCreateStore}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ADMIN SPACE */}
        {currentSpace === 'admin' && (
          <AdminDashboard
            stores={stores}
            products={products}
            orders={orders}
            transactions={transactions}
            language={language}
            onToggleStoreVerification={handleToggleStoreVerification}
            onDeleteProduct={handleDeleteProduct}
            onRefreshData={fetchData}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        store={stores.find((s) => s.id === selectedProduct?.storeId)}
        language={language}
        currency={currency}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={() => selectedProduct && handleToggleWishlist(selectedProduct.id)}
        onOpenChat={(prod) => handleOpenChat(stores.find((s) => s.id === prod.storeId), prod)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, variant) => {
          handleAddToCart(p, qty, variant);
          setSelectedProduct(null);
        }}
        onBuyNow={(p, qty, variant) => {
          handleBuyNow(p, qty, variant);
        }}
        onVisitStore={(storeId) => {
          setSelectedProduct(null);
          handleVisitStore(storeId);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        language={language}
        currency={currency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        currentUser={currentUser}
        language={language}
        currency={currency}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      <AuthModal
        isOpen={isAuthOpen}
        language={language}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onAddAllToCart={handleAddAllWishlistToCart}
        onSelectProduct={(prod) => {
          setIsWishlistOpen(false);
          setSelectedProduct(prod);
        }}
        language={language}
        currency={currency}
      />

      {/* Notification / SMS Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        onSelectNotification={(notif) => {
          if (notif.orderId) {
            setIsNotificationOpen(false);
            setCurrentSpace('buyer');
            setActiveBuyerView('tracking');
          }
        }}
        language={language}
      />

      {/* Direct Chat / WhatsApp Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        store={activeChatStore}
        product={activeChatProduct}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        language={language}
        currency={currency}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        currentSpace={currentSpace}
        activeBuyerView={activeBuyerView}
        cartCount={(cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0)}
        language={language}
        onNavigate={(tab) => {
          if (tab === 'home') {
            setCurrentSpace('buyer');
            setActiveBuyerView('home');
          } else if (tab === 'search') {
            setCurrentSpace('buyer');
            setActiveBuyerView('search');
          } else if (tab === 'cart') {
            setIsCartOpen(true);
          } else if (tab === 'orders') {
            setCurrentSpace('buyer');
            setActiveBuyerView('tracking');
          } else if (tab === 'seller') {
            setCurrentSpace('seller');
          }
        }}
      />

      {/* Professional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 mt-auto hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <BrandLogo size="md" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Premye platfòm e-commerce an Ayiti ki entegre peman MonCash & NatCash ak sekirite
                garanti.
              </p>
              <p className="text-[11px] font-bold text-[#0066FF] dark:text-cyan-400">
                Vann. Achte. Jere. An sekirite.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Espaces
              </h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button
                    onClick={() => {
                      setCurrentSpace('buyer');
                      setActiveBuyerView('home');
                    }}
                    className="hover:text-[#0066FF] cursor-pointer"
                  >
                    Acheter en ligne ({currency})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSpace('seller')}
                    className="hover:text-[#0066FF] cursor-pointer"
                  >
                    Ouvrir une Boutique Vendeur
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSpace('admin')}
                    className="hover:text-red-500 text-red-600 font-semibold cursor-pointer"
                  >
                    Espace Superadmin & Modération
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Sécurité & Garanties
              </h4>
              <ul className="space-y-1.5 text-slate-500">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Paiements MonCash & NatCash sous séquestre (Escrow)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Livraison & Pwen Relè dans les 10 départements</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Vérification des Boutiques Certifiées</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Support & Contact
              </h4>
              <div className="space-y-1 text-slate-500">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+509 3788-2940 / +509 4120-9901</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>support@mggestion.ht</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pétion-Ville & Delmas, Haïti</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} MG Gestion S.A. Tout dwa rezève.</p>
            <div className="flex items-center gap-4">
              <span>Termes & Conditions</span>
              <span>Politique de Confidentialité</span>
              <span>Politique de Remboursement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
