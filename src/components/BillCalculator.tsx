"use client";

import { MENU_PRICES } from "@/lib/menu";
import {
  MENU_ITEMS,
  type CalculationResult,
  type MenuItemName,
  type OrderItems
} from "@/types/calculator";
import { useMemo, useState } from "react";

const defaultItems: OrderItems = MENU_ITEMS.reduce((acc, itemName) => {
  acc[itemName] = 0;
  return acc;
}, {} as OrderItems);

export default function BillCalculator() {
  const [items, setItems] = useState<OrderItems>(defaultItems);
  const [hasMemberCard, setHasMemberCard] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalItems = useMemo(() => {
    return MENU_ITEMS.reduce((sum, itemName) => sum + (items[itemName] ?? 0), 0);
  }, [items]);

  const updateItem = (itemName: MenuItemName, quantity: number) => {
    setItems((current) => ({
      ...current,
      [itemName]: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items, hasMemberCard })
    });

    if (!response.ok) {
      setResult(null);
      setError("Unable to calculate bill.");
      return;
    }

    const data: CalculationResult = await response.json();
    setResult(data);
  };

  return (
    <div className="calculator-card">
      <h1>Food Store Bill Calculator</h1>
      <p>Enter quantities for each menu set and apply discounts.</p>

      <form onSubmit={onSubmit}>
        <div className="item-grid">
          {MENU_ITEMS.map((itemName) => (
            <label key={itemName} className="item-row">
              <span>
                {itemName} set ({MENU_PRICES[itemName]} THB)
              </span>
              <input
                type="number"
                min={0}
                value={items[itemName] ?? 0}
                onChange={(event) =>
                  updateItem(itemName, Number(event.target.value))
                }
              />
            </label>
          ))}
        </div>

        <label className="member-toggle">
          <input
            type="checkbox"
            checked={hasMemberCard}
            onChange={(event) => setHasMemberCard(event.target.checked)}
          />
          Member card (10% discount)
        </label>

        <button type="submit" disabled={totalItems === 0}>
          Calculate
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <section className="result">
          <h2>Summary</h2>
          <p>Subtotal: {result.subtotal.toFixed(2)} THB</p>
          <p>Special discount (pairs): -{result.specialDiscount.toFixed(2)} THB</p>
          <p>Member discount: -{result.memberDiscount.toFixed(2)} THB</p>
          <p className="total">Total: {result.total.toFixed(2)} THB</p>
        </section>
      ) : null}
    </div>
  );
}
