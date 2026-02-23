export const MENU_ITEMS = [
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Pink",
  "Purple",
  "Orange"
] as const;

export type MenuItemName = (typeof MENU_ITEMS)[number];

export type OrderItems = Partial<Record<MenuItemName, number>>;

export interface CalculationRequest {
  items: OrderItems;
  hasMemberCard: boolean;
}

export interface CalculationResult {
  subtotal: number;
  specialDiscount: number;
  memberDiscount: number;
  total: number;
}
