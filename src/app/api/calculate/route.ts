import { calculateBill } from "@/lib/calculator";
import { MENU_ITEMS, type CalculationRequest } from "@/types/calculator";
import { NextResponse } from "next/server";

const isValidPayload = (payload: unknown): payload is CalculationRequest => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.hasMemberCard !== "boolean") {
    return false;
  }

  if (!data.items || typeof data.items !== "object") {
    return false;
  }

  const items = data.items as Record<string, unknown>;
  return Object.keys(items).every((key) => {
    if (!MENU_ITEMS.includes(key as (typeof MENU_ITEMS)[number])) {
      return false;
    }
    return typeof items[key] === "number";
  });
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const result = calculateBill(payload);
  return NextResponse.json(result, { status: 200 });
}
