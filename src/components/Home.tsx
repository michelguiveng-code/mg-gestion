import React from "react";
import { cats } from "./constants";

interface HomeProps {
  t: any;
  onSelectCat: (cat: string) => void;
}

export default function Home({ t, onSelectCat }: HomeProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#2F5FFF] p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold mb-2">{t.appName}</h1>
        <p className="text-sm text-gray-200">{t.welcome}</p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-3">Kategori</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {cats.map((cat: string, idx: number) => (
            <button
              key={idx}
              onClick={() => onSelectCat(cat)}
              className="flex-shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm border border-gray-200 hover:border-[#2F5FFF] hover:text-[#2F5FFF]"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}