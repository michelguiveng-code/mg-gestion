import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Home, Search, Plus, ShoppingBag, User as UserIcon, Settings, Store as StoreIcon, Globe,
  ShieldCheck, CheckCircle2, ChevronRight, ArrowRight, X, Mail, Lock,
  Eye, EyeOff, Package, Trash2, Edit3, Upload, Image as ImageIcon,
  CreditCard, Phone, HelpCircle, RefreshCw, Loader2, Minus, Check,
  MapPin, Receipt, ShoppingCart, MessageCircle, ExternalLink, Star,
} from "lucide-react";

const API = (((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || "/api/v1").replace(/\/$/, "");
const SUPPORT_EMAIL = ((import.meta as any).env?.VITE_SUPPORT_EMAIL as string | undefined) || "support@mggestion.ht";
const SUPPORT_PHONE_1 = "+50942292126";
const SUPPORT_PHONE_2 = "+50955528787";

type Tab = "accueil" | "explorer" | "vann" | "panye" | "parametre";
type Lang = "ht" | "fr";
type AuthMode = "login" | "signup";

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

type CartItem = {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  id: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt?: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  location: string;
  stock: string;
  image: File | null;
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
    login: "Konekte",
    signup: "Enskri",
    logout: "Dekonekte",
    search: "Chèche yon pwodui, yon sèvis, yon boutik...",
    categories: "Kategori",
    stores: "Boutik verifye",
    products: "Pwodwi",
    noProducts: "Pa gen pwodwi pou montre pou kounye a.",
    noProductsDesc: "Lè vandè yo pibliye pwodwi, yo ap parèt isit la.",
    addProduct: "Ajoute pwodwi",
    myProducts: "Pwodwi mwen yo",
    createStore: "Kreye boutik",
    productName: "Non pwodwi a",
    description: "Deskripsyon",
    price: "Pri an HTG",
    category: "Kategori",
    location: "Kote",
    stock: "Stock",
    publish: "Pibliye pwodwi a",
    update: "Mete ajou",
    cancel: "Anile",
    delete: "Efase",
    addToCart: "Ajoute nan panye",
    added: "Pwodwi a antre nan panye ou.",
    emptyCart: "Panye ou vid.",
    browse: "Gade pwodwi yo",
    checkout: "Peye",
    total: "Total",
    subtotal: "Sou-total",
    payment: "Mwayen peman",
    moncash: "MonCash",
    natcash: "NatCash",
    pending: "An atant",
    paid: "Peye",
    failed: "Echwe",
    orders: "Kòmand",
    noOrders: "Ou poko gen kòmand.",
    support: "Sipò MG Gestion",
    supportText: "Kontakte ekip MG Gestion si ou bezwen asistans.",
    call: "Rele sipò",
    email: "Kontakte pa email",
    security: "Sekirite ak konfidansyalite",
    language: "Lang",
    verify: "Verifye email ou",
    codeSent: "Nou voye yon kòd 6 chif nan adrès email ou.",
    code: "Antre kòd verifikasyon an",
    resend: "Renvoye kòd la",
    change: "Chanje email",
    confirm: "Konfime",
    continue: "Kontinye",
    error: "Aksyon an pa fini. Verifye koneksyon ou epi eseye ankò.",
    network: "Pa gen koneksyon ak sèvè a.",
    successLogin: "Ou konekte avèk siksè.",
    successProduct: "Pwodwi a pibliye avèk siksè.",
    successUpdate: "Pwodwi a mete ajou.",
    successDelete: "Pwodwi a efase.",
    guest: "Konekte pou jwenn tout fonksyon kont ou.",
    verified: "Verifye",
    sales: "Vant",
    rating: "Nòt",
    available: "Disponib",
    out: "Pa gen stock",
    remove: "Retire",
    back: "Retounen",
    profile: "Pwofil",
    storeName: "Non boutik",
    storeDesc: "Deskripsyon boutik",
    create: "Kreye",
    supportNumber: "Telefòn",
  },
  fr: {
    appName: "MG GESTION",
    tagline: "Marketplace & Services en Haïti",
    home: "Accueil",
    explorer: "Explorer",
    sell: "Vendre",
    cart: "Panier",
    settings: "Compte",
    login: "Connexion",
    signup: "Inscription",
    logout: "Se déconnecter",
    search: "Rechercher un produit, un service, une boutique...",
    categories: "Catégories",
    stores: "Boutiques vérifiées",
    products: "Produits",
    noProducts: "Aucun produit à afficher pour le moment.",
    noProductsDesc: "Les produits apparaîtront ici lorsque les vendeurs en publieront.",
    addProduct: "Ajouter un produit",
    myProducts: "Mes produits",
    createStore: "Créer une boutique",
    productName: "Nom du produit",
    description: "Description",
    price: "Prix en HTG",
    category: "Catégorie",
    location: "Localisation",
    stock: "Stock",
    publish: "Publier le produit",
    update: "Mettre à jour",
    cancel: "Annuler",
    delete: "Supprimer",
    addToCart: "Ajouter au panier",
    added: "Produit ajouté au panier.",
    emptyCart: "Votre panier est vide.",
    browse: "Voir les produits",
    checkout: "Payer",
    total: "Total",
    subtotal: "Sous-total",
    payment: "Mode de paiement",
    moncash: "MonCash",
    natcash: "NatCash",
    pending: "En attente",
    paid: "Payé",
    failed: "Échec",
    orders: "Commandes",
    noOrders: "Vous n'avez pas encore de commande.",
    support: "Support MG Gestion",
    supportText: "Contactez l'équipe MG Gestion si vous avez besoin d'assistance.",
    call: "Appeler le support",
    email: "Contacter par email",
    security: "Sécurité et confidentialité",
    language: "Langue",
    verify: "Vérifiez votre email",
    codeSent: "Un code à 6 chiffres a été envoyé à votre adresse email.",
    code: "Entrez le code de vérification",
    resend: "Renvoyer le code",
    change: "Modifier l'email",
    confirm: "Confirmer",
    continue: "Continuer",
    error: "L'action n'a pas abouti. Vérifiez votre connexion et réessayez.",
    network: "Impossible de contacter le serveur.",
    successLogin: "Connexion réussie.",
    successProduct: "Produit publié avec succès.",
    successUpdate: "Produit mis à jour.",
    successDelete: "Produit supprimé.",
    guest: "Connectez-vous pour accéder à toutes les fonctions de votre compte.",
    verified: "Vérifiée",
    sales: "Ventes",
    rating: "Note",
    available: "Disponible",
    out: "Rupture de stock",
    remove: "Retirer",
    back: "Retour",
    profile: "Profil",
    storeName: "Nom de la boutique",
    storeDesc: "Description de la boutique",
    create: "Créer",
    supportNumber: "Téléphone",
  },
};

const C = {
  navy: "#0B1F3A",
  blue: "#2F5FFF",
  cyan: "#00C2D6",
  white: "#FFFFFF",
  black: "#0A0A0A",
  gray: "#F3F5F8",
};

const cats = ["Teknoloji", "Enèji", "Rad & Mode", "Atizana", "Manje", "Sèvis"];

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