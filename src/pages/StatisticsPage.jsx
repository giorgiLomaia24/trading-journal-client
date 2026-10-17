import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AnalyticsCard from "../components/AnalyticsCard";
import PerformanceChart from "../components/PerformanceChart";
import WinLossDonut from "../components/WinLossDonut";
import PatternsView from "../components/PatternsView";
import StrategiesView from "../components/StrategiesView";
import ChartsView from "../components/ChartsView";

import { useAnalyticsStore } from "../store/useAnalyticsStore";
import { useAccountStore } from "../store/useAccountStore";
import { useStrategyStore } from "../store/useStrategyStore";

export default function StatisticsPage() {
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("30 days");
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  const advancedStats = useAnalyticsStore((s) => s.advancedStats);
  const advancedLoading = useAnalyticsStore((s) => s.advancedLoading);
  const error = useAnalyticsStore((s) => s.error);
  const fetchAdvancedStatistics = useAnalyticsStore((s) => s.fetchAdvancedStatistics);
  const resetAdvancedStats = useAnalyticsStore((s) => s.resetAdvancedStats);
  const cancelAdvancedStatistics = useAnalyticsStore((s) => s.cancelAdvancedStatistics);

  const activeAccount = useAccountStore((state) => state.activeAccount);
  const strategies = useStrategyStore((s) => s.strategies) || [];
  const fetchStrategies = useStrategyStore((s) => s.fetchStrategies);

  const accountId = activeAccount?._id || "";

  // 1) სტრატეგიების სია იტვირთება მხოლოდ ერთხელ (Mount)
  useEffect(() => {
    fetchStrategies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = useCallback(() => {
    fetchAdvancedStatistics({
      account: accountId,
      strategy: strategyFilter === "all" ? "All Strategies" : strategyFilter,
      timeframe: periodFilter
    });
  }, [fetchAdvancedStatistics, accountId, strategyFilter, periodFilter]);

  // 2) ფილტრის ყოველ ცვლილებაზე: ჯერ ძველი სტეიტის გასუფთავება, მერე ახალი მოთხოვნა.
  //    Cleanup აუქმებს აქტიურ მოთხოვნას გვერდიდან გასვლისას.
  useEffect(() => {
    resetAdvancedStats();
    loadStats();
    return () => cancelAdvancedStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, strategyFilter, periodFilter]);

  const po = advancedStats?.performanceOverview || {};
  const aa = advancedStats?.advancedAnalytics || {};
  const bp = advancedStats?.bestPerformance || {};
  const charts = advancedStats?.charts || {};

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans selection:bg-[#0ecb81]/30 text-left">
      <div className="max-w-7xl mx-auto space-y-6">

        <PageHeader
          title="Statistics"
          description={activeAccount ? `Comprehensive trading performance analytics • ${activeAccount.accountName}` : "Comprehensive trading performance analytics"}
          icon="📊"
        >
          <div className="w-40 text-xs font-semibold">
            <InputField
              type="select"
              value={strategyFilter}
              onChange={(val) => setStrategyFilter(val)}
              options={[
                { label: "All Strategies", value: "all" },
                ...strategies.map((s) => ({ label: s.strategyName, value: s._id }))
              ]}
            />
          </div>

          <div className="w-32 text-xs font-semibold">
            <InputField
              type="select"
              value={periodFilter}
              onChange={(val) => setPeriodFilter(val)}
              options={[
                { label: "30 days", value: "30 days" },
                { label: "7 days", value: "7 days" },
                { label: "All Time", value: "all" }
              ]}
            />
          </div>

          <Button variant="outline" icon="🔄" onClick={loadStats}>Refresh</Button>
          {/* <Button variant="outline" icon="📥">CSV</Button> */}
        </PageHeader>

        {error && !advancedLoading && !advancedStats ? (
          <div className="w-full py-10 text-center text-xs font-bold text-[#f6465d] bg-[#09090b] border border-[#1f2023] rounded-xl">
            {error}
          </div>
        ) : advancedLoading || !advancedStats ? (
          <div className="w-full py-20 text-center text-xs font-black text-[#4b5563] uppercase tracking-widest animate-pulse bg-[#09090b] border border-[#1f2023] rounded-xl">
            Loading real-time database analytics...
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Performance Overview */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                <span className="text-[#0ecb81]">📊</span> Performance Overview
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <AnalyticsCard title="Total P&L" value={po.totalPnL || "0.00"} tagText={po.isPnLPositive ? "↗ Profit" : "📉 Loss"} tagVariant={po.isPnLPositive ? "success" : "danger"} variant={po.isPnLPositive ? "success" : "danger"} />
                <AnalyticsCard title="Win Rate" value={po.winRate || "0.0%"} tagText={po.winLossRatioText || "0W / 0L"} tagVariant="info" variant="neutral" />
                <AnalyticsCard title="Trades" value={(po.totalTrades || 0).toString()} tagText={`${po.totalTrades || 0} closed`} tagVariant="neutral" variant="neutral" />
                <AnalyticsCard title="Avg Win" value={po.avgWin || "+$0.00"} valueColors="success" tagText={po.bestWinSymbol || "N/A"} tagVariant="success" variant="success" />
                <AnalyticsCard title="Avg Loss" value={po.avgLoss || "-$0.00"} tagText={po.worstLossSymbol || "N/A"} tagVariant="danger" variant="danger" />
                <AnalyticsCard title="Profit Factor" value={po.profitFactor || "0.00"} tagText={po.profitFactorStatus || "POOR"} tagVariant={po.profitFactorStatus === "EXCELLENT" || po.profitFactorStatus === "GOOD" ? "success" : "danger"} variant={po.profitFactorStatus === "EXCELLENT" || po.profitFactorStatus === "GOOD" ? "success" : "danger"} />
              </div>
            </div>

            {/* Advanced Analytics */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                <span className="text-[#a855f7]">🔗</span> Advanced Analytics
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AnalyticsCard title="Expectancy" value={aa.expectancy || "0.00"} tagText="Per trade" tagVariant="neutral" variant={parseFloat(aa.expectancy) >= 0 ? "success" : "danger"} />
                <AnalyticsCard title="Risk-Adjusted" value={aa.sharpeRatio || "0.00"} tagText="Sharpe ratio" tagVariant="neutral" variant={parseFloat(aa.sharpeRatio) >= 0 ? "success" : "danger"} />
                <AnalyticsCard title="Best Trade" value={aa.bestTrade || "+$0.00"} tagText={aa.bestTradeSymbol || "N/A"} tagVariant="success" variant="success" />
                <AnalyticsCard title="Worst Trade" value={aa.worstTrade || "-$0.00"} tagText={aa.worstTradeSymbol || "N/A"} tagVariant="danger" variant="danger" />
              </div>
            </div>

            {/* შიდა თაბები */}
            <div className="flex items-center gap-1 bg-[#09090b] border border-[#1f2023] p-1.5 rounded-xl max-w-lg">
              {["Overview", "Patterns", "Strategies", "Charts"].map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  active={activeSubTab === tab}
                  onClick={() => setActiveSubTab(tab)}
                  className="!py-2 !px-4 !text-xs font-bold"
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Best Performance */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                <span className="text-[#eab308]">👑</span> Best Performance
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <AnalyticsCard title="Best Day" value={bp.bestDayPnL || "0.00"} tagText={bp.bestDay || "N/A"} tagVariant="neutral" variant="success" badgeIcon="👑" />
                <AnalyticsCard title="Best Week" value={bp.bestWeekPnL || "0.00"} tagText={bp.bestWeek || "N/A"} tagVariant="neutral" variant="success" badgeIcon="⭐" />
                <AnalyticsCard title="Best Month" value={bp.bestMonthPnL || "0.00"} tagText={bp.bestMonth || "N/A"} tagVariant="neutral" variant="success" badgeIcon="📈" />
                <AnalyticsCard title="Best Year" value={bp.bestYearPnL || "0.00"} tagText={bp.bestYear || "N/A"} tagVariant="neutral" variant="success" badgeIcon="🔋" />
                <AnalyticsCard title="Best Session" value={bp.bestSession && bp.bestSession !== "N/A" ? "Active" : "N/A"} tagText={bp.bestSession || "N/A"} tagVariant="neutral" variant="success" badgeIcon="☀️" />
              </div>
            </div>

            {/* კონტენტი აქტიური თაბის მიხედვით */}
            <div className="w-full pt-2">
              {activeSubTab === "Overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <PerformanceChart data={charts.timelineData || []} activeTab="DailyP&L" isEmbedded={true} />
                  <WinLossDonut wins={charts.donutData?.wins || 0} losses={charts.donutData?.losses || 0} />
                </div>
              )}

              {activeSubTab === "Patterns" && (
                <PatternsView dayData={advancedStats.dayOfWeekPerformance || []} sessionData={advancedStats.sessionPerformance || []} />
              )}

              {activeSubTab === "Strategies" && (
                <StrategiesView strategyData={advancedStats.activeStrategyPerformance} ruleData={advancedStats.ruleAdherence || []} />
              )}

             {activeSubTab === "Charts" && (
  <ChartsView
    timelineData={charts.timelineData || []}
    monthlyData={charts.monthlyData || []}
    wins={charts.donutData?.wins || 0}
    losses={charts.donutData?.losses || 0}
    strategyDonut={charts.strategyDonutData || []}
  />
)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}