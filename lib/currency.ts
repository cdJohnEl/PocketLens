export function formatCurrency(amount: number, targetCurrency?: string, exchangeRate?: number): string {
  const currency = targetCurrency || getCurrentCurrency()
  const currencyData = CURRENCIES.find((c) => c.code === currency)

  if (!currencyData) {
    return `₦${amount.toLocaleString("en-NG")}`
  }

  // Convert amount if exchange rate is provided and currency is not NGN
  let convertedAmount = amount
  if (exchangeRate && currency !== "NGN") {
    convertedAmount = amount * exchangeRate
  }

  const locale = getLocaleForCurrency(currency)
  return `${currencyData.symbol}${convertedAmount.toLocaleString(locale)}`
}

export function formatCurrencyShort(amount: number, targetCurrency?: string, exchangeRate?: number): string {
  const currency = targetCurrency || getCurrentCurrency()
  const currencyData = CURRENCIES.find((c) => c.code === currency)

  if (!currencyData) {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`
    }
    return `₦${amount.toLocaleString("en-NG")}`
  }

  // Convert amount if exchange rate is provided and currency is not NGN
  let convertedAmount = amount
  if (exchangeRate && currency !== "NGN") {
    convertedAmount = amount * exchangeRate
  }

  if (convertedAmount >= 1000000) {
    return `${currencyData.symbol}${(convertedAmount / 1000000).toFixed(1)}M`
  }
  if (convertedAmount >= 1000) {
    return `${currencyData.symbol}${(convertedAmount / 1000).toFixed(1)}K`
  }

  const locale = getLocaleForCurrency(currency)
  return `${currencyData.symbol}${convertedAmount.toLocaleString(locale)}`
}

// Helper functions for currency management
export function getCurrentCurrency(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("pocketlens-currency") || "NGN"
  }
  return "NGN"
}

export function getExchangeRate(currency: string): Promise<number> {
  return fetch("/api/exchange-rates")
    .then((res) => res.json())
    .then((data) => data.rates[currency] || 1)
    .catch(() => 1)
}

function getLocaleForCurrency(currency: string): string {
  const localeMap: Record<string, string> = {
    NGN: "en-NG",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    CAD: "en-CA",
    AUD: "en-AU",
    CHF: "de-CH",
    CNY: "zh-CN",
    INR: "en-IN",
  }
  return localeMap[currency] || "en-US"
}

export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

const CURRENCIES: Currency[] = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
]

export { CURRENCIES }
