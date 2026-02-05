/**
 * Shared formatting utilities for consistent display across the application
 */

/**
 * Format a number as Indian Rupee currency
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "₹1,00,000")
 */
export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with Indian numbering system (lakhs, crores)
 * @param value - The numeric value to format
 * @returns Formatted number string (e.g., "1,00,000")
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a percentage value
 * @param value - The numeric value to format as percentage
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "12.50%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
