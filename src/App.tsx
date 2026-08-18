import React, { useState, useEffect, useCallback, FormEvent } from "react";
import {
  Home,
  Search,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CreditCard,
  MapPin,
  Lock,
  Store,
  Bell,
  SlidersHorizontal
} from "lucide-react";

/* ============================================================
   TYPES & INTERFACES
   ============================================================ */

export type Screen =
  | "login"
  | "register"
  | "verify"
  | "home"
  | "explore"
  | "product"
  | "cart"
  | "checkout"
  | "payment"
  | "orders"
  | "account"
  | "support"
  | "settings"
  | "store";

export type PaymentMethod = "moncash" | "natcash" | "card" | "cash";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatarUrl?: string;
  verified?: boolean;
  rating?: number;
}

export interface Store extends Seller {
  bannerUrl?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  sellerId?: string;
  seller?: Seller;
  stock?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  code: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

/* ============================================================
   CONSTANTS & CONFIG
   ============================================================ */

const TOKEN_KEY = "mg_gestion_token";
const SUPPORT_EMAIL = "support@mggestion.com";
const SUPPORT_PHONE_1 = "+509 3700-0000";
const SUPPORT_PHONE_2 = "+509 4800-0000";

const COLORS = {
  primary: "#101828",
  accent: "#FF6B00",
  bg: "#F9FAFB",
  card: "#FFFFFF",
  text: "#101828",
  muted: "#667085",
  border: "#EAECF0",
  danger: "#F04438",
  success: "#12B76A",
};

/* ============================================================
   MOCK API SERVICE
   ============================================================ */

const friendlyError = (err: any) =>
  err?.message || "Yon erè fèt. Tanpri reye souplè.";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const API = {
  auth: {
    me: async () => ({
      user: { id: "usr_1", fullName: "Michel Guivendjy", email: "michel@example.com", phone: "+50937001122" }
    }),
    loginRequest: async (email: string) => ({ success: true }),
    register: async (data: any) => ({ success: true }),
    verifyEmail: async (data: any) => ({
      token: "mock_jwt_token_123",
      user: { id: "usr_1", fullName: data.fullName || "Michel Guivendjy", email: data.email }
    }),
    verifyLogin: async (data: any) => ({
      token: "mock_jwt_token_123",
      user: { id: "usr_1", fullName: "Michel Guivendjy", email: data.email }
    }),
    resendVerification: async (email: string) => ({ success: true }),
  },
  categories: {
    list: async () => ({
      categories: [
        { id: "cat_1", name: "Elektwonik" },
        { id: "cat_2", name: "Vètman" },
        { id: "cat_3", name: "Akseswa" },
      ]
    })
  },
  sellers: {
    list: async () => ({
      sellers: [
        { id: "sel_1", name: "Tech Store HT", verified: true, rating: 4.8 },
        { id: "sel_2", name: "Fashion Plus", verified: false, rating: 4.5 }
      ]
    }),
    getStore: async (id: string) => ({
      store: { id, name: "Tech Store HT", verified: true, rating: 4.8, description: "Meyè aparèy elektwonik nan peyi a." },
      products: []
    })
  },
  products: {
    list: async (params?: any) => ({
      products: [
        { id: "p1", name: "Smartphone Galaxy S23", price: 750, description: "Nouveau smartphone haute performance", categoryId: "cat_1" },
        { id: "p2", name: "Ecouteurs Bluetooth", price: 45, description: "Son haute qualité avec réduction de bruit", categoryId: "cat_3" }
      ]
    })
  },
  cart: {
    get: async () => ({ cart: { items: [], total: 0 } }),
    add: async (id: string, qty: number) => ({ cart: { items: [], total: 0 } }),
    update: async (id: string, qty: number) => ({ cart: { items: [], total: 0 } }),
    remove: async (id: string) => ({ cart: { items: [], total: 0 } })
  },
  orders: {
    list: async () => ({ orders: [] }),
    create: async (data: any) => ({ orderId: "ord_101", paymentId: "pay_101" })
  },
  payments: {
    status: async (id: string) => ({ status: "paid" })
  },
  account: {
    update: async (data: any) => ({ user: { id: "usr_1", fullName: data.fullName, email: "michel@example.com", phone: data.phone } })
  }
};

/* ============================================================
   GLOBAL STYLES
   ============================================================ */

const GLOBAL_CSS = `
  * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { margin: 0; background-color: #121212; color: ${COLORS.text}; }
  
  .mg-app { display: flex; justify-content: center; background: #0a0a0a; min-height: 100vh; }
  .mg-mobile-shell { width: 100%; max-width: 480px; background: ${COLORS.bg}; min-height: 100vh; position: relative; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
  
  .mg-page { flex: 1; display: flex; flex-direction: column; padding-bottom: 70px; }
  .mg-topbar { height: 56px; background: ${COLORS.card}; border-bottom: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 10; }
  .mg-topbar-title { font-weight: 700; font-size: 16px; }
  .mg-content { padding: 16px; flex: 1; }

  .mg-primary { background: ${COLORS.primary}; color: white; border: none; border-radius: 8px; padding: 12px 16px; font-weight: 600; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .mg-secondary { background: ${COLORS.card}; color: ${COLORS.text}; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
  
  .mg-products { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mg-product-card { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
  .mg-product-price { font-weight: 700; color: ${COLORS.accent}; margin-top: 4px; }

  .mg-bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 480px; background: ${COLORS.card}; border-top: 1px solid ${COLORS.border}; height: 60px; z-index: 20; }
  .mg-nav-inner { display: flex; height: 100%; }
  .mg-nav-item { flex: 1; border: none; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; color: ${COLORS.muted}; font-size: 10px; gap: 2px; cursor: pointer; }
  .mg-nav-item.active { color: ${COLORS.accent}; font-weight: 600; }

  .mg-form-light { display: flex; flex-direction: column; gap: 12px; }
  .mg-light-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 600; }
  .mg-light-field input { padding: 10px; border: 1px solid ${COLORS.border}; border-radius: 6px; outline: none; }

  .mg-toast { position: fixed; bottom: 75px; left: 50%; transform: translateX(-50%); background: #323232; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; z-index: 99; }
  .mg-spinner { animation: spin 1s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

/* ============================================================
   SHARED UI COMPONENTS
   ============================================================ */

function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="mg-topbar">
      {onBack ? (
        <button className="mg-secondary" onClick={onBack} style={{ padding: "4px 8px" }}>
          <ArrowLeft size={16} />
        </button>
      ) : (
        <div style={{ width: 24 }} />
      )}
      <div className="mg-topbar-title">{title}</div>
      <div style={{ width: 24 }} />
    </header>
  );
}

function Loading() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <Loader2 size={24} className="mg-spinner" style={{ margin: "0 auto" }} />
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: COLORS.muted }}>
      <div style={{ marginBottom: 8 }}>{icon}</div>
      <strong style={{ display: "block", color: COLORS.text }}>{title}</strong>
      {description && <p style={{ fontSize: 12, marginTop: 4 }}>{description}</p>}
    </div>
  );
}

function ProductCard({
  product,
  onOpen,
  onAdd,
  adding
}: {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
  adding: boolean;
}) {
  return (
    <div className="mg-product-card">
      <div onClick={onOpen} style={{ cursor: "pointer" }}>
        <div style={{ background: "#eee", height: 100, borderRadius: 8, marginBottom: 8 }} />
        <strong style={{ fontSize: 13, display: "block" }}>{product.name}</strong>
        <div className="mg-product-price">${product.price.toFixed(2)}</div>
      </div>
      <button className="mg-primary" onClick={onAdd} disabled={adding} style={{ marginTop: 8, padding: 6, fontSize: 12 }}>
        {adding ? <Loader2 size={12} className="mg-spinner" /> : <Plus size={12} />} Ajouter
      </button>
    </div>
  );
}

/* ============================================================
   AUTH SCREENS
   ============================================================ */

function LoginScreen({
  onRequestCode,
  onRegister,
  loading,
  error
}: {
  onRequestCode: (email: string) => void;
  onRegister: () => void;
  loading: boolean;
  error: string;
}) {
  const [email, setEmail] = useState("");
  return (
    <div className="mg-page mg-content" style={{ justifyContent: "center" }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: COLORS.danger, fontSize: 12 }}>{error}</p>}
      <form className="mg-form-light" onSubmit={(e) => { e.preventDefault(); onRequestCode(email); }}>
        <div className="mg-light-field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="mg-primary" type="submit" disabled={loading}>
          {loading ? <Loader2 size={16} className="mg-spinner" /> : "Recevoir le code"}
        </button>
      </form>
      <button onClick={onRegister} style={{ background: "none", border: "none", marginTop: 15, color: COLORS.accent, cursor: "pointer" }}>
        Créer un compte
      </button>
    </div>
  );
}

function RegisterScreen({
  onRegister,
  onLogin,
  loading,
  error
}: {
  onRegister: (f: string, e: string, p: string, ph: string) => void;
  onLogin: () => void;
  loading: boolean;
  error: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="mg-page mg-content" style={{ justifyContent: "center" }}>
      <h2>Inscription</h2>
      {error && <p style={{ color: COLORS.danger, fontSize: 12 }}>{error}</p>}
      <form className="mg-form-light" onSubmit={(e) => { e.preventDefault(); onRegister(fullName, email, "123456", phone); }}>
        <div className="mg-light-field">
          <label>Nom complet</label>
          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="mg-light-field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mg-light-field">
          <label>Téléphone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button className="mg-primary" type="submit" disabled={loading}>
          {loading ? <Loader2 size={16} className="mg-spinner" /> : "S'inscrire"}
        </button>
      </form>
      <button onClick={onLogin} style={{ background: "none", border: "none", marginTop: 15, color: COLORS.accent, cursor: "pointer" }}>
        Déjà un compte ? Se connecter
      </button>
    </div>
  );
}

function VerifyScreen({
  email,
  title,
  description,
  onVerify,
  onResend,
  onBack,
  loading,
  error
}: {
  email: string;
  title: string;
  description: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}) {
  const [code, setCode] = useState("");
  return (
    <div className="mg-page">
      <TopBar title={title} onBack={onBack} />
      <div className="mg-content">
        <p style={{ fontSize: 12 }}>{description} ({email})</p>
        {error && <p style={{ color: COLORS.danger, fontSize: 12 }}>{error}</p>}
        <form className="mg-form-light" onSubmit={(e) => { e.preventDefault(); onVerify(code); }}>
          <div className="mg-light-field">
            <label>Code de vérification</label>
            <input type="text" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <button className="mg-primary" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="mg-spinner" /> : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP SCREENS
   ============================================================ */

function HomeScreen({
  user,
  products,
  categories,
  sellers,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  loading,
  addingProductId,
  onAdd,
  onProduct,
  onSeller,
  onExplore,
  onAccount,
  onNotifications
}: any) {
  return (
    <div className="mg-page">
      <header className="mg-topbar">
        <strong>MG GESTION</strong>
        <Bell size={18} onClick={onNotifications} style={{ cursor: "pointer" }} />
      </header>
      <main className="mg-content">
        <div className="mg-light-field" style={{ marginBottom: 15 }}>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="mg-products">
              {products.map((p: Product) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpen={() => onProduct(p)}
                  onAdd={() => onAdd(p)}
                  adding={addingProductId === p.id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ExploreScreen({ products, loading, onAdd, onProduct, addingProductId, onBack }: any) {
  return (
    <div className="mg-page">
      <TopBar title="Explorer" onBack={onBack} />
      <main className="mg-content">
        {loading ? (
          <Loading />
        ) : (
          <div className="mg-products">
            {products.map((p: Product) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={() => onProduct(p)}
                onAdd={() => onAdd(p)}
                adding={addingProductId === p.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductDetailScreen({ product, onBack, onAdd, adding }: any) {
  return (
    <div className="mg-page">
      <TopBar title={product.name} onBack={onBack} />
      <main className="mg-content">
        <div style={{ background: "#eee", height: 200, borderRadius: 8, marginBottom: 15 }} />
        <h2>{product.name}</h2>
        <p style={{ color: COLORS.accent, fontWeight: 700, fontSize: 18 }}>${product.price.toFixed(2)}</p>
        <p style={{ fontSize: 13, color: COLORS.muted }}>{product.description}</p>
        <button className="mg-primary" onClick={onAdd} disabled={adding} style={{ marginTop: 20 }}>
          {adding ? <Loader2 size={16} className="mg-spinner" /> : "Ajouter au panier"}
        </button>
      </main>
    </div>
  );
}

function CartScreen({ cart, loading, onUpdate, onRemove, onCheckout, onExplore }: any) {
  return (
    <div className="mg-page">
      <TopBar title="Mon Panier" />
      <main className="mg-content">
        {!cart || cart.items.length === 0 ? (
          <EmptyState icon={<ShoppingCart size={32} />} title="Votre panier est vide" />
        ) : (
          <div>
            {cart.items.map((item: CartItem) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <strong>{item.product.name}</strong>
                  <div style={{ fontSize: 12 }}>${item.product.price} x {item.quantity}</div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ border: "none", background: "none", color: COLORS.danger }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="mg-primary" onClick={onCheckout} style={{ marginTop: 20 }}>
              Commander
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function CheckoutScreen({ user, cart, loading, onBack, onContinue }: any) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user.phone || "");
  const [method, setMethod] = useState<PaymentMethod>("moncash");

  return (
    <div className="mg-page">
      <TopBar title="Caisse" onBack={onBack} />
      <main className="mg-content">
        <form className="mg-form-light" onSubmit={(e) => { e.preventDefault(); onContinue(address, phone, method); }}>
          <div className="mg-light-field">
            <label>Adresse de livraison</label>
            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="mg-light-field">
            <label>Téléphone</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button className="mg-primary" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="mg-spinner" /> : "Payer"}
          </button>
        </form>
      </main>
    </div>
  );
}

function PaymentScreen({ status, onOrders }: any) {
  return (
    <div className="mg-page mg-content" style={{ justifyContent: "center", textAlign: "center" }}>
      {status === "paid" ? (
        <>
          <CheckCircle2 size={48} color={COLORS.success} style={{ margin: "0 auto" }} />
          <h2>Paiement Réussi !</h2>
          <button className="mg-primary" onClick={onOrders}>Voir mes commandes</button>
        </>
      ) : (
        <>
          <Loader2 size={48} className="mg-spinner" style={{ margin: "0 auto" }} />
          <h2>Traitement du paiement...</h2>
        </>
      )}
    </div>
  );
}

function OrdersScreen({ orders, loading, onRefresh }: any) {
  return (
    <div className="mg-page">
      <TopBar title="Commandes" />
      <main className="mg-content">
        {orders.length === 0 ? (
          <EmptyState icon={<Package size={32} />} title="Aucune commande" />
        ) : (
          orders.map((o: Order) => (
            <div key={o.id} style={{ padding: 10, border: `1px solid ${COLORS.border}`, borderRadius: 8, marginBottom: 10 }}>
              <strong>Commande #{o.code}</strong>
              <div>Statut: {o.status}</div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

function AccountScreen({ user, onSupport, onSettings, onLogout }: any) {
  return (
    <div className="mg-page">
      <TopBar title="Compte" />
      <main className="mg-content">
        <h3>{user.fullName}</h3>
        <p style={{ fontSize: 12, color: COLORS.muted }}>{user.email}</p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="mg-secondary" onClick={onSettings}>Paramètres</button>
          <button className="mg-secondary" onClick={onSupport}>Support & Aide</button>
          <button className="mg-primary" onClick={onLogout} style={{ background: COLORS.danger }}>Déconnexion</button>
        </div>
      </main>
    </div>
  );
}

function SupportScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mg-page">
      <TopBar title="Support & Aide" onBack={onBack} />
      <main className="mg-content">
        <h3>Besoin d'aide ?</h3>
        <p style={{ fontSize: 12 }}>Contactez-nous aux numéros suivants:</p>
        <ul>
          <li>Email: {SUPPORT_EMAIL}</li>
          <li>Tel 1: {SUPPORT_PHONE_1}</li>
          <li>Tel 2: {SUPPORT_PHONE_2}</li>
        </ul>
      </main>
    </div>
  );
}

function SettingsScreen({ user, onBack, onSave, loading }: any) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");

  return (
    <div className="mg-page">
      <TopBar title="Paramètres" onBack={onBack} />
      <main className="mg-content">
        <form className="mg-form-light" onSubmit={(e) => { e.preventDefault(); onSave({ fullName, phone }); }}>
          <div className="mg-light-field">
            <label>Nom complet</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="mg-light-field">
            <label>Téléphone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button className="mg-primary" type="submit" disabled={loading}>Sauvegarder</button>
        </form>
      </main>
    </div>
  );
}

function StoreScreen({ store, products, loading, onBack, onProduct, onAdd, addingProductId }: any) {
  return (
    <div className="mg-page">
      <TopBar title={store?.name || "Boutique"} onBack={onBack} />
      <main className="mg-content">
        {loading ? <Loading /> : <div className="mg-products">{products.map((p: any) => <ProductCard key={p.id} product={p} onOpen={() => onProduct(p)} onAdd={() => onAdd(p)} adding={addingProductId === p.id} />)}</div>}
      </main>
    </div>
  );
}

function BottomNav({ screen, onNavigate, cartItemCount }: any) {
  const items = [
    { id: "home", label: "Accueil", icon: <Home size={18} /> },
    { id: "explore", label: "Explorer", icon: <Search size={18} /> },
    { id: "cart", label: "Panier", icon: <ShoppingCart size={18} /> },
    { id: "orders", label: "Commandes", icon: <Package size={18} /> },
    { id: "account", label: "Compte", icon: <User size={18} /> },
  ];

  return (
    <nav className="mg-bottom-nav">
      <div className="mg-nav-inner">
        {items.map((item) => (
          <button
            key={item.id}
            className={`mg-nav-item ${screen === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ============================================================
   ROOT APP COMPONENT
   ============================================================ */

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [verifyPurpose, setVerifyPurpose] = useState<"register" | "login">("login");
  const [pendingEmail, setPendingEmail] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setCart(null);
    setOrders([]);
    setScreen("login");
  }, []);

  useEffect(() => {
    if (!token) return;
    API.auth.me().then((res) => setUser(res.user)).catch(() => handleLogout());
  }, [token, handleLogout]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, sellRes, prodRes] = await Promise.all([
        API.categories.list(),
        API.sellers.list(),
        API.products.list({ search, categoryId: selectedCategory }),
      ]);
      setCategories(catRes.categories);
      setSellers(sellRes.sellers);
      setProducts(prodRes.products);
    } catch (err) {
      showToast(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  const handleRequestLogin = async (email: string) => {
    setAuthLoading(true);
    try {
      await API.auth.loginRequest(email);
      setPendingEmail(email);
      setVerifyPurpose("login");
      setScreen("verify");
    } catch (err) {
      setAuthError(friendlyError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (fullName: string, email: string, password: string, phone: string) => {
    setAuthLoading(true);
    try {
      await API.auth.register({ fullName, email, password, phone });
      setPendingEmail(email);
      setVerifyPurpose("register");
      setScreen("verify");
    } catch (err) {
      setAuthError(friendlyError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setAuthLoading(true);
    try {
      const res = await API.auth.verifyLogin({ email: pendingEmail, code });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      setScreen("home");
    } catch (err) {
      setAuthError(friendlyError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      const res = await API.cart.add(product.id, 1);
      setCart(res.cart);
      showToast("Ajouté au panier");
    } catch (err) {
      showToast(friendlyError(err));
    } finally {
      setAddingProductId(null);
    }
  };

  if (!token && screen !== "login" && screen !== "register" && screen !== "verify") {
    return (
      <div className="mg-mobile-shell">
        <style>{GLOBAL_CSS}</style>
        <LoginScreen onRequestCode={handleRequestLogin} onRegister={() => setScreen("register")} loading={authLoading} error={authError} />
      </div>
    );
  }

  const showBottomNav = ["home", "explore", "cart", "orders", "account"].includes(screen);

  return (
    <div className="mg-app">
      <style>{GLOBAL_CSS}</style>
      <div className="mg-mobile-shell">
        {screen === "login" && <LoginScreen onRequestCode={handleRequestLogin} onRegister={() => setScreen("register")} loading={authLoading} error={authError} />}
        {screen === "register" && <RegisterScreen onRegister={handleRegister} onLogin={() => setScreen("login")} loading={authLoading} error={authError} />}
        {screen === "verify" && <VerifyScreen email={pendingEmail} title="Vérification" description="Entrez le code reçu" onVerify={handleVerifyCode} onResend={() => {}} onBack={() => setScreen("login")} loading={authLoading} error={authError} />}

        {user && screen === "home" && <HomeScreen user={user} products={products} categories={categories} sellers={sellers} search={search} setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} loading={loading} addingProductId={addingProductId} onAdd={handleAddToCart} onProduct={(p: Product) => { setSelectedProduct(p); setScreen("product"); }} onExplore={() => setScreen("explore")} onAccount={() => setScreen("account")} onNotifications={() => showToast("Pas de notifications")} />}
        {screen === "explore" && <ExploreScreen products={products} loading={loading} onAdd={handleAddToCart} onProduct={(p: Product) => { setSelectedProduct(p); setScreen("product"); }} onBack={() => setScreen("home")} />}
        {screen === "product" && selectedProduct && <ProductDetailScreen product={selectedProduct} onBack={() => setScreen("home")} onAdd={() => handleAddToCart(selectedProduct)} adding={addingProductId === selectedProduct.id} />}
        {screen === "cart" && <CartScreen cart={cart} loading={loading} onRemove={() => {}} onCheckout={() => setScreen("checkout")} />}
        {screen === "checkout" && user && <CheckoutScreen user={user} cart={cart} loading={loading} onBack={() => setScreen("cart")} onContinue={() => setScreen("payment")} />}
        {screen === "payment" && <PaymentScreen status={paymentStatus} onOrders={() => setScreen("orders")} />}
        {screen === "orders" && <OrdersScreen orders={orders} loading={loading} onRefresh={() => {}} />}
        {user && screen === "account" && <AccountScreen user={user} onSupport={() => setScreen("support")} onSettings={() => setScreen("settings")} onLogout={handleLogout} />}
        {screen === "support" && <SupportScreen onBack={() => setScreen("account")} />}
        {user && screen === "settings" && <SettingsScreen user={user} onBack={() => setScreen("account")} onSave={() => setScreen("account")} loading={loading} />}

        {showBottomNav && <BottomNav screen={screen} onNavigate={setScreen} cartItemCount={cart?.items?.length || 0} />}
        {toast && <div className="mg-toast">{toast}</div>}
      </div>
    </div>
  );
}