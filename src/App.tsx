import React, { useState } from "react";
import { T } from "./components/constants";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Home from "./components/Home";

export default function App() {
  const [lang, setLang] = useState<"ht" | "fr">("ht");
  const t = T[lang];
  const [tab, setTab] = useState("accueil");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div className="min-h-screen bg-[#F3F5F8] pb-28 text-[#0A0A0A]">
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAuth={() => console.log("Louvri auth")}
        user={user}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {tab === "accueil" && (
          <Home t={t} onSelectCat={(cat: string) => console.log(cat)} />
        )}
        {tab === "explorer" && <div>Paj Eksplorasyon</div>}
        {tab === "panye" && <div>Paj Panye</div>}
        {tab === "profil" && <div>Paj Profil</div>}
      </main>

      <Nav tab={tab} setTab={setTab} t={t} cartCount={cart.length} />
    </div>
  );
}