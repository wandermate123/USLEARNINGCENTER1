export type QuoteBreakdown = {
  baseCents: number;
  packageDiscountCents: number;
  timeAdjCents: number;
  promoCents: number;
};

export type QuoteResult = {
  currency: string;
  totalCents: number;
  breakdown: QuoteBreakdown;
  expiryDays: number;
};

export function decideExpiryDaysForSessions(sessions: number): number {
  if (sessions === 16) return 60;
  if (sessions === 24) return 90;
  return 30; // default for 8
}

function getBasePriceForLevel(level: string): number {
  // Demo base prices per package purchase (before discounts)
  // You can tune or replace with a Supabase Edge Function later
  switch (level) {
    case 'level1':
      return 8000; // $80.00
    case 'level2':
      return 10000; // $100.00
    case 'level3':
      return 12000; // $120.00
    default:
      return 10000;
  }
}

function packageDiscountPct(sessions: number): number {
  if (sessions === 16) return 10;
  if (sessions === 24) return 20;
  return 0;
}

function promoDiscountCents(subtotalCents: number, promoCode?: string | null): number {
  if (!promoCode) return 0;
  const code = promoCode.trim().toUpperCase();
  if (code === 'WELCOME10') {
    return Math.round(subtotalCents * 0.1);
  }
  return 0;
}

export async function getQuoteDemo(params: {
  level: string;
  sessions: number;
  promoCode?: string | null;
  currency?: string;
}): Promise<QuoteResult> {
  const currency = params.currency ?? 'USD';
  const base = getBasePriceForLevel(params.level);
  const pkgPct = packageDiscountPct(params.sessions);
  const pkgDiscount = Math.round(base * (pkgPct / 100));
  const timeAdj = 0; // demo
  const subtotal = base + timeAdj - pkgDiscount;
  const promo = promoDiscountCents(subtotal, params.promoCode);
  const total = Math.max(0, subtotal - promo);

  return {
    currency,
    totalCents: total,
    breakdown: {
      baseCents: base,
      packageDiscountCents: pkgDiscount,
      timeAdjCents: timeAdj,
      promoCents: promo,
    },
    expiryDays: decideExpiryDaysForSessions(params.sessions),
  };
}

