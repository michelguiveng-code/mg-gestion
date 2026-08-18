import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Home, Search, Plus, ShoppingBag, User, Settings, Store, Globe,
  ShieldCheck, CheckCircle2, ChevronRight, ArrowRight, X, Mail, Lock,
  Eye, EyeOff, Package, Trash2, Edit3, Upload, Image as ImageIcon,
  CreditCard, Phone, HelpCircle, RefreshCw, Loader2, Minus, Check,
  MapPin, Receipt, ShoppingCart, MessageCircle, ExternalLink, Star,
} from "lucide-react";

const API = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api/v1").replace(/\/$/, "");
const SUPPORT_EMAIL = (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined) || "support@mggestion.ht";
const SUPPORT_PHONE_1 = "+50942292126";
const SUPPORT_PHONE_2 = "+50955528787";

type Tab = "accueil" | "explorer" | "vann" | "panye" | "parametre";
type Lang = "ht" | "fr";
type AuthMode = "login" | "signup";
type Product = { id:string; name:string; description?:string; price:number; category?:string; location?:string; imageUrl?:string; images?:string[]; sellerId?:string; sellerName?:string; sellerVerified?:boolean; storeId?:string; storeName?:string; stock?:number; rating?:number; salesCount?:number };
type Store = { id:string; name:string; description?:string; logoUrl?:string; bannerUrl?:string; location?:string; rating?:number; salesCount?:number; verified?:boolean; productCount?:number };
type User = { id:string; fullName:string; email:string; avatarUrl?:string; isSeller?:boolean; store?:Store|null };
type CartItem = { id:string; productId:string; product?:Product; quantity:number; unitPrice:number; totalPrice:number };
type Order = { id:string; status:string; paymentStatus?:string; paymentMethod?:string; totalAmount:number; createdAt?:string };
type ProductForm = { name:string; description:string; price:string; category:string; location:string; stock:string; image:File|null };

const T = {
  ht:{appName:"MG GESTION",tagline:"Marketplace & Sèvis an Ayiti",home:"Akèy",explorer:"Eksplore",sell:"Vann",cart:"Panye",settings:"Kont",login:"Konekte",signup:"Enskri",logout:"Dekonekte",search:"Chèche yon pwodui, yon sèvis, yon boutik...",categories:"Kategori",stores:"Boutik verifye",products:"Pwodwi",noProducts:"Pa gen pwodwi pou montre pou kounye a.",noProductsDesc:"Lè vandè yo pibliye pwodwi, yo ap parèt isit la.",addProduct:"Ajoute pwodwi",myProducts:"Pwodwi mwen yo",createStore:"Kreye boutik",productName:"Non pwodwi a",description:"Deskripsyon",price:"Pri an HTG",category:"Kategori",location:"Kote",stock:"Stock",publish:"Pibliye pwodwi a",update:"Mete ajou",cancel:"Anile",delete:"Efase",addToCart:"Ajoute nan panye",added:"Pwodwi a antre nan panye ou.",emptyCart:"Panye ou vid.",browse:"Gade pwodwi yo",checkout:"Peye",total:"Total",subtotal:"Sou-total",payment:"Mwayen peman",moncash:"MonCash",natcash:"NatCash",pending:"An atant",paid:"Peye",failed:"Echwe",orders:"Kòmand",noOrders:"Ou poko gen kòmand.",support:"Sipò MG Gestion",supportText:"Kontakte ekip MG Gestion si ou bezwen asistans.",call:"Rele sipò",email:"Kontakte pa email",security:"Sekirite ak konfidansyalite",language:"Lang",verify:"Verifye email ou",codeSent:"Nou voye yon kòd 6 chif nan adrès email ou.",code:"Antre kòd verifikasyon an",resend:"Renvoye kòd la",change:"Chanje email",confirm:"Konfime",continue:"Kontinye",error:"Aksyon an pa fini. Verifye koneksyon ou epi eseye ankò.",network:"Pa gen koneksyon ak sèvè a.",successLogin:"Ou konekte avèk siksè.",successProduct:"Pwodwi a pibliye avèk siksè.",successUpdate:"Pwodwi a mete ajou.",successDelete:"Pwodwi a efase.",guest:"Konekte pou jwenn tout fonksyon kont ou.",verified:"Verifye",sales:"Vant",rating:"Nòt",available:"Disponib",out:"Pa gen stock",remove:"Retire",back:"Retounen",profile:"Pwofil",storeName:"Non boutik",storeDesc:"Deskripsyon boutik",create:"Kreye",supportNumber:"Telefòn"},
  fr:{appName:"MG GESTION",tagline:"Marketplace & Services en Haïti",home:"Accueil",explorer:"Explorer",sell:"Vendre",cart:"Panier",settings:"Compte",login:"Connexion",signup:"Inscription",logout:"Se déconnecter",search:"Rechercher un produit, un service, une boutique...",categories:"Catégories",stores:"Boutiques vérifiées",products:"Produits",noProducts:"Aucun produit à afficher pour le moment.",noProductsDesc:"Les produits apparaîtront ici lorsque les vendeurs en publieront.",addProduct:"Ajouter un produit",myProducts:"Mes produits",createStore:"Créer une boutique",productName:"Nom du produit",description:"Description",price:"Prix en HTG",category:"Catégorie",location:"Localisation",stock:"Stock",publish:"Publier le produit",update:"Mettre à jour",cancel:"Annuler",delete:"Supprimer",addToCart:"Ajouter au panier",added:"Produit ajouté au panier.",emptyCart:"Votre panier est vide.",browse:"Voir les produits",checkout:"Payer",total:"Total",subtotal:"Sous-total",payment:"Mode de paiement",moncash:"MonCash",natcash:"NatCash",pending:"En attente",paid:"Payé",failed:"Échec",orders:"Commandes",noOrders:"Vous n'avez pas encore de commande.",support:"Support MG Gestion",supportText:"Contactez l'équipe MG Gestion si vous avez besoin d'assistance.",call:"Appeler le support",email:"Contacter par email",security:"Sécurité et confidentialité",language:"Langue",verify:"Vérifiez votre email",codeSent:"Un code à 6 chiffres a été envoyé à votre adresse email.",code:"Entrez le code de vérification",resend:"Renvoyer le code",change:"Modifier l'email",confirm:"Confirmer",continue:"Continuer",error:"L'action n'a pas abouti. Vérifiez votre connexion et réessayez.",network:"Impossible de contacter le serveur.",successLogin:"Connexion réussie.",successProduct:"Produit publié avec succès.",successUpdate:"Produit mis à jour.",successDelete:"Produit supprimé.",guest:"Connectez-vous pour accéder à toutes les fonctions de votre compte.",verified:"Vérifiée",sales:"Ventes",rating:"Note",available:"Disponible",out:"Rupture de stock",remove:"Retirer",back:"Retour",profile:"Profil",storeName:"Nom de la boutique",storeDesc:"Description de la boutique",create:"Créer",supportNumber:"Téléphone"}
};

const C = {navy:"#0B1F3A",blue:"#2F5FFF",cyan:"#00C2D6",white:"#FFFFFF",black:"#0A0A0A",gray:"#F3F5F8"};
const cats = ["Teknoloji","Enèji","Rad & Mode","Atizana","Manje","Sèvis"];

function money(n:number){return `${new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(Number(n)||0)} HTG`;}
function imageOf(p:Product){return p.imageUrl || p.images?.[0] || null;}
function initials(s:string){return s.trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("") || "MG";}
function payload<T>(x:any):T{return x?.data ?? x?.user ?? x;}
async function api<T>(path:string, options:RequestInit={}):Promise<T>{
  const r=await fetch(`${API}${path}`,{credentials:"include",...options,headers:{Accept:"application/json",...(options.body instanceof FormData?{}:{"Content-Type":"application/json"}),...(options.headers||{})}});
  const type=r.headers.get("content-type")||"";
  const body=type.includes("application/json")?await r.json():await r.text();
  if(!r.ok) throw new Error(typeof body==="string"?body:(body?.message||body?.error||`HTTP ${r.status}`));
  return body as T;
}

function Toast({msg,onClose}:{msg:{type:"ok"|"err"|"info";text:string}|null;onClose:()=>void}){
  if(!msg)return null;
  return <div className="fixed left-4 right-4 top-4 z-[100] mx-auto max-w-md"><div className={`flex items-center gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-2xl backdrop-blur ${msg.type==="err"?"border-red-200 text-red-700":"border-cyan-200 text-[#0B1F3A]"}`}><CheckCircle2 className="h-5 w-5"/><span className="flex-1 text-sm font-semibold">{msg.text}</span><button onClick={onClose}><X className="h-4 w-4"/></button></div></div>;
}

function Header({user,lang,setLang,search,setSearch,onLogin,onAccount,t}:{user:User|null;lang:Lang;setLang:(x:Lang)=>void;search:string;setSearch:(x:string)=>void;onLogin:()=>void;onAccount:()=>void;t:any}){
  return <header className="sticky top-0 z-40 overflow-hidden rounded-b-[34px] bg-[#0B1F3A] text-white shadow-2xl"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2F5FFF]/30 blur-3xl"/><div className="relative mx-auto max-w-6xl px-4 pb-5 pt-4 sm:px-6"><div className="flex items-center justify-between gap-3"><button onClick={onAccount} className="flex min-w-0 items-center gap-3 text-left"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F5FFF] to-[#00C2D6] text-sm font-black">{user?initials(user.fullName):"MG"}</div><div className="min-w-0"><div className="truncate text-sm font-bold">{user?`Bon retou, ${user.fullName.split(" ")[0]}`:t.appName}</div><div className="truncate text-[10px] font-semibold uppercase tracking-[.16em] text-cyan-200">{t.tagline}</div></div></button><div className="flex items-center gap-2"><button onClick={()=>setLang(lang==="ht"?"fr":"ht")} className="flex h-9 items-center gap-1 rounded-xl bg-white/10 px-2.5 text-[10px] font-bold uppercase"><Globe className="h-3.5 w-3.5 text-[#00C2D6]"/>{lang}</button>{user?<button onClick={onAccount} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-black">{initials(user.fullName)}</button>:<button onClick={onLogin} className="rounded-xl bg-[#2F5FFF] px-3.5 py-2 text-xs font-bold">{t.login}</button>}</div></div><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">{lang==="ht"?"Achte, vann ak jere tranzaksyon ou yo ak plis konfyans.":"Achetez, vendez et gérez vos transactions en toute confiance."}</p><div className="relative mt-4"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#00C2D6] focus:ring-2 focus:ring-[#00C2D6]/20"/></div></div></header>;
}

function Nav({tab,setTab,user,onLogin,t}:{tab:Tab;setTab:(x:Tab)=>void;user:User|null;onLogin:()=>void;t:any}){
  const item=(key:Tab,label:string,icon:React.ReactNode)=><button onClick={()=>setTab(key)} className={`flex min-w-[60px] flex-col items-center gap-1 rounded-2xl px-2 py-2 ${tab===key?"text-[#2F5FFF]":"text-slate-400"}`}>{icon}<span className="text-[9px] font-bold">{label}</span></button>;
  return <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3"><div className="mx-auto flex max-w-lg items-end justify-between rounded-[30px] border border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl">{item("accueil",t.home,<Home className="h-5 w-5"/>)}{item("explorer",t.explorer,<Search className="h-5 w-5"/>)}<button onClick={()=>user?setTab("vann"):onLogin()} className="relative -mt-7 flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0B1F3A] via-[#2F5FFF] to-[#00C2D6] text-white shadow-2xl"><Plus className="h-7 w-7"/></button>{item("panye",t.cart,<ShoppingBag className="h-5 w-5"/>)}{item("parametre",t.settings,<User className="h-5 w-5"/>)}</div></nav>;
}

function Empty({icon,title,desc,action,onAction}:{icon:React.ReactNode;title:string;desc?:string;action?:string;onAction?:()=>void}){return <div className="flex flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3F5F8] text-[#2F5FFF]">{icon}</div><h3 className="text-base font-bold text-[#0A0A0A]">{title}</h3>{desc&&<p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{desc}</p>}{action&&onAction&&<button onClick={onAction} className="mt-5 rounded-2xl bg-[#2F5FFF] px-5 py-3 text-sm font-bold text-white">{action}</button>}</div>}

function ProductCard({p,t,onOpen,onAdd}:{p:Product;t:any;onOpen:(p:Product)=>void;onAdd:(p:Product)=>void}){const im=imageOf(p);return <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><button onClick={()=>onOpen(p)} className="block w-full text-left"><div className="relative aspect-[.92] overflow-hidden bg-gradient-to-br from-[#0B1F3A]/10 via-[#2F5FFF]/10 to-[#00C2D6]/15">{im?<img src={im} alt={p.name} className="h-full w-full object-cover transition duration-500 hover:scale-105"/>:<div className="flex h-full items-center justify-center text-[#2F5FFF]"><ImageIcon className="h-12 w-12 opacity-30"/></div>}{p.sellerVerified&&<span className="absolute left-3 top-3 flex items-center gap-1 rounded-xl bg-white/90 px-2.5 py-1.5 text-[10px] font-bold shadow"><CheckCircle2 className="h-3.5 w-3.5 text-[#2F5FFF]"/>{t.verified}</span>}</div><div className="space-y-2 p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.category||t.products}</span><h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5">{p.name}</h3><div className="flex items-end justify-between gap-2"><div><p className="font-mono text-base font-bold text-[#0B1F3A]">{money(p.price)}</p><p className="mt-1 truncate text-[10px] text-slate-400">{p.storeName||p.sellerName||""}</p></div>{typeof p.rating==="number"&&<span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Star className="h-3 w-3 fill-current text-[#2F5FFF]"/>{p.rating.toFixed(1)}</span>}</div></div></button><div className="px-4 pb-4"><button disabled={p.stock===0} onClick={()=>onAdd(p)} className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B1F3A] text-xs font-bold text-white hover:bg-[#2F5FFF] disabled:bg-slate-200 disabled:text-slate-400"><ShoppingCart className="h-4 w-4"/>{p.stock===0?t.out:t.addToCart}</button></div></article>}

function Home({products,stores,loading,t,onExplore,onCategory,onProduct,onStore,onAdd}:{products:Product[];stores:Store[];loading:boolean;t:any;onExplore:()=>void;onCategory:(x:string)=>void;onProduct:(x:Product)=>void;onStore:(x:Store)=>void;onAdd:(x:Product)=>void}){return <div className="space-y-7"><section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#0B1F3A] via-[#2F5FFF] to-[#00C2D6] p-6 text-white shadow-xl"><div className="relative z-10"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-100"><ShieldCheck className="h-4 w-4"/>Paiement vérifiable</div><h1 className="mt-4 text-2xl font-bold">Achte ak konfyans</h1><p className="mt-3 max-w-lg text-sm leading-6 text-white/80">{t.noProductsDesc}</p><button onClick={onExplore} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#0B1F3A]">{t.explorer}<ArrowRight className="h-4 w-4"/></button></div></section><section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#0B1F3A]">{t.categories}</h2><button onClick={onExplore} className="text-xs font-bold text-[#2F5FFF]">{t.explorer}</button></div><div className="flex gap-2 overflow-x-auto pb-1">{cats.map(c=><button key={c} onClick={()=>onCategory(c)} className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0B1F3A]">{c}</button>)}</div></section><section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#0B1F3A]">{t.stores}</h2><Store className="h-4 w-4 text-[#2F5FFF]"/></div><div className="flex gap-3 overflow-x-auto pb-1">{stores.length?stores.map(s=><button key={s.id} onClick={()=>onStore(s)} className="flex min-w-[230px] items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-sm"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0B1F3A] text-sm font-black text-white">{s.logoUrl?<img src={s.logoUrl} alt="" className="h-full w-full object-cover"/>:initials(s.name)}</div><div className="min-w-0"><div className="flex items-center gap-1"><span className="truncate text-sm font-bold">{s.name}</span>{s.verified&&<CheckCircle2 className="h-4 w-4 shrink-0 text-[#2F5FFF]"/>}</div><p className="mt-1 text-xs text-slate-500">{s.location||"Haïti"}</p><p className="mt-1 text-[10px] text-slate-400">{s.salesCount||0} {t.sales}</p></div><ChevronRight className="h-4 w-4 text-slate-300"/></button>):<div className="w-full rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">{t.noProductsDesc}</div>}</div></section><section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#0B1F3A]">{t.products}</h2><button onClick={onExplore} className="text-xs font-bold text-[#2F5FFF]">{t.explorer}</button></div>{loading?<div className="grid grid-cols-2 gap-3"><div className="h-72 animate-pulse rounded-[28px] bg-white"/><div className="h-72 animate-pulse rounded-[28px] bg-white"/></div>:products.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{products.slice(0,6).map(p=><ProductCard key={p.id} p={p} t={t} onOpen={onProduct} onAdd={onAdd}/>)}</div>:<Empty icon={<Package className="h-7 w-7"/>} title={t.noProducts} desc={t.noProductsDesc}/>}</section></div>}

function Explorer({products,loading,query,category,t,onCategory,onProduct,onAdd,onRefresh}:{products:Product[];loading:boolean;query:string;category:string;t:any;onCategory:(x:string)=>void;onProduct:(p:Product)=>void;onAdd:(p:Product)=>void;onRefresh:()=>void}){const list=useMemo(()=>products.filter(p=>{const q=query.trim().toLowerCase();const cq=!category||p.category?.toLowerCase()===category.toLowerCase();if(!cq)return false;if(!q)return true;return [p.name,p.description,p.category,p.location,p.sellerName,p.storeName].filter(Boolean).join(" ").toLowerCase().includes(q)}),[products,query,category]);return <div className="space-y-5"><div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2F5FFF]">{t.explorer}</p><h1 className="mt-1 text-2xl font-bold text-[#0B1F3A]">{t.products}</h1></div><button onClick={onRefresh} className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white"><RefreshCw className="h-4 w-4"/></button></div><div className="flex gap-2 overflow-x-auto">{cats.map(c=><button key={c} onClick={()=>onCategory(category===c?"":c)} className={`shrink-0 rounded-2xl border px-4 py-2.5 text-xs font-bold ${category===c?"border-[#2F5FFF] bg-blue-50 text-[#2F5FFF]":"border-slate-200 bg-white"}`}>{c}</button>)}</div>{loading?<div className="grid grid-cols-2 gap-3"><div className="h-72 animate-pulse rounded-[28px] bg-white"/><div className="h-72 animate-pulse rounded-[28px] bg-white"/></div>:list.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{list.map(p=><ProductCard key={p.id} p={p} t={t} onOpen={onProduct} onAdd={onAdd}/>)}</div>:<Empty icon={<Search className="h-7 w-7"/>} title={t.noProducts} desc={query?`Recherche: ${query}`:t.noProductsDesc}/>}</div>}

function Seller({user,products,loading,t,onAdd,onEdit,onDelete,onStore}:{user:User|null;products:Product[];loading:boolean;t:any;onAdd:()=>void;onEdit:(p:Product)=>void;onDelete:(p:Product)=>void;onStore:()=>void}){if(!user)return <Empty icon={<Store className="h-7 w-7"/>} title={t.login} desc={t.guest}/>;if(!user.store)return <section className="rounded-[34px] bg-[#0B1F3A] p-6 text-white shadow-xl"><Store className="h-8 w-8 text-cyan-200"/><h1 className="mt-5 text-2xl font-bold">{t.createStore}</h1><p className="mt-2 text-sm leading-6 text-white/70">Kreye boutik ou pou pibliye pwodwi reyèl.</p><button onClick={onStore} className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0B1F3A]">{t.createStore}</button></section>;return <div className="space-y-5"><section className="rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><h1 className="text-xl font-bold">{user.store.name}</h1>{user.store.verified&&<CheckCircle2 className="h-5 w-5 text-[#2F5FFF]"/>}</div><p className="mt-1 text-xs text-slate-500">{user.store.location||"Haïti"}</p></div><button onClick={onAdd} className="flex h-10 items-center gap-2 rounded-2xl bg-[#2F5FFF] px-4 text-xs font-bold text-white"><Plus className="h-4 w-4"/>{t.addProduct}</button></div><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-[#F3F5F8] p-3"><p className="text-[9px] text-slate-400">{t.products}</p><p className="font-mono font-bold">{products.length}</p></div><div className="rounded-2xl bg-[#F3F5F8] p-3"><p className="text-[9px] text-slate-400">{t.sales}</p><p className="font-mono font-bold">{user.store.salesCount||0}</p></div><div className="rounded-2xl bg-[#F3F5F8] p-3"><p className="text-[9px] text-slate-400">{t.rating}</p><p className="font-mono font-bold">{user.store.rating?.toFixed(1)||"-"}</p></div></div></section>{loading?<div className="h-40 animate-pulse rounded-3xl bg-white"/>:products.length?<div className="space-y-3">{products.map(p=><div key={p.id} className="flex items-center gap-3 rounded-3xl border bg-white p-3"><div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#F3F5F8]">{imageOf(p)?<img src={imageOf(p)!} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-slate-300"><ImageIcon className="h-6 w-6"/></div>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="font-mono text-xs font-bold text-[#2F5FFF]">{money(p.price)}</p><p className="text-[10px] text-slate-400">{p.stock||0} {t.available}</p></div><button onClick={()=>onEdit(p)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FFF]"><Edit3 className="h-4 w-4"/></button><button onClick={()=>onDelete(p)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 className="h-4 w-4"/></button></div>)}</div>:<Empty icon={<Package className="h-7 w-7"/>} title={t.noProducts} desc={t.noProductsDesc} action={t.addProduct} onAction={onAdd}/>}</div>}

function Cart({user,cart,loading,t,onQty,onRemove,onCheckout,onBrowse}:{user:User|null;cart:CartItem[];loading:boolean;t:any;onQty:(i:CartItem,n:number)=>void;onRemove:(i:CartItem)=>void;onCheckout:()=>void;onBrowse:()=>void}){if(!user)return <Empty icon={<ShoppingBag className="h-7 w-7"/>} title={t.login} desc={t.guest}/>;if(loading)return <div className="h-52 animate-pulse rounded-3xl bg-white"/>;if(!cart.length)return <Empty icon={<ShoppingCart className="h-7 w-7"/>} title={t.emptyCart} desc={t.noProductsDesc} action={t.browse} onAction={onBrowse}/>;const total=cart.reduce((a,i)=>a+(i.totalPrice||i.unitPrice*i.quantity),0);return <div className="space-y-4"><h1 className="text-2xl font-bold text-[#0B1F3A]">{t.cart}</h1>{cart.map(i=><div key={i.id} className="flex gap-3 rounded-3xl border bg-white p-3"><div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F3F5F8]">{i.product&&imageOf(i.product)?<img src={imageOf(i.product)!} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-slate-300"><Package className="h-7 w-7"/></div>}</div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{i.product?.name||"Produit"}</p><p className="font-mono text-xs font-bold text-[#2F5FFF]">{money(i.unitPrice)}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center overflow-hidden rounded-xl border"><button onClick={()=>onQty(i,Math.max(1,i.quantity-1))} className="flex h-8 w-8 items-center justify-center"><Minus className="h-3.5 w-3.5"/></button><span className="flex h-8 min-w-8 items-center justify-center border-x font-mono text-xs">{i.quantity}</span><button onClick={()=>onQty(i,i.quantity+1)} className="flex h-8 w-8 items-center justify-center"><Plus className="h-3.5 w-3.5"/></button></div><button onClick={()=>onRemove(i)} className="text-[10px] font-bold text-red-600">{t.remove}</button></div></div></div>)}<div className="rounded-[30px] bg-[#0B1F3A] p-5 text-white"><div className="flex justify-between text-sm"><span className="text-white/60">{t.subtotal}</span><span className="font-mono font-bold">{money(total)}</span></div><div className="my-4 h-px bg-white/10"/><div className="flex justify-between"><span className="font-bold">{t.total}</span><span className="font-mono text-xl font-bold text-cyan-200">{money(total)}</span></div><button onClick={onCheckout} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2F5FFF] to-[#00C2D6] text-sm font-black"><CreditCard className="h-4 w-4"/>{t.checkout}</button></div></div>}

function Orders({user,orders,loading,t,onRefresh}:{user:User|null;orders:Order[];loading:boolean;t:any;onRefresh:()=>void}){if(!user)return <Empty icon={<Receipt className="h-7 w-7"/>} title={t.login} desc={t.guest}/>;return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-[#0B1F3A]">{t.orders}</h1><button onClick={onRefresh} className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white"><RefreshCw className="h-4 w-4"/></button></div>{loading?<div className="h-40 animate-pulse rounded-3xl bg-white"/>:orders.length?orders.map(o=><div key={o.id} className="rounded-3xl border bg-white p-4"><div className="flex justify-between"><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Nimewo kòmand</p><p className="mt-1 font-mono text-xs font-bold">{o.id}</p></div><span className="rounded-xl bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-[#2F5FFF]">{o.paymentStatus||o.status||t.pending}</span></div><div className="mt-4 flex justify-between"><span className="text-xs text-slate-500">{t.total}</span><span className="font-mono font-bold">{money(o.totalAmount)}</span></div>{(o.paymentStatus||o.status)==="pending"&&<p className="mt-4 rounded-2xl bg-blue-50 p-3 text-xs leading-5 text-[#0B1F3A]">{langNotice(t)}</p>}</div>):<Empty icon={<Receipt className="h-7 w-7"/>} title={t.noOrders} desc={t.noProductsDesc}/>}</div>}
function langNotice(t:any){return t.ht?"":t.paymentPending||"Nou ap tann konfimasyon sèvè a."}

function Account({user,lang,onLang,onLogin,onLogout,onSeller,onSupport,t}:{user:User|null;lang:Lang;onLang:()=>void;onLogin:()=>void;onLogout:()=>void;onSeller:()=>void;onSupport:()=>void;t:any}){return <div className="space-y-4">{user?<section className="rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-slate-200"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2F5FFF] to-[#00C2D6] text-lg font-black text-white">{initials(user.fullName)}</div><div className="min-w-0"><h1 className="truncate text-xl font-bold">{user.fullName}</h1><p className="truncate text-xs text-slate-500">{user.email}</p></div></div></section>:<section className="rounded-[34px] bg-[#0B1F3A] p-6 text-white"><User className="h-8 w-8 text-cyan-200"/><h1 className="mt-4 text-2xl font-bold">{t.profile}</h1><p className="mt-2 text-sm leading-6 text-white/70">{t.guest}</p><button onClick={onLogin} className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0B1F3A]">{t.login}</button></section>}<div className="overflow-hidden rounded-[30px] border bg-white"><Option icon={<Store className="h-4 w-4"/>} label={t.createStore} onClick={onSeller}/><Option icon={<Globe className="h-4 w-4"/>} label={t.language} value={lang.toUpperCase()} onClick={onLang}/><Option icon={<ShieldCheck className="h-4 w-4"/>} label={t.security} onClick={()=>{}}/><Option icon={<HelpCircle className="h-4 w-4"/>} label={t.support} onClick={onSupport}/></div>{user&&<button onClick={onLogout} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-bold text-red-600">{t.logout}</button>}</div>}
function Option({icon,label,value,onClick}:{icon:React.ReactNode;label:string;value?:string;onClick:()=>void}){return <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-0 hover:bg-[#F3F5F8]"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2F5FFF]">{icon}</div><span className="flex-1 text-sm font-semibold">{label}</span>{value&&<span className="text-xs font-bold text-[#2F5FFF]">{value}</span>}<ChevronRight className="h-4 w-4 text-slate-300"/></button>}

function Support({t}:{t:any}){return <div className="space-y-5"><section className="rounded-[34px] bg-[#0B1F3A] p-6 text-white shadow-xl"><MessageCircle className="h-8 w-8 text-cyan-200"/><h1 className="mt-5 text-2xl font-bold">{t.support}</h1><p className="mt-2 text-sm leading-6 text-white/70">{t.supportText}</p></section><div className="space-y-3"><a href={`tel:${SUPPORT_PHONE_1}`} className="flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm"><Phone className="h-5 w-5 text-[#2F5FFF]"/><div className="flex-1"><p className="text-[10px] font-bold uppercase text-slate-400">{t.call}</p><p className="mt-1 font-bold">+509 4229-2126</p></div><ExternalLink className="h-4 w-4 text-slate-300"/></a><a href={`tel:${SUPPORT_PHONE_2}`} className="flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm"><Phone className="h-5 w-5 text-[#2F5FFF]"/><div className="flex-1"><p className="text-[10px] font-bold uppercase text-slate-400">{t.call}</p><p className="mt-1 font-bold">+509 5552-8787</p></div><ExternalLink className="h-4 w-4 text-slate-300"/></a><a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm"><Mail className="h-5 w-5 text-[#2F5FFF]"/><div className="flex-1"><p className="text-[10px] font-bold uppercase text-slate-400">{t.email}</p><p className="mt-1 font-bold">{SUPPORT_EMAIL}</p></div><ExternalLink className="h-4 w-4 text-slate-300"/></a></div></div>}

function Auth({open,mode,step,email,name,password,otp,busy,t,onClose,setMode,setEmail,setName,setPassword,setOtp,onCredentials,onOtp,onResend}:{open:boolean;mode:AuthMode;step:"credentials"|"otp";email:string;name:string;password:string;otp:string;busy:boolean;t:any;onClose:()=>void;setMode:(x:AuthMode)=>void;setEmail:(x:string)=>void;setName:(x:string)=>void;setPassword:(x:string)=>void;setOtp:(x:string)=>void;onCredentials:(e:FormEvent)=>void;onOtp:(e:FormEvent)=>void;onResend:()=>void}){const [show,setShow]=useState(false);if(!open)return null;return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#0B1F3A]/75 p-3 backdrop-blur-md sm:items-center"><div className="w-full max-w-lg overflow-hidden rounded-[36px] bg-white shadow-2xl"><div className="bg-[#0B1F3A] p-5 text-white"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F5FFF] to-[#00C2D6] font-black">MG</div><div><p className="text-[10px] uppercase tracking-[.18em] text-cyan-200">{t.appName}</p><h2 className="mt-1 text-lg font-bold">{step==="otp"?t.verify:mode==="login"?t.login:t.signup}</h2></div></div><button onClick={onClose}><X className="h-5 w-5"/></button></div>{step==="otp"&&<p className="mt-4 rounded-2xl bg-white/10 p-3 text-xs text-white/70">{t.codeSent}<br/><b className="font-mono text-cyan-100">{email}</b></p>}</div><div className="p-5">{step==="credentials"?<form onSubmit={onCredentials} className="space-y-4">{mode==="signup"&&<Field label="Non konplè" value={name} onChange={setName}/>}<Field label="Email" value={email} onChange={setEmail}/><div><label className="mb-1.5 block text-xs font-bold">Modpas</label><div className="relative"><Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="h-12 w-full rounded-2xl border border-slate-200 bg-[#F3F5F8] pl-11 pr-11 text-sm outline-none focus:border-[#2F5FFF] focus:bg-white"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div><button disabled={busy} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5FFF] text-sm font-bold text-white shadow-lg shadow-blue-500/25 disabled:opacity-50">{busy&&<Loader2 className="h-4 w-4 animate-spin"/>}{mode==="login"?t.login:t.signup}</button><div className="text-center"><button type="button" onClick={()=>setMode(mode==="login"?"signup":"login")} className="text-xs font-bold text-[#2F5FFF]">{mode==="login"?"Ou pa gen kont? Enskri":"Ou gen deja yon kont? Konekte"}</button></div></form>:<form onSubmit={onOtp} className="space-y-4"><Field label={t.code} value={otp} onChange={setOtp} placeholder="123456"/><button disabled={busy} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5FFF] text-sm font-bold text-white shadow-lg">{busy&&<Loader2 className="h-4 w-4 animate-spin"/>}{t.confirm}</button><div className="flex justify-between text-xs font-bold text-[#2F5FFF]"><button type="button" onClick={onResend}>{t.resend}</button></div></form>}</div></div></div>}

function Field({label,value,onChange,placeholder=""}:{label:string;value:string;onChange:(x:string)=>void;placeholder?:string}){return <div><label className="mb-1.5 block text-xs font-bold">{label}</label><input value={value} onChange={e=>onChange(e.target.value)} required placeholder={placeholder} className="h-12 w-full rounded-2xl border border-slate-200 bg-[#F3F5F8] px-4 text-sm outline-none focus:border-[#2F5FFF] focus:bg-white"/></div>}

export default function MGGestionApp() {
  const [lang, setLang] = useState<Lang>("ht");
  const [tab, setTab] = useState<Tab>("accueil");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [toast, setToast] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authStep, setAuthStep] = useState<"credentials" | "otp">("credentials");
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailStore, setDetailStore] = useState<Store | null>(null);
  const [storeModal, setStoreModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [checkoutModal, setCheckoutModal] = useState(false);

  const t = T[lang];

  const notify = (text: string, type: "ok" | "err" | "info" = "ok") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        api<any>("/products").catch(() => []),
        api<any>("/stores").catch(() => [])
      ]);
      setProducts(Array.isArray(pRes) ? pRes : pRes?.products || []);
      setStores(Array.isArray(sRes) ? sRes : sRes?.stores || []);
    } catch (e: any) {
      notify(e.message || t.network, "err");
    } finally {
      setLoading(false);
    }
  };

  const loadUserContext = async () => {
    try {
      const uRes = await api<any>("/auth/me");
      const u = payload<User>(uRes);
      setUser(u);
      if (u) {
        const [cRes, oRes] = await Promise.all([
          api<any>("/cart").catch(() => []),
          api<any>("/orders").catch(() => [])
        ]);
        setCart(Array.isArray(cRes) ? cRes : cRes?.items || []);
        setOrders(Array.isArray(oRes) ? oRes : oRes?.orders || []);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadAll();
    loadUserContext();
  }, []);

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      if (authMode === "signup") {
        await api("/auth/signup", { method: "POST", body: JSON.stringify({ fullName: authName, email: authEmail, password: authPassword }) });
        setAuthStep("otp");
        notify(t.codeSent, "info");
      } else {
        await api("/auth/login", { method: "POST", body: JSON.stringify({ email: authEmail, password: authPassword }) });
        await loadUserContext();
        setAuthOpen(false);
        notify(t.successLogin);
      }
    } catch (err: any) {
      notify(err.message || t.error, "err");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleOtp = async (e: FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      await api("/auth/verify-otp", { method: "POST", body: JSON.stringify({ email: authEmail, code: authOtp }) });
      await loadUserContext();
      setAuthOpen(false);
      setAuthStep("credentials");
      notify(t.successLogin);
    } catch (err: any) {
      notify(err.message || t.error, "err");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    setCart([]);
    setOrders([]);
    setTab("accueil");
    notify("Dekonekte avèk siksè.");
  };

  const addToCart = async (p: Product) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    try {
      const res = await api<any>("/cart", { method: "POST", body: JSON.stringify({ productId: p.id, quantity: 1 }) });
      const items = payload<CartItem[]>(res);
      if (Array.isArray(items)) setCart(items);
      else await loadUserContext();
      notify(t.added);
    } catch (err: any) {
      notify(err.message || t.error, "err");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#0A0A0A] pb-28 selection:bg-[#2F5FFF] selection:text-white">
      <Toast msg={toast} onClose={() => setToast(null)} />
      <Header
        user={user}
        lang={lang}
        setLang={setLang}
        search={search}
        setSearch={(val) => {
          setSearch(val);
          if (tab !== "explorer" && val) setTab("explorer");
        }}
        onLogin={() => setAuthOpen(true)}
        onAccount={() => setTab("parametre")}
        t={t}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {tab === "accueil" && (
          <Home
            products={products}
            stores={stores}
            loading={loading}
            t={t}
            onExplore={() => setTab("explorer")}
            onCategory={(c) => { setCategory(c); setTab("explorer"); }}
            onProduct={(p) => setDetailProduct(p)}
            onStore={(s) => setDetailStore(s)}
            onAdd={addToCart}
          />
        )}
        {tab === "explorer" && (
          <Explorer
            products={products}
            loading={loading}
            query={search}
            category={category}
            t={t}
            onCategory={setCategory}
            onProduct={(p) => setDetailProduct(p)}
            onAdd={addToCart}
            onRefresh={loadAll}
          />
        )}
        {tab === "vann" && (
          <Seller
            user={user}
            products={products.filter(p => p.sellerId === user?.id || p.storeId === user?.store?.id)}
            loading={loading}
            t={t}
            onAdd={() => { setEditingProduct(null); setProductModal(true); }}
            onEdit={(p) => { setEditingProduct(p); setProductModal(true); }}
            onDelete={async (p) => {
              if (!confirm("E ou sèten ou vle efase pwodui sa a?")) return;
              try {
                await api(`/products/${p.id}`, { method: "DELETE" });
                notify(t.successDelete);
                loadAll();
              } catch (err: any) {
                notify(err.message || t.error, "err");
              }
            }}
            onStore={() => setStoreModal(true)}
          />
        )}
        {tab === "panye" && (
          <Cart
            user={user}
            cart={cart}
            loading={loading}
            t={t}
            onQty={async (item, qty) => {
              try {
                await api(`/cart/${item.id}`, { method: "PUT", body: JSON.stringify({ quantity: qty }) });
                await loadUserContext();
              } catch (err: any) {
                notify(err.message || t.error, "err");
              }
            }}
            onRemove={async (item) => {
              try {
                await api(`/cart/${item.id}`, { method: "DELETE" });
                await loadUserContext();
              } catch (err: any) {
                notify(err.message || t.error, "err");
              }
            }}
            onCheckout={() => setCheckoutModal(true)}
            onBrowse={() => setTab("explorer")}
          />
        )}
        {tab === "parametre" && (
          <Account
            user={user}
            lang={lang}
            onLang={() => setLang(lang === "ht" ? "fr" : "ht")}
            onLogin={() => setAuthOpen(true)}
            onLogout={handleLogout}
            onSeller={() => {
              if (!user) setAuthOpen(true);
              else if (!user.store) setStoreModal(true);
              else setTab("vann");
            }}
            onSupport={() => setTab("parametre")}
            t={t}
          />
        )}
      </main>

      <Nav tab={tab} setTab={setTab} user={user} onLogin={() => setAuthOpen(true)} t={t} />

      <Auth
        open={authOpen}
        mode={authMode}
        step={authStep}
        email={authEmail}
        name={authName}
        password={authPassword}
        otp={authOtp}
        busy={authBusy}
        t={t}
        onClose={() => setAuthOpen(false)}
        setMode={setAuthMode}
        setEmail={setAuthEmail}
        setName={setAuthName}
        setPassword={setAuthPassword}
        setOtp={setAuthOtp}
        onCredentials={handleCredentials}
        onOtp={handleOtp}
        onResend={async () => {
          try {
            await api("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email: authEmail }) });
            notify(t.codeSent, "info");
          } catch (e: any) {
            notify(e.message || t.error, "err");
          }
        }}
      />
    </div>
  );
}