import { Offer } from "./types";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function buildUrl(base: string, path: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function getBasicAuthHeader(): string {
  const username = getEnv("ONEC_USERNAME");
  const password = getEnv("ONEC_PASSWORD");
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

function readField(record: Record<string, unknown>, fieldName: string): string {
  const value = record[fieldName];
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function formatDate(input: string): string {
  if (!input) return "";

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return input;
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();

  return `${day}.${month}.${year}`;
}

function extractODataItems(raw: any): any[] {
  if (Array.isArray(raw?.value)) {
    return raw.value;
  }

  if (Array.isArray(raw?.d?.results)) {
    return raw.d.results;
  }

  return [];
}

export async function getOffersFrom1C(): Promise<Offer[]> {
  const baseUrl = getEnv("ONEC_BASE_URL");
  const endpoint = getEnv("ONEC_ODATA_ENDPOINT");

  const idField = getEnv("ONEC_FIELD_ID");
  const numberField = getEnv("ONEC_FIELD_NUMBER");
  const dateField = getEnv("ONEC_FIELD_DATE");
  const titleField = getEnv("ONEC_FIELD_TITLE");

  const url = buildUrl(baseUrl, endpoint);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: getBasicAuthHeader(),
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`1C OData request failed: ${response.status} ${errorText}`);
  }

  const raw = await response.json();
  const items = extractODataItems(raw);

  return items
    .map((item: Record<string, unknown>, index: number) => {
      const id = readField(item, idField) || String(index);
      const number = readField(item, numberField);
      const date = formatDate(readField(item, dateField));
      const title = readField(item, titleField);

      return {
        id,
        number,
        date,
        title
      };
    })
    .sort((a, b) => {
      const aSortable = a.date.split(".").reverse().join("-");
      const bSortable = b.date.split(".").reverse().join("-");
      return bSortable.localeCompare(aSortable);
    });
}
