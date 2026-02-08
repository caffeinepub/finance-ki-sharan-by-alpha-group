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

/**
 * Format bytes to human-readable size with appropriate units
 * @param bytes - The number of bytes to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted size string (e.g., "1.50 MB", "500 KB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
