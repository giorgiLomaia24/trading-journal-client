// ==================== DASHBOARD PAGE ====================
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import AnalyticsCard from "../components/AnalyticsCard";
import PerformanceChart from "../components/PerformanceChart";
import RadarPerformance from "../components/RadarPerformance";
import ScoreMetric from "../components/ScoreMetric";
import ActivityHeatmap from "../components/ActivityHeatmap";
import TradeCard from "../components/TradeCard";
import AddTradeModal from "../components/AddTradeModal";
import { useAuthStore } from "../store/useAuthStore";

import { useAnalyticsStore } from "../store/useAnalyticsStore";
import { useTradeStore } from "../store/useTradeStore";
import { useAccountStore } from "../store/useAccountStore";
import { useStrategyStore } from "../store/useStrategyStore";

// $-ის ნიშნის სწორი ფორმატი: -$50.00 (და არა $-50.00)
const money = (v) => {
  const n = Number(v) || 0;
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toFixed(2)}`;
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const [chartViewTab, setChartViewTab] = useState("EquityCurve");
  const [timeRange, setTimeRange] = useState("30D");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const activeAccount = useAccountStore((state) => state.activeAccount);
  const fetchStrategies = useStrategyStore((state) => state.fetchStrategies);

  const {
    kpiData,
    performanceChartData,
    performanceScore,
    heatmapData,
    fetchKpiCardsData,
    fetchPerformanceChartData,
    fetchPerformanceScoreData,
    fetchTradingActivityHeatmap
  } = useAnalyticsStore();

  const { trades, fetchTrades, loading: tradesLoading } = useTradeStore();

  const accountId = activeAccount?._id || "";

  // ერთი ფუნქცია პირველადი ჩატვირთვისთვისაც და თრეიდის დამატების შემდეგ განახლებისთვისაც.
  // ყოველთვის გადაეცემა აქტიური ანგარიში, ამიტომ ყველა ანგარიშის ჯამი აღარ აირევა
 const refreshDashboard = useCallback(() => {
  fetchKpiCardsData(accountId);
  fetchPerformanceScoreData(accountId);
  fetchTradingActivityHeatmap(accountId);
  fetchTrades(1, { limit: 3, account: accountId });
}, [
  accountId,
  fetchKpiCardsData,
  fetchPerformanceScoreData,
  fetchTradingActivityHeatmap,
  fetchTrades
]);

const loadChart = useCallback(() => {
  fetchPerformanceChartData(accountId, timeRange);
}, [accountId, timeRange, fetchPerformanceChartData]);

useEffect(() => {
  refreshDashboard();
}, [refreshDashboard]);

useEffect(() => {
  loadChart();
}, [loadChart]);

  // სტრატეგიები მხოლოდ ერთხელ
  useEffect(() => {
    fetchStrategies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ანგარიშის შეცვლისას ხელახლა იტვირთება მთელი დეშბორდი
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Loading ეკრანი მხოლოდ პირველად ჩატვირთვაზე. განახლებისას გვერდი აღარ გაქრება
  if (!kpiData) {
    return (
      <div className="min-h-screen bg-[#040405] text-[#4b5563] font-black text-xs uppercase tracking-widest flex items-center justify-center animate-pulse">
        Loading premium dashboard analytics...
      </div>
    );
  }

  const anchorLabel = kpiData.anchorDate
  ? new Date(kpiData.anchorDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  : "";
const headerDescription = kpiData.isBacktest
  ? `Backtest account • as of ${anchorLabel}`
  : new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const totalPnLValue = Number(kpiData.totalPnL?.value) || 0;

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans selection:bg-[#0ecb81]/30 text-left">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* 1. მისალმების პანელი */}
        <PageHeader
          title={"Welcome back, " + (user?.name || "Trader")}
          description={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        >
          <Button variant="solid" icon="+" onClick={() => setIsLogModalOpen(true)}>Log Trade</Button>
        </PageHeader>

        {/* 2. Daily Inspiration */}
        <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span>✨</span> Daily Inspiration <span>✨</span>
          </span>
          <p className="text-xs font-semibold text-[#9ca3af] italic"> "What you seek lies beyond the throne of an Emperor. But remember: to claim the title of Yonko, you must first let the darkness consume you." </p>
        </div>

        {/* 3. KPI ბარათები */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <AnalyticsCard
            isPremium={true}
            variant="pnl"
            title="Total P&L"
            value={money(totalPnLValue)}
            tagText={kpiData.totalPnL?.isPositive ? `↗ +${money(totalPnLValue)}` : `📉 ${money(totalPnLValue)}`}
            tagVariant={kpiData.totalPnL?.isPositive ? "success" : "danger"}
            sparklineData={kpiData.totalPnL?.sparkline}
          />
          <AnalyticsCard
            isPremium={true}
            variant="winrate"
            title="Win Rate"
            value={kpiData.winRate?.value}
            tagText={kpiData.winRate?.change}
            tagVariant={kpiData.winRate?.isPositive ? "success" : "danger"}
            sparklineData={kpiData.winRate?.sparkline}
          />
          <AnalyticsCard
            isPremium={true}
            variant="trades"
            title="Total Trades"
            value={kpiData.totalTrades?.value?.toString()}
            tagText={`📂 ${kpiData.totalTrades?.closedCount} closed`}
            tagVariant="neutral"
          />
          <AnalyticsCard
            isPremium={true}
            variant="avgwl"
            title="Avg Win/Loss"
            value={`${kpiData.avgWinLoss?.avgWin} / ${kpiData.avgWinLoss?.avgLoss}`}
            tagText={kpiData.avgWinLoss?.status === "Good R:R" ? "⚖️ Good R:R" : "⚠️ Review R:R"}
            tagVariant={kpiData.avgWinLoss?.isWarning ? "danger" : "success"}
          />
        </div>

        {/* 4. Performance Overview + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2023]/60 pb-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-black text-[#f3f4f6] tracking-tight">Performance Overview</h3>
                <span className="text-[10px] font-semibold text-[#4b5563]">Success rate of your trades</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-[#0d0d0e] border border-[#1f2023] p-1 rounded-lg text-[10px] font-bold">
                  {["EquityCurve", "WinRate", "DailyP&L"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setChartViewTab(tab)}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${chartViewTab === tab ? "bg-[#0ecb81] text-[#040405] font-black" : "text-[#6b7280] hover:text-[#f3f4f6]"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* ყურადღება: timeRange ჯერ არც ბექენდს გადაეცემა და არც გრაფიკს, ამიტომ ვიზუალურია */}
                <div className="flex items-center gap-1 bg-[#0d0d0e] border border-[#1f2023] p-1 rounded-lg text-[10px] font-black font-mono">
                  {["7D", "30D", "90D", "1Y"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`w-8 py-1 rounded transition-all cursor-pointer ${timeRange === range ? "bg-[#1f2023] text-[#0ecb81] border border-[#0ecb81]/20" : "text-[#4b5563] hover:text-[#9ca3af]"}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full pt-4">
              <PerformanceChart
                data={performanceChartData || []}
                activeTab={chartViewTab}
                isEmbedded={true}
              />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <RadarPerformance data={performanceScore?.radarData || []} />
            <ScoreMetric score={performanceScore?.performanceScore || 0} />
          </div>
        </div>

        {/* 5. Recent Trades + Activity Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2023]/60 pb-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-black text-[#f3f4f6] tracking-tight flex items-center gap-1.5">
                  <span>↗️</span> Recent Trades
                </h3>
                <span className="text-[10px] font-semibold text-[#4b5563]">Your latest account activity</span>
              </div>
              <Button variant="outline" className="!py-1 !px-3 !text-[11px]" onClick={() => navigate("/journal")}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {tradesLoading && trades.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#4b5563] font-black uppercase tracking-widest animate-pulse">
                  Loading recent activity...
                </div>
              ) : trades.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#4b5563] font-black uppercase tracking-widest bg-[#0d0d0e]/50 border border-[#1f2023] rounded-xl">
                  No trades logged yet.
                </div>
              ) : (
                trades.slice(0, 3).map((trade) => {
                  const adaptedTrade = {
                    ...trade,
                    id: trade._id,
                    date: trade.entryDate
                      ? new Date(trade.entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"
                  };
                  return <TradeCard key={trade._id} trade={adaptedTrade} viewMode="list" />;
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* <ActivityHeatmap data={heatmapData?.heatmapData || []} /> */}
            <ActivityHeatmap
  data={heatmapData?.heatmapData || []}
  anchorDate={kpiData.isBacktest ? heatmapData?.range?.end : undefined}
/>
          </div>
        </div>
      </div>

      {/* თრეიდის დამატების მოდალი */}
   <AddTradeModal
  isOpen={isLogModalOpen}
  onClose={() => setIsLogModalOpen(false)}
  onSave={() => {
    refreshDashboard();
    loadChart();
  }}
/>
    </div>
  );
}

