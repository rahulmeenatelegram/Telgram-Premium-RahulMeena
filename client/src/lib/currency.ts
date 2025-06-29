// Currency formatting utility for Indian Rupees
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

// Format currency with decimal places
export function formatCurrencyWithDecimals(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

// Format large amounts with abbreviated notation (K, L, Cr)
export function formatCurrencyAbbreviated(amount: number): string {
  if (amount >= 10000000) { // 1 Crore
    return `Rs. ${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `Rs. ${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}