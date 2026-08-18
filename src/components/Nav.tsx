import React from "react";

interface NavProps {
  tab: string;
  setTab: (tab: string) => void;
  t: any;
  cartCount: number;
}

export default function Nav({ tab, setTab, t, cartCount }: NavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 flex justify-around shadow-lg">
      <button onClick={() => setTab("accueil")} className={`text-xs font-bold ${tab === "accueil" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
        Akèy
      </button>
      <button onClick={() => setTab("explorer")} className={`text-xs font-bold ${tab === "explorer" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
        Eksplore
      </button>
      <button onClick={() => setTab("panye")} className={`text-xs font-bold ${tab === "panye" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
        Panye ({cartCount})
      </button>
      <button onClick={() => setTab("profil")} className={`text-xs font-bold ${tab === "profil" ? "text-[#2F5FFF]" : "text-gray-500"}`}>
        Profil
      </button>
    </nav>
  );
}