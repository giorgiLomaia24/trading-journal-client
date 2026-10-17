import React, { useEffect } from 'react';

const ConfirmDelete = ({ isOpen, onClose, onConfirm, message }) => {
  // ბლოკავს ფონის სქროლს, როდესაც მოდალი ღიაა
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // ოვერლეი მუქი მწვანე ტონალობით და ბლურით
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* მოდალის კონტეინერი - რბილი მომწვანო ფონით */}
      <div 
        className="w-full max-w-md transform overflow-hidden rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center align-middle shadow-2xl transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* გამაფრთხილებელი აიქონი */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 border border-red-200 mb-4">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* სათაური (ინგლისურად) */}
        <h3 className="text-xl font-bold leading-6 text-emerald-950 mb-2">
          Are you sure?
        </h3>
        
        {/* ძირითადი ტექსტი (ინგლისურად) */}
        <p className="text-sm text-emerald-800 mb-6 leading-relaxed">
          {message || "Are you sure you want to delete this? This action won't be reversed."}
        </p>

        {/* ღილაკები (ინგლისურად) */}
        <div className="flex gap-3 justify-center">
          {/* Cancel მწვანე აქცენტით */}
          <button
            type="button"
            className="flex-1 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          
          {/* Delete ღილაკი */}
          <button
            type="button"
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer shadow-md"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
