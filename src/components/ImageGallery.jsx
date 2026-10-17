// ==================== IMAGEGALLERY WITH FULL-SCREEN MODAL - PART 1 ====================
import React, { useState, useEffect } from "react";

export default function ImageGallery({ 
  images = [], 
  title = "Trade Screenshots" 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // მოდალის სტეიტი

  // ESC ღილაკზე დაჭერით გადიდებული სურათის ავტომატური დახურვა
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">
          <span>📷</span> {title} (0)
        </div>
        <div className="w-full h-48 bg-[#0d0d0e] border border-dashed border-[#1f2023] rounded-lg flex flex-col items-center justify-center gap-2 text-[#4b5563]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">No screenshots available for this trade</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans">
      <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">
        <span>📷</span> {title} ({images.length})
      </div>

      {/* მთავარი დიდი ფოტოს პანელი — დაემატა cursor-zoom-in და onClick */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative w-full aspect-[16/10] bg-[#0d0d0e] border border-[#1f2023] rounded-xl overflow-hidden group cursor-zoom-in"
      >
        <img 
          src={images[activeIndex]} 
          alt={`Screenshot ${activeIndex + 1}`} 
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
        />

        {/* გვერდების მანიშნებელი (1/2) */}
        <div className="absolute bottom-3 right-3 bg-black/75 border border-[#1f2023] px-2.5 py-1 rounded-md text-[11px] font-bold text-[#9ca3af] tracking-wider select-none">
          {activeIndex + 1}/{images.length}
        </div>
      </div>
      {/* ქვედა თამბნეილები, თუ 1-ზე მეტი ფოტოა */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer bg-[#0d0d0e] ${
                  isActive 
                    ? "border-[#0ecb81] ring-1 ring-[#0ecb81]/20 scale-[0.98]" 
                    : "border-[#1f2023] opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* დამხმარე მინაწერი */}
      <p className="text-[11px] text-[#4b5563] font-medium mt-3 pl-0.5">
        Click on the image to view in full screen mode.
      </p>

      {/* --- სრულეკრანიანი მცურავი მოდალი (Full-Screen Preview Overlay) --- */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)} // ფონზე დაკლიკებით იხურება
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in duration-200"
        >
          {/* დახურვის კნოპკა ზედა მარჯვენა კუთხეში (ჩვენი მწვანე ჰოვერით!) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // აჩერებს კლიკის აყოლას ფონზე
              setIsModalOpen(false);
            }}
            className="absolute top-4 right-4 z-50 text-[#9ca3af] hover:text-[#0ecb81] bg-[#0d0d0e]/60 border border-[#1f2023] hover:border-[#0ecb81]/30 p-2.5 rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* თავად დიდი სურათი კონტეინერში */}
          <div 
            onClick={(e) => e.stopPropagation()} // სურათზე დაკლიკებისას რომ არ დაიხუროს შემთხვევით
            className="relative max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl border border-[#1f2023] animate-in zoom-in-95 duration-200 cursor-default"
          >
            <img 
              src={images[activeIndex]} 
              alt={`Full Screen Screenshot ${activeIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain"
            />
            
            {/* პატარა ინფო პანელი მოდალის ქვედა ნაწილში სისუფთავისთვის */}
            <div className="bg-[#09090b] px-4 py-2.5 border-t border-[#1f2023] flex items-center justify-between text-xs font-semibold text-[#6b7280]">
              <span>Screenshot {activeIndex + 1} of {images.length}</span>
              <span className="text-[10px] bg-[#1f2023] text-[#9ca3af] px-2 py-0.5 rounded">ESC to close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
