"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Always show current page
    pages.push(currentPage);

    // Try to show one page before current page
    if (currentPage > 1) pages.unshift(currentPage - 1);

    // Try to show one page after current page
    if (currentPage < totalPages) pages.push(currentPage + 1);

    // If we have room for more pages at the beginning
    if (pages.length < 3 && pages[0] > 1) {
      pages.unshift(pages[0] - 1);
    }

    // If we have room for more pages at the end
    if (pages.length < 3 && pages[pages.length - 1] < totalPages) {
      pages.push(pages[pages.length - 1] + 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-12">
      <nav className="inline-flex rounded-md shadow">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-l-md border border-gray-300 bg-white 
                    ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-700 hover:bg-gray-50"
                    } 
                    font-medium`}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 border-t border-b border-gray-300 
                      ${
                        pageNum === currentPage
                          ? "bg-purple-700 text-white"
                          : "bg-white text-purple-700 hover:bg-gray-50"
                      } 
                      font-medium`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-r-md border border-gray-300 bg-white 
                    ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-700 hover:bg-gray-50"
                    } 
                    font-medium`}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  );
}
