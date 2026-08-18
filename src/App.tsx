import React, { useState } from "react";
import {
  Home,
  Search,
  Plus,
  ShoppingBag,
  User as UserIcon,
  Store as StoreIcon,
} from "lucide-react";

const API = (((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || "/api/v1").replace(/\/$/, "");
const SUPPORT_EMAIL = ((import.meta as any).env?.VITE_SUPPORT_EMAIL as string | undefined) || "support@mggestion.ht";
const SUPPORT_PHONE_1 = "+50942292126";
const SUPPORT_PHONE_2 = "+50955528787";

type Tab = "accueil" | "explorer" | "vann" | "panye" | "parametre";
type Lang = "ht" | "fr";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  location?: string;
  imageUrl?: string;
  images?: string[];
  sellerId?: string;
  sellerName?: string;
  sellerVerified?: boolean;
  storeId?: string;
  storeName?: string;
  stock?: number;
  rating?: number;
  salesCount?: number;
};

type Store = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  rating?: number;
  salesCount?: number;
  verified?: boolean;
  productCount?: number;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  isSeller?: boolean;
  store?: Store | null;
};

const T = {
  ht: {
    appName: "MG GESTION",
    tagline: "Marketplace & Sèvis an Ayiti",
    home: "Akèy",
    explorer: "Eksplore",
    sell: "Vann",
    cart: "Panye",
    settings: "Kont",
  },
  fr: {
    appName: "MG GESTION",
    tagline: "Marketplace & Services en Haïti",
    home: "Accueil",
    explorer: "Explorer",
    sell: "Vendre",
    cart: "Panier",
    settings: "Compte",
  },
};

function money(n: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(n) || 0)} HTG`;
}

function imageOf(p: Product) {
  return p.imageUrl || p.images?.[0] || null;
}

function initials(s: string) {
  return (
    s
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0].toUpperCase())
      .join("") || "MG"
  );
}

function payload<T>(x: any): T {
  return x?.data ?? x?.user ?? x;
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });
  const type = r.headers.get("content-type") || "";
  const body = type.includes("application/json") ? await r.json() : await r.text();
  if (!r.ok) {
    throw new Error(typeof body === "string" ? body : body?.message || body?.error || `HTTP ${r.status}`);
  }
  return body as T;
}

export default function App() {
  const [lang, setLang] = useState<Lang>("ht");
  const [tab, setTab] = useState<Tab>("accueil");
  const t = T[lang];

  return (
    <div className="min-h-screen bg-[#F3F5F8] pb-24 text-[#0A0A0A]">
      <header className="bg-[#0B1F3A] text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">{t.appName}</h1>
          <p className="text-xs text-cyan-400">{t.tagline}</p>
        </div>
        <button
          onClick={() => setLang(lang === "ht" ? "fr" : "ht")}
          className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition"
        >
          {lang.toUpperCase()}
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center my-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">{t.appName}</h2>
          <p className="text-gray-600 text-sm">{t.tagline}</p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 flex justify-around shadow-lg z-50">
        <button onClick={() => setTab("accueil")} className={`flex flex-col items-center text-xs font-medium ${tab === "accueil" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
          <Home className="w-5 h-5 mb-1" />
          {t.home}
        </button>
        <button onClick={() => setTab("explorer")} className={`flex flex-col items-center text-xs font-medium ${tab === "explorer" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
          <Search className="w-5 h-5 mb-1" />
          {t.explorer}
        </button>
        <button onClick={() => setTab("vann")} className={`flex flex-col items-center text-xs font-medium ${tab === "vann" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
          <Plus className="w-5 h-5 mb-1" />
          {t.sell}
        </button>
        <button onClick={() => setTab("panye")} className={`flex flex-col items-center text-xs font-medium ${tab === "panye" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
          <ShoppingBag className="w-5 h-5 mb-1" />
          {t.cart}
        </button>
        <button onClick={() => setTab("parametre")} className={`flex flex-col items-center text-xs font-medium ${tab === "parametre" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
          <UserIcon className="w-5 h-5 mb-1" />
          {t.settings}
        </button>
      </nav>
    </div>
  );
}