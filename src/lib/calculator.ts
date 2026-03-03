import {
  MEMBER_DISCOUNT_RATE,
  MENU_PRICES,
  SINGLE_ORDER_ITEMS,
  SPECIAL_DISCOUNT_ITEMS,
  SPECIAL_DISCOUNT_RATE
} from "@/lib/menu";
import {
  MENU_ITEMS,
  type CalculationRequest,
  type CalculationResult,
  type MenuItemName
} from "@/types/calculator";

const roundTo2 = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const roundThaiBahtCash = (value: number): number => {
  const satang = Math.round((value - Math.floor(value)) * 100);
  const baht = Math.floor(value);

  if (satang < 25) {
    return baht;
  }
  if (satang < 75) {
    return baht + 0.5;
  }
  return baht + 1;
};

const getSafeQuantity = (
  value: number | undefined,
  itemName?: MenuItemName
): number => {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return 0;
  }
  const qty = Math.floor(value);
  if (itemName && SINGLE_ORDER_ITEMS.includes(itemName)) {
    return Math.min(qty, 1);
  }
  return qty;
};

const calculateSubtotal = (items: CalculationRequest["items"]): number => {
  return MENU_ITEMS.reduce((total, itemName) => {
    const quantity = getSafeQuantity(items[itemName], itemName);
    return total + MENU_PRICES[itemName] * quantity;
  }, 0);
};

const calculateSpecialDiscount = (items: CalculationRequest["items"]): number => {
  return SPECIAL_DISCOUNT_ITEMS.reduce((discount, itemName: MenuItemName) => {
    const quantity = getSafeQuantity(items[itemName], itemName);
    const pairs = Math.floor(quantity / 2);
    const pairPrice = MENU_PRICES[itemName] * 2;

    return discount + pairs * pairPrice * SPECIAL_DISCOUNT_RATE;
  }, 0);
};

export const calculateBill = ({
  items,
  hasMemberCard
}: CalculationRequest): CalculationResult => {
  const subtotal = calculateSubtotal(items);
  const specialDiscount = calculateSpecialDiscount(items);
  const subtotalAfterSpecial = subtotal - specialDiscount;
  const memberDiscount = hasMemberCard
    ? subtotalAfterSpecial * MEMBER_DISCOUNT_RATE
    : 0;
  const total = subtotalAfterSpecial - memberDiscount;

  return {
    subtotal: roundTo2(subtotal),
    specialDiscount: roundTo2(specialDiscount),
    memberDiscount: roundTo2(memberDiscount),
    total: roundThaiBahtCash(roundTo2(total))
  };
};
