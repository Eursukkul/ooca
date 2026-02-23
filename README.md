# Food Store Calculator (Next.js)

A small full-stack Next.js solution for the homework problem.

## Features

- 7 fixed menu items and prices (THB)
- Multiple items per order
- Discounts:
  - Member card: 10%
  - Pair discount: 5% for every pair of `Orange`, `Pink`, or `Green` sets
- Final total uses Thai cash rounding:
  - satang `< 0.25` round down
  - satang `0.25 - 0.74` round to `.50`
  - satang `>= 0.75` round up to next baht
- Separate pricing domain module (`src/lib/calculator.ts`)
- Backend API route (`POST /api/calculate`)
- Frontend calculator form (`/`)
- Unit tests with Vitest

## Tech

- Next.js (App Router)
- TypeScript
- Vitest

## Run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Test

```bash
npm test
```

## API Example

Request:

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"items":{"Red":1,"Green":1},"hasMemberCard":true}'
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
