/**
 * CSV utility functions for client-side CSV generation and download
 */

/**
 * Escapes a CSV field value by wrapping in quotes if needed
 */
function escapeCSVField(value: string | number): string {
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts an array of rows to CSV string
 */
export function arrayToCSV(rows: (string | number)[][]): string {
  return rows
    .map(row => row.map(escapeCSVField).join(','))
    .join('\n');
}

/**
 * Triggers a browser download of CSV content
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
