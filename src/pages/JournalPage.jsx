// // ==================== JOURNAL PAGE - PART 1 ====================
// import React, { useState, useEffect } from "react";
// import PageHeader from "../components/PageHeader";
// import FilterPanel from "../components/FilterPanel";
// import StatCard from "../components/StatCard";
// import TradeCard from "../components/TradeCard";
// import Button from "../components/Button";
// import InputField from "../components/InputField";
// import Pagination from "../components/Pagination";
// import ManageStrategiesModal from "../components/ManageStrategiesModal";
// import AddTradeModal from '../components/AddTradeModal';


// // 🚀 შემოგვაქვს Zustand-ის რეალური გლობალური სთორები ბაზასთან დასაკავშირებლად
// import { useTradeStore } from "../store/useTradeStore";
// import { useAccountStore } from "../store/useAccountStore";

// export default function JournalPage() {
//   const [viewMode, setViewMode] = useState("grid");
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("Date");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isStrategiesModalOpen, setIsStrategiesModalOpen] = useState(false);
//   const [isLogModalOpen, setIsLogModalOpen] = useState(false);
//     const [filterState, setFilterState] = useState({
//     status: "all",
//     type: "all",
//     strategy: "all",
//     session: "all",
//     fromDate: "",
//     toDate: "",
//     minPnl: "",
//     maxPnl: "",
//     results: [],
//     tags: [],
//     emotions: []
//     });
//    // Zustand სთორები
//   const { trades, pagination, journalMiniStats, fetchTrades, loading } = useTradeStore();
//   const activeAccount = useAccountStore((state) => state.activeAccount);

//    const totalPages = pagination.totalPages || 1;

//  // 🚀 3. ავტომატური ეფექტი: ყოველთვის, როცა იუზერი შეცვლის ექაუნთს საიდბარში, 
//   // ან გადავა სხვა გვერდზე პაგინაციაში, ფრონტენდი მომენტალურად წამოიღებს სუფთა მონაცემებს ბაზიდან
//   // 🚀 როცა იცვლება ექაუნთი, გვერდი ან ნებისმიერი ფილტრი, API იძახებს შესაბამის მონაცემებს
//   useEffect(() => {
//     if (activeAccount?._id) {
//       // ვამზადებთ ბექენდისთვის საჭირო ფილტრებს
//       const apiFilters = {
//         account: activeAccount._id,
//       };

//       // მხოლოდ იმ შემთხვევაში ვამატებთ ფილტრს, თუ "all" არ არის არჩეული
//       if (filterState.status && filterState.status !== "all") apiFilters.status = filterState.status;
//       if (filterState.type && filterState.type !== "all") apiFilters.type = filterState.type;
//       if (filterState.strategy && filterState.strategy !== "all") apiFilters.strategy = filterState.strategy;
//       if (filterState.session && filterState.session !== "all") apiFilters.session = filterState.session;
      
//       // თარიღების და P&L-ის დიაპაზონები
//       if (filterState.fromDate) apiFilters.fromDate = filterState.fromDate;
//       if (filterState.toDate) apiFilters.toDate = filterState.toDate;
//       if (filterState.minPnl) apiFilters.minPnl = filterState.minPnl;
//       if (filterState.maxPnl) apiFilters.maxPnl = filterState.maxPnl;

//       // მასივების ფილტრაცია (თუ ცარიელი არაა, ვაქცევთ მძიმით გამოყოფილ სტრინგად, როგორც ბექენდი ელოდება)
//       if (filterState.results && filterState.results.length > 0) apiFilters.result = filterState.results.join(',');
//       if (filterState.tags && filterState.tags.length > 0) apiFilters.tags = filterState.tags.join(',');
//       if (filterState.emotions && filterState.emotions.length > 0) apiFilters.emotions = filterState.emotions.join(',');

//       // 🚀 ვიძახებთ Zustand-ის ფეტჩერს სრული ფილტრების ობიექტით
//       fetchTrades(currentPage, apiFilters);
//     }
//   }, [activeAccount?._id, currentPage, filterState, fetchTrades]); // 🚀 უყურებს ფილტრების სტეიტსაც!

//   // 5. ლოკალური ფილტრაცია ძებნის (Search) ველისთვის ბაზიდან წამოღებულ რეალურ თრეიდებზე
//   const filteredTrades = trades.filter((trade) => {
//     const query = search.toLowerCase();
//     return (
//       (trade.symbol?.toLowerCase().includes(query) || false) ||
//       (trade.strategy?.toLowerCase().includes(query) || false) ||
//       (trade.notes?.toLowerCase().includes(query) || false)
//     );
//   });

//   console.log(filteredTrades,'treidi')

//   const handleClearFilters = () => {
//     setFilterState({
//       status: "all",
//       type: "all",
//       strategy: "all",
//       session: "all",
//       fromDate: "",
//       toDate: "",
//       minPnl: "",
//       maxPnl: "",
//       results: [],
//       tags: [],
//       emotions: []
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans selection:bg-[#0ecb81]/30">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* 1. ზედა ჰედერი — დინამიურად აჩვენებს აქტიური ანგარიშის სახელს ბაზიდან */}
//         <PageHeader
//           title="Trading Journal"
//           description={activeAccount ? `${activeAccount.accountName} • Track and analyze your trades efficiently` : "No Active Account • Please select or create an account"}
//           icon="📖"
//         >
//           <Button variant="outline" icon="📊" onClick={() => setIsStrategiesModalOpen(true)}>Strategies</Button>
//           {/* <Button variant="outline" icon="📥">CSV</Button> */}
//           <Button variant="solid" icon="＋" onClick={() => setIsLogModalOpen(true)}>
//             Add Trade
//           </Button>
//         </PageHeader>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//           <StatCard
//             title="Total Trades"
//             value={journalMiniStats?.totalTrades?.toString() || "0"}
//             trend="neutral"
//             icon="🔢"
//           />
//           <StatCard
//             title="Win Rate"
//             value={journalMiniStats?.winRate || "0.0%"}
//             trend={parseFloat(journalMiniStats?.winRate) >= 50 ? "up" : "down"}
//             icon="📈"
//           />
//           <StatCard
//             title="Avg P&L"
//             value={journalMiniStats?.avgPnL || "$0.00"}
//             trend={journalMiniStats?.isAvgPositive ? "up" : "down"}
//             icon="📊"
//           />
//           <StatCard
//             title="Avg R:R"
//             value={journalMiniStats?.avgRiskReward || "1:1"}
//             trend="neutral"
//             icon="🎯"
//           />
//           <StatCard
//             title="Total P&L"
//             value={journalMiniStats?.totalPnL || "$0.00"}
//             trend={journalMiniStats?.isPnLPositive ? "up" : "down"}
//             icon="💰"
//           />
//         </div>

//         {/* 3. ძებნა და ფილტრაცია */}
//         <div className="space-y-3">
//           <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#09090b] border border-[#1f2023] p-4 rounded-xl">
//             {/* საძიებო ველი */}
//             <div className="relative w-full sm:max-w-md flex items-center">
//               <span className="absolute left-4 text-[#4b5563]">🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search trades, symbols, strategies..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-[#0d0d0e] text-[#f3f4f6] border border-[#1f2023] rounded-lg pl-11 pr-4 py-2.5 text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all"
//               />
//             </div>

//             {/* ფილტრების ჩამოსაშლელი ღილაკი */}
//             <Button
//               variant="outline"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//               className={isFilterOpen ? "!border-[#0ecb81] !text-[#0ecb81]" : ""}
//               icon="🎛️"
//             >
//               Filters <span className="text-[10px] ml-1">{isFilterOpen ? "▲" : "▼"}</span>
//             </Button>
//           </div>

//           {/* ჩამოშლადი ფილტრების Reusable პანელი */}
//           <FilterPanel
//             isOpen={isFilterOpen}
//             state={filterState}
//             setState={setFilterState}
//             onClear={handleClearFilters}
//           />
//         </div>

//         {/* 4. ქვედა ზოლი: სორტირება და ხედის შეცვლა */}
//         <div className="flex items-center justify-between border-b border-[#1f2023] pb-3 pt-2">

//           {/* სორტირების ბლოკი */}
//           <div className="flex items-center gap-3 text-xs font-semibold text-[#6b7280]">
//             <span className="whitespace-nowrap">Sort by:</span>
//             <div className="w-32">
//               <InputField
//                 type="select"
//                 value={sortBy}
//                 onChange={(val) => setSortBy(val)}
//                 options={[
//                   { label: "Date", value: "Date" },
//                   { label: "P&L", value: "P&L" },
//                   { label: "Symbol", value: "Symbol" }
//                 ]}
//               />
//             </div>
//             <Button
//               variant="icon-only"
//               onClick={() => alert("Toggle Sorting Direction")}
//               icon={<span className="text-sm">⇅</span>}
//             />
//           </div>

//           {/* ხედის გადამრთველები */}
//           <div className="flex items-center gap-1 bg-[#0d0d0e] border border-[#1f2023] p-1 rounded-lg">
//             {/* Grid View ღილაკი */}
//             <Button
//               variant="icon-only"
//               className={viewMode === "grid" ? "!bg-[#0ecb81] !text-[#040405]" : ""}
//               onClick={() => setViewMode("grid")}
//               icon={
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                 </svg>
//               }
//             />
//             {/* List View ღილაკი */}
//             <Button
//               variant="icon-only"
//               className={viewMode === "list" ? "!bg-[#0ecb81] !text-[#040405]" : ""}
//               onClick={() => setViewMode("list")}
//               icon={
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               }
//             />
//           </div>
//         </div>

//         {/* 5. თრეიდების დინამიური რენდერინგი (Grid ან List) */}
//         {loading ? (
//           /* ჩატვირთვის (Loading) ლამაზი პრემიუმ ინდიკატორი */
//           <div className="text-center py-12 text-xs font-black text-[#4b5563] uppercase tracking-widest animate-pulse">
//             Loading trades from database...
//           </div>
//         ) : filteredTrades.length === 0 ? (
//           /* ცარიელი სტატუსი, თუ ამ ექაუნთზე თრეიდები ჯერ არ არის */
//           <div className="text-center py-12 text-xs font-black text-[#4b5563] uppercase tracking-widest bg-[#09090b] border border-[#1f2023] rounded-xl">
//             No trades found for this account.
//           </div>
//         ) : (
//           <div
//             className={
//               viewMode === "grid"
//                 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in duration-200"
//                 : "flex flex-col gap-3 animate-in fade-in duration-200"
//             }
//           >
//             {/* 🚀 ვატრიალებთ ბაზიდან წამოღებულ რეალურ თრეიდებს _id-ით */}
//             {filteredTrades.map((trade) => (
//               <TradeCard key={trade._id} trade={trade} viewMode={viewMode} />
//             ))}
//           </div>
//         )}        {/* 6. Reusable პაგინაციის კომპონენტი მიბმული Zustand-ის რეალურ სტეიტზე */}
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
//         />

//       </div>

//       {/* სტრატეგიების მართვის რეალური მოდალი ბექენდ კავშირით */}
//       <ManageStrategiesModal
//         isOpen={isStrategiesModalOpen}
//         onClose={() => setIsStrategiesModalOpen(false)}
//       />
//       <AddTradeModal
//         isOpen={isLogModalOpen}
//         onClose={() => setIsLogModalOpen(false)}
//         onSave={(newTrade) => {
//           console.log("Saving new trade:", newTrade);
//         }}
//       />

//     </div>
//   );
// }

// ==================== JOURNAL PAGE ====================
import React, { useState, useEffect, useMemo, useRef } from "react";
import PageHeader from "../components/PageHeader";
import FilterPanel from "../components/FilterPanel";
import StatCard from "../components/StatCard";
import TradeCard from "../components/TradeCard";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Pagination from "../components/Pagination";
import ManageStrategiesModal from "../components/ManageStrategiesModal";
import AddTradeModal from "../components/AddTradeModal";

import { useTradeStore } from "../store/useTradeStore";
import { useAccountStore } from "../store/useAccountStore";

const PAGE_SIZE = 12; // 3 სვეტიან grid-ზე სრული რიგები
const DEBOUNCE_MS = 400;

// ბექენდის ველები სორტირებისთვის
const SORT_FIELDS = { Date: "entryDate", "P&L": "pnl", Symbol: "symbol" };

const DEFAULT_FILTERS = {
  status: "all",
  type: "all",
  strategy: "all",
  session: "all",
  fromDate: "",
  toDate: "",
  minPnl: "",
  maxPnl: "",
  results: [],
  tags: [],
  emotions: []
};

// მნიშვნელობა მხოლოდ დაყოვნების შემდეგ იცვლება, რომ ყოველ ასოზე მოთხოვნა არ გაიგზავნოს
function useDebouncedValue(value, delay = DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const hasValue = (v) => v !== "" && v !== null && v !== undefined;

const countActiveFilters = (f) => {
  let n = 0;
  ["status", "type", "strategy", "session"].forEach((k) => { if (f[k] && f[k] !== "all") n++; });
  ["fromDate", "toDate", "minPnl", "maxPnl"].forEach((k) => { if (hasValue(f[k])) n++; });
  ["results", "tags", "emotions"].forEach((k) => { if (f[k]?.length) n++; });
  return n;
};

export default function JournalPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStrategiesModalOpen, setIsStrategiesModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [filterState, setFilterState] = useState(DEFAULT_FILTERS);

  const { trades, pagination, journalMiniStats, fetchTrades, loading } = useTradeStore();
  const activeAccount = useAccountStore((state) => state.activeAccount);

  const accountId = activeAccount?._id || "";
  const totalPages = pagination.totalPages || 1;

  const debouncedFilters = useDebouncedValue(filterState);
  const debouncedSearch = useDebouncedValue(search.trim());

  // ბექენდისთვის გასაგზავნი პარამეტრები. ცარიელი და "all" ფილტრები საერთოდ არ იგზავნება
  const apiFilters = useMemo(() => {
    const f = debouncedFilters;
    const out = {
      account: accountId,
      limit: PAGE_SIZE,
      sortBy: SORT_FIELDS[sortBy],
      order: sortOrder,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    if (f.status && f.status !== "all") out.status = f.status;
    if (f.type && f.type !== "all") out.type = f.type;
    if (f.strategy && f.strategy !== "all") out.strategy = f.strategy;
    if (f.session && f.session !== "all") out.session = f.session;

    if (f.fromDate) out.fromDate = f.fromDate;
    if (f.toDate) out.toDate = f.toDate;
    if (hasValue(f.minPnl)) out.minPnl = f.minPnl;
    if (hasValue(f.maxPnl)) out.maxPnl = f.maxPnl;

    if (f.results?.length) out.result = f.results.join(",");
    if (f.tags?.length) out.tags = f.tags.join(",");
    if (f.emotions?.length) out.emotions = f.emotions.join(",");

    if (debouncedSearch) out.search = debouncedSearch;
    return out;
  }, [accountId, debouncedFilters, debouncedSearch, sortBy, sortOrder]);

  // ერთი ეფექტი: ფილტრის/ძებნის/სორტირების/ანგარიშის ცვლილებისას გვერდი 1-ზე ბრუნდება
  // და მოთხოვნა მხოლოდ ერთხელ იგზავნება (ორმაგი მოთხოვნის გარეშე)
  const filterKey = JSON.stringify(apiFilters);
  const prevFilterKey = useRef(filterKey);

  useEffect(() => {
    if (!accountId) return;

    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey;
      if (currentPage !== 1) {
        setCurrentPage(1); // ეფექტი თავიდან გაეშვება გვერდი 1-ით
        return;
      }
    }

    fetchTrades(currentPage, apiFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, currentPage, accountId]);

  // თუ ბოლო გვერდზე ბოლო თრეიდი წაშალეს, გვერდი ავტომატურად ერთით უკან გადავიდეს
  useEffect(() => {
    if (!loading && currentPage > 1 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

  // ლოკალური ძებნა მხოლოდ დამატებითი დაზღვევაა: სერვერი უკვე ფილტრავს `search` პარამეტრით
  const visibleTrades = useMemo(() => {
    if (!accountId) return [];
    const query = search.trim().toLowerCase();
    if (!query) return trades;
    return trades.filter(
      (trade) =>
        String(trade.symbol || "").toLowerCase().includes(query) ||
        String(trade.strategy || "").toLowerCase().includes(query) ||
        String(trade.notes || "").toLowerCase().includes(query) ||
        (Array.isArray(trade.tags) && trade.tags.some((t) => String(t).toLowerCase().includes(query)))
    );
  }, [trades, search, accountId]);

  const activeFilterCount = countActiveFilters(filterState);
  const hasActiveFilters = activeFilterCount > 0 || search.trim() !== "";

  const handleClearFilters = () => setFilterState(DEFAULT_FILTERS);

  const handleClearAll = () => {
    setFilterState(DEFAULT_FILTERS);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans selection:bg-[#0ecb81]/30">
      <div className="max-w-7xl mx-auto space-y-6">

        <PageHeader
          title="Trading Journal"
          description={activeAccount ? `${activeAccount.accountName} • Track and analyze your trades efficiently` : "No Active Account • Please select or create an account"}
          icon="📖"
        >
          <Button variant="outline" icon="📊" onClick={() => setIsStrategiesModalOpen(true)}>Strategies</Button>
          <Button variant="solid" icon="＋" onClick={() => setIsLogModalOpen(true)}>
            Add Trade
          </Button>
        </PageHeader>

        {/* მინი სტატისტიკა: ითვლება მიმდინარე ფილტრებზე (ყველა გვერდზე), არა მხოლოდ ხილულ თრეიდებზე */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            title="Total Trades"
            value={journalMiniStats?.totalTrades?.toString() || "0"}
            trend="neutral"
            icon="🔢"
          />
          <StatCard
            title="Win Rate"
            value={journalMiniStats?.winRate || "0.0%"}
            trend={parseFloat(journalMiniStats?.winRate) >= 50 ? "up" : "down"}
            icon="📈"
          />
          <StatCard
            title="Avg P&L"
            value={journalMiniStats?.avgPnL || "$0.00"}
            trend={journalMiniStats?.isAvgPositive ? "up" : "down"}
            icon="📊"
          />
          <StatCard
            title="Avg R:R"
            value={journalMiniStats?.avgRiskReward || "—"}
            trend="neutral"
            icon="🎯"
          />
          <StatCard
            title="Total P&L"
            value={journalMiniStats?.totalPnL || "$0.00"}
            trend={journalMiniStats?.isPnLPositive ? "up" : "down"}
            icon="💰"
          />
        </div>

        {/* ძებნა და ფილტრაცია */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#09090b] border border-[#1f2023] p-4 rounded-xl">
            <div className="relative w-full sm:max-w-md flex items-center">
              <span className="absolute left-4 text-[#4b5563]">🔍</span>
              <input
                type="text"
                placeholder="Search trades, symbols, strategies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0d0d0e] text-[#f3f4f6] border border-[#1f2023] rounded-lg pl-11 pr-4 py-2.5 text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={isFilterOpen || activeFilterCount > 0 ? "!border-[#0ecb81] !text-[#0ecb81]" : ""}
              icon="🎛️"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#0ecb81] text-[#040405] text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
              <span className="text-[10px] ml-1">{isFilterOpen ? "▲" : "▼"}</span>
            </Button>
          </div>

          <FilterPanel
            isOpen={isFilterOpen}
            state={filterState}
            setState={setFilterState}
            onClear={handleClearFilters}
          />
        </div>

        {/* სორტირება და ხედის შეცვლა */}
        <div className="flex items-center justify-between border-b border-[#1f2023] pb-3 pt-2">
          <div className="flex items-center gap-3 text-xs font-semibold text-[#6b7280]">
            <span className="whitespace-nowrap">Sort by:</span>
            <div className="w-32">
              <InputField
                type="select"
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={[
                  { label: "Date", value: "Date" },
                  { label: "P&L", value: "P&L" },
                  { label: "Symbol", value: "Symbol" }
                ]}
              />
            </div>
            <Button
              variant="icon-only"
              onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
              icon={<span className="text-sm" title={sortOrder === "desc" ? "Descending" : "Ascending"}>{sortOrder === "desc" ? "↓" : "↑"}</span>}
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0d0d0e] border border-[#1f2023] p-1 rounded-lg">
            <Button
              variant="icon-only"
              className={viewMode === "grid" ? "!bg-[#0ecb81] !text-[#040405]" : ""}
              onClick={() => setViewMode("grid")}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
            />
            <Button
              variant="icon-only"
              className={viewMode === "list" ? "!bg-[#0ecb81] !text-[#040405]" : ""}
              onClick={() => setViewMode("list")}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
            />
          </div>
        </div>

        {/* თრეიდების რენდერინგი. ფილტრის შეცვლისას ძველი სია რჩება და ბუნდოვანდება, მთელი გვერდი აღარ ციმციმებს */}
        {!accountId ? (
          <div className="text-center py-12 text-xs font-black text-[#4b5563] uppercase tracking-widest bg-[#09090b] border border-[#1f2023] rounded-xl">
            Please select or create an account.
          </div>
        ) : loading && trades.length === 0 ? (
          <div className="text-center py-12 text-xs font-black text-[#4b5563] uppercase tracking-widest animate-pulse">
            Loading trades from database...
          </div>
        ) : visibleTrades.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-[#09090b] border border-[#1f2023] rounded-xl">
            <p className="text-xs font-black text-[#4b5563] uppercase tracking-widest">
              {hasActiveFilters ? "No trades match your filters." : "No trades found for this account."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearAll} className="!text-xs">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              (viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in duration-200"
                : "flex flex-col gap-3 animate-in fade-in duration-200") +
              (loading ? " opacity-60 pointer-events-none transition-opacity" : "")
            }
          >
            {visibleTrades.map((trade) => (
              <TradeCard key={trade._id} trade={trade} viewMode={viewMode} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>

      <ManageStrategiesModal
        isOpen={isStrategiesModalOpen}
        onClose={() => setIsStrategiesModalOpen(false)}
      />
      {/* თრეიდის დამატების შემდეგ სთორი თავად ანახლებს სიას ბოლო ფილტრებით */}
      <AddTradeModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
}
