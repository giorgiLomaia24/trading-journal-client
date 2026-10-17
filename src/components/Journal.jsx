import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import FilterPanel from '../components/FilterPanel';

// Lucide აიქონი (მაგალითისთვის, შეგიძლია SVG-ც გამოიყენო)
const BookOpenIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
);

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* 1. გვერდის სათაური თავისი სამოქმედო ღილაკებით */}
        <PageHeader
          icon={BookOpenIcon}
          title="Trading Journal"
          subtitle="lucid50k • Track and analyze your trades efficiently"
        >
          {/* აქ პირდაპირ ყრი შენს რეუზაბელ ღილაკებს */}
          <button className="px-3.5 py-2 bg-[#181a20] border border-[#2b2f36] rounded-lg text-sm text-[#eaecef] hover:bg-[#2b2f36] transition-all">
            Strategies
          </button>
          <button className="px-3.5 py-2 bg-[#181a20] border border-[#2b2f36] rounded-lg text-sm text-[#eaecef] hover:bg-[#2b2f36] transition-all">
            Import
          </button>
          <button className="px-3.5 py-2 bg-[#181a20] border border-[#2b2f36] rounded-lg text-sm text-[#eaecef] hover:bg-[#2b2f36] transition-all">
            CSV
          </button>
          <button className="px-4 py-2 bg-[#0ecb81] text-[#0b0e11] font-semibold rounded-lg text-sm hover:bg-[#0b9b62] transition-all"
          >
            + Add Trade
          </button>
        </PageHeader>

        {/* 2. ცალკე გამოყოფილი ფილტრაციის პანელი */}
        <FilterPanel
          activeFiltersCount={1}
          onClearFilters={() => console.log('Filters cleared')}
        />

        {/* 3. ქვედა ნაწილი (Stat Cards და ცხრილი) აქ წამოვა... */}
        <div className="text-sm text-[#848e9c]">
          {/* შენი სტატისტიკის ქარდების კომპონენტი */}
        </div>

      </div>
      <AddTradeModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={(newTrade) => {
          console.log("Saving new trade:", newTrade);

        }}
      />

    </div>
  );
}
