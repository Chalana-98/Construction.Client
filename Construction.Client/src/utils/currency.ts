import { useAppSelector } from '@/store/hooks';

/**
 * Hook to retrieve the current active currency and symbol from Redux settings.
 */
export function useCurrency() {
  const settings = useAppSelector((state) => state.settings);
  const currency = settings?.currency || 'LKR';
  const symbol = settings?.currencySymbol || (currency === 'USD' ? '$' : 'Rs.');

  const format = (amount: number | null | undefined, customCurrency?: string) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return `${customCurrency ? (customCurrency === 'USD' ? '$' : 'Rs.') : symbol} 0`;
    }
    const currSymbol = customCurrency ? (customCurrency === 'USD' ? '$' : 'Rs.') : symbol;
    return `${currSymbol} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return { currency, symbol, format, settings };
}

/**
 * Pure function to format a monetary amount with currency.
 */
export function formatMoney(amount: number | null | undefined, currency: string = 'LKR'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    const symbol = currency === 'USD' ? '$' : 'Rs.';
    return `${symbol} 0`;
  }
  const symbol = currency === 'USD' ? '$' : 'Rs.';
  return `${symbol} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
