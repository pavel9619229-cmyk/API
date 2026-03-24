import OffersTable from "@/components/offers-table";
import { Offer } from "@/lib/types";

async function getInitialItems(): Promise<Offer[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/offers`, {
      cache: "no-store"
    });

    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    return data.items || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const initialItems = await getInitialItems();

  return (
    <main className="page">
      <div className="container">
        <div className="hero">
          <h1>Коммерческие предложения</h1>
          <p className="subtitle">
            Список документов из 1С через OData
          </p>
        </div>

        <OffersTable initialItems={initialItems} />
      </div>
    </main>
  );
}
