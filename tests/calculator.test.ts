import { calculateBill, roundThaiBahtCash } from "@/lib/calculator";

describe("calculateBill", () => {
  it("calculates basic order without discounts", () => {
    const result = calculateBill({
      items: {
        Red: 1,
        Green: 1
      },
      hasMemberCard: false
    });

    expect(result).toEqual({
      subtotal: 90,
      specialDiscount: 0,
      memberDiscount: 0,
      total: 90
    });
  });

  it("applies member card discount after special discount", () => {
    const result = calculateBill({
      items: {
        Red: 1,
        Green: 2
      },
      hasMemberCard: true
    });

    // subtotal 130, green pair special discount 4, remaining 126, member 12.6 => 113.4
    expect(result).toEqual({
      subtotal: 130,
      specialDiscount: 4,
      memberDiscount: 12.6,
      total: 113.5
    });
  });

  it("applies 5% discount per pair for orange, pink, and green", () => {
    const result = calculateBill({
      items: {
        Orange: 5,
        Pink: 3,
        Green: 4
      },
      hasMemberCard: false
    });

    // orange: 2 pairs => 24, pink: 1 pair => 8, green: 2 pairs => 8
    expect(result).toEqual({
      subtotal: 1000,
      specialDiscount: 40,
      memberDiscount: 0,
      total: 960
    });
  });

  it("normalizes invalid and fractional quantities", () => {
    const result = calculateBill({
      items: {
        Red: -2,
        Blue: 1.9,
        Orange: Number.NaN
      },
      hasMemberCard: false
    });

    expect(result).toEqual({
      subtotal: 30,
      specialDiscount: 0,
      memberDiscount: 0,
      total: 30
    });
  });

  it("applies Thai cash rounding to final bill total", () => {
    const result = calculateBill({
      items: {
        Red: 1,
        Green: 2
      },
      hasMemberCard: true
    });

    // 113.4 -> 113.5 by Thai cash rounding
    expect(result.total).toBe(113.5);
  });
});

describe("roundThaiBahtCash", () => {
  it("uses Thai threshold rounding for satang", () => {
    expect(roundThaiBahtCash(100.24)).toBe(100);
    expect(roundThaiBahtCash(100.25)).toBe(100.5);
    expect(roundThaiBahtCash(100.74)).toBe(100.5);
    expect(roundThaiBahtCash(100.75)).toBe(101);
  });
});
