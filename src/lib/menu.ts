import { type MenuItemName } from "@/types/calculator";

export const MENU_PRICES: Record<MenuItemName, number> = {
  Red: 50,
  Green: 40,
  Blue: 30,
  Yellow: 50,
  Pink: 80,
  Purple: 90,
  Orange: 120
};

export const SPECIAL_DISCOUNT_ITEMS: ReadonlyArray<MenuItemName> = [
  "Orange",
  "Pink",
  "Green"
];

export const SPECIAL_DISCOUNT_RATE = 0.05;
export const MEMBER_DISCOUNT_RATE = 0.1;
