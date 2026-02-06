import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5 // 3 pages on mobile, 5 on desktop

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 1) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        const start = currentPage - Math.floor(maxPagesToShow / 2)
        for (let i = start; i < start + maxPagesToShow; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-8 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 sm:p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-90 min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 sm:px-2 text-gray-600 dark:text-gray-400 font-semibold"
            >
              ...
            </span>
          )
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-lg font-semibold text-sm sm:text-base transition active:scale-90 ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 sm:p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-90 min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page Info */}
      <div className="w-full text-center mt-2 sm:mt-0 sm:ml-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default Pagination
