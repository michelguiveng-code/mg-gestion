import React from "react";

interface HeaderProps {
  t: any;
  lang: "ht" | "fr";
  setLang: (lang: "ht" | "fr") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenAuth: () => void;
  user: any;
}

export default function Header({ t, lang, setLang, searchTerm, setSearchTerm, onOpenAuth, user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <h1 className="font-bold text-lg text-[#0B1F3A]">{t.appName}</h1>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setLang(lang === "ht" ? "fr" : "ht")}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300"
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </header>
  );
}