// ==================== PAGINATION COMPONENT ====================
import React from "react";
import Button from "./Button";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  // თუ მხოლოდ 1 გვერდია, პაგინაციას საერთოდ არ ვარენდერებთ კოდის სისუფთავისთვის
  if (totalPages <= 1) return null;

  // გვერდების ციფრების მასივის გენერაცია
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-[#09090b] border border-[#1f2023] p-4 rounded-xl gap-4 text-left w-full mt-6">
      
      {/* მარცხენა მხარე: მიმდინარე სტატუსის ტექსტი */}
      <span className="text-xs text-[#6b7280] font-semibold">
        Showing page <span className="text-[#f3f4f6]">{currentPage}</span> of <span className="text-[#f3f4f6]">{totalPages}</span>
      </span>

      {/* მარჯვენა მხარე: მართვის ღილაკები */}
      <div className="flex items-center gap-1.5">
        {/* Previous ღილაკი (უკან გადასვლა) */}
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="!py-1.5 !px-3 !text-xs"
        >
          🡨 Prev
        </Button>

        {/* გვერდების ციფრები */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => {
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#0ecb81] text-[#040405] font-black shadow-md shadow-[#0ecb81]/10"
                    : "bg-[#0d0d0e] border border-[#1f2023] text-[#9ca3af] hover:text-[#f3f4f6] hover:border-[#2f3036]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next ღილაკი (წინ გადასვლა) */}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="!py-1.5 !px-3 !text-xs"
        >
          Next 🡪
        </Button>
      </div>

    </div>
  );
}
