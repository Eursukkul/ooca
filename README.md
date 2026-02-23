# Food Store Calculator (Next.js)

Full-stack calculator for the assignment (frontend + backend + unit tests).

## Menu

| Set | Price (THB) |
|---|---:|
| Red | 50 |
| Green | 40 |
| Blue | 30 |
| Yellow | 50 |
| Pink | 80 |
| Purple | 90 |
| Orange | 120 |

## Pricing Rules

1. Subtotal = sum of `price * quantity` for all menu items.
2. Special discount = `5%` for every pair of `Orange`, `Pink`, and `Green`.
3. Member card discount = `10%` (applied after special discount).
4. Final total uses Thai cash rounding:
   - satang `< 0.25` => round down
   - satang `0.25 - 0.74` => round to `.50`
   - satang `>= 0.75` => round up to next baht

## Assumptions

- Quantity is a non-negative integer.
- Invalid, negative, or fractional input is normalized safely in backend logic.
- Thai cash rounding is applied to final `total` only.

## Architecture

- Frontend: `src/components/BillCalculator.tsx`
- Backend API: `src/app/api/calculate/route.ts`
- Pricing domain logic: `src/lib/calculator.ts`
- Menu constants: `src/lib/menu.ts`
- Shared types: `src/types/calculator.ts`

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Test

```bash
npm test
```

Current test suite: `6 tests passed`.

Coverage includes:
- Basic calculation without discount
- Member discount flow
- Pair discount logic for Orange/Pink/Green
- Input normalization
- Thai cash rounding behavior and thresholds

## API Contract

`POST /api/calculate`

Request:

```json
{
  "items": { "Red": 1, "Green": 1 },
  "hasMemberCard": true
}
```

Response:

```json
{
  "subtotal": 90,
  "specialDiscount": 0,
  "memberDiscount": 9,
  "total": 81
}
```

## Example Scenarios

1. Desk#1 from assignment
   - Order: Red(1) + Green(1)
   - Subtotal: `90`
   - Member card: `81`
2. Pair discount example
   - Order: Orange(2)
   - Subtotal: `240`
   - Special discount: `12` (5% of one pair `240`)
   - Final (no member): `228`
