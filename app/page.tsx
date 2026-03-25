"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card?name=${encodeURIComponent(query)}`
      );

      const data = await res.json();
      setCard(data);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">
          🃏 YGO Card Translator
        </h1>

        <p className="text-slate-400 mb-8">
          Translate Yu-Gi-Oh cards from English to Turkish instantly!
        </p>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <input
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
            placeholder="Search card... (Dark Magician)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />

          <button
            onClick={search}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Translate
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-slate-400">Translating card...</div>
        )}

        {/* Card */}
        {card && !loading && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="bg-slate-900 p-4 rounded-xl">
              <img
                src={card.image}
                className="w-full rounded-lg"
              />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl text-slate-400">
                  English
                </h2>
                <h3 className="text-2xl font-bold">
                  {card.name}
                </h3>
                <p className="text-slate-300 whitespace-pre-line mt-2">
                  {card.desc}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h2 className="text-xl text-purple-400">
                  Turkish
                </h2>
                <h3 className="text-2xl font-bold">
                  {card.name_translated}
                </h3>
                <p className="text-slate-200 whitespace-pre-line mt-2">
                  {card.desc_translated}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-slate-600 text-sm">
          Powered by YGOPRODeck API • LibreTranslate
        </div>
      </div>
    </main>
  );
}