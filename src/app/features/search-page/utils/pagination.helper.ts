/**
 * Generates page numbers for pagination display with ellipsis for large page counts.
 * 
 * @param currentPage - The current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers, where -1 represents ellipsis (...)
 */
export function getPaginationPages(currentPage: number, totalPages: number): number[] {
  const pages: number[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push(-1);
    pages.push(totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push(-1);
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);
  pages.push(-1);
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    pages.push(i);
  }
  pages.push(-1);
  pages.push(totalPages);

  return pages;
}

/**
 * Checks if a page number is valid for navigation
 */
export function isValidPageChange(
  targetPage: number,
  currentPage: number,
  totalPages: number,
): boolean {
  return targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage;
}
