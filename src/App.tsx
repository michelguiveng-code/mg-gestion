import React, { useState } from "react";
import { Globe, Search, ShoppingBag, Plus, Trash2, User as UserIcon, LogOut, CheckCircle, Store, ShieldCheck } from "lucide-react";

type Lang = "ht" | "fr";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  seller?: string;
}

interface UserType {
  fullName: string;
  email: string;
  phone?: string;
}

const dict = {
  ht: { appName: "MG GESTION", tagline: "Mache Dijital Ayiti", login: "Konekte", search: "Chache yon pwodui..." },
  fr: { appName: "MG GESTION", tagline: "Marché Digital Haïti", login: "Se connecter", search: "Rechercher un produit..." }
};

const cats = ["Teknoloji", "Enèji", "Mòd", "Kay", "Sèvis"];

function money(n: number) { 
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(n) || 0)} HTG`; 
}

function imageOf(p: Product) { 
  return p.imageUrl || p.images?.[0] || null; 
}

function initials(s: string) { 
  return s.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join("") || "MG"; 
}

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-xl">
      {msg}
    </div>
  );
}

function Header({
  user,
  lang,
  setLang,
  search,
  setSearch,
  onLogin,
  onAccount,
  t
}: {
  user: UserType | null;
  lang: Lang;
  setLang: (x: Lang) => void;
  search: string;
  setSearch: (x: string) => void;
  onLogin: () => void;
  onAccount: () => void;
  t: any;
}) {
  return (
    <header className="sticky top-0 z-40 overflow-hidden rounded-b-[34px] bg-[#0B1F3A] text-white shadow-2xl">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2F5FFF]/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button onClick={onAccount} className="flex min-w-0 items-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F5FFF] to-[#00C2D6] text-sm font-black">
              {user ? initials(user.fullName) : "MG"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">
                {user ? `Bon retou, ${user.fullName.split(" ")[0]}` : t.appName}
              </div>
              <div className="truncate text-[10px] font-semibold uppercase tracking-[.16em] text-cyan-200">
                {t.tagline}
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ht" ? "fr" : "ht")}
              className="flex h-9 items-center gap-1 rounded-xl bg-white/10 px-2.5 text-[10px] font-bold uppercase"
            >
              <Globe className="h-3.5 w-3.5 text-[#00C2D6]" />
              {lang}
            </button>
            {user ? (
              <button
                onClick={onAccount}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-black"
              >
                {initials(user.fullName)}
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="rounded-xl bg-[#2F5FFF] px-3.5 py-2 text-xs font-bold"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
          {lang === "ht"
            ? "Achte, vann ak jere tranzaksyon ou yo ak plis konfyans."
            : "Achetez, vendez et gérez vos transactions en toute confiance."}
        </p>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#00C2D6] focus:ring-2 focus:ring-[#00C2D6]/20"
          />
        </div>
      </div>
    </header>
  );
}

function ProductCard({
  product,
  onAddToCart
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  const img = imageOf(product);
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
          {img ? (
            <img src={img} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
              Pa gen imaj
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            {product.category}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{product.name}</h3>
        <p className="mt-1 text-base font-extrabold text-[#2F5FFF]">{money(product.price)}</p>
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] py-2.5 text-xs font-bold text-white transition active:scale-95"
      >
        <ShoppingBag className="h-3.5 w-3.5" /> Ajoute nan panye
      </button>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>("ht");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<UserType | null>({ fullName: "Michel Guivendjy", email: "michel@example.com" });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const products: Product[] = [
    { id: "1", name: "Inverter Solaire 3.5KW", price: 45000, category: "Enèji" },
    { id: "2", name: "Panneau Solaire 450W", price: 18500, category: "Enèji" },
    { id: "3", name: "Laptop Dell Core i7", price: 65000, category: "Teknoloji" }
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (p: Product) => {
    setCart((prev) => [...prev, p]);
    setToastMsg(`${p.name} ajoute nan panye a!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-20">
      <Toast msg={toastMsg} />
      <Header
        user={user}
        lang={lang}
        setLang={setLang}
        search={search}
        setSearch={setSearch}
        onLogin={() => {}}
        onAccount={() => {}}
        t={dict[lang]}
      />

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Pwodui Disponib yo</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>
    </div>
  );
}