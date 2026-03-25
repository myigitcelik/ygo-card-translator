/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [card, setCard] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  // autocomplete search
  useEffect(() => {
    if (!query || query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${query}`
      );

      const data = await res.json();

      if (data.data) {
        setSuggestions(data.data.slice(0, 6));
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const search = async (name?: string) => {
    const searchTerm = name || query;
    setLoading(true);
    setSuggestions([]);

    const res = await fetch(
      `${backend}/card?name=${encodeURIComponent(searchTerm)}`
    );

    const data = await res.json();
    setCard(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          🃏 YGO Card Translator
        </h1>

        {/* Search */}
        <div className="relative">
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 outline-none"
            placeholder="Search card..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute w-full bg-slate-900 border border-slate-700 rounded-lg mt-2 z-10">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setQuery(s.name);
                    search(s.name);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer"
                >
                  <img
                    src={s.card_images[0].image_url_small}
                    className="w-10 h-14 object-cover rounded"
                  />

                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">
                      {s.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result */}
        {card && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <Image
                src={card.image}
                alt={card.name}
                width={400}
                height={600}
                className="rounded-lg"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{card.name}</h2>

              <p className="text-slate-400 mt-4 whitespace-pre-line">
                {card.desc}
              </p>

              <hr className="my-6 border-slate-800" />

              <p className="text-white whitespace-pre-line">
                {card.desc_translated}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}