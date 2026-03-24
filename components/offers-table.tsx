"use client";

import { useMemo, useState } from "react";
import { Offer } from "@/lib/types";

type Props = {
  initialItems: Offer[];
};

export default function OffersTable({ initialItems }: Props) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Offer[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) => {
      return (
        item.number.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  async function handleRefresh() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/offers", {
        method: "GET",
        cache: "no-store"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось обновить данные");
      }

      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="toolbar">
        <input
          className="search"
          type="text"
          placeholder="Поиск по номеру, дате, заголовку"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refreshButton" onClick={handleRefresh} disabled={loading}>
          {loading ? "Обновление..." : "Обновить"}
        </button>
      </div>

      {error ? <div className="errorBox">{error}</div> : null}

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Дата</th>
              <th>Заголовок</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="emptyCell">
                  Нет данных
                </td>
              </tr>
            ) : (
              filtered.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.number || "—"}</td>
                  <td>{offer.date || "—"}</td>
                  <td>{offer.title || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
