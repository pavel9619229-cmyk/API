import { NextResponse } from "next/server";
import { getOffersFrom1C } from "@/lib/odata";

export async function GET() {
  try {
    const items = await getOffersFrom1C();
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
