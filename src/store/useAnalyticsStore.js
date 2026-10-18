// ==========================================
// useAnalyticsStore.js
// ==========================================
import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// Race Condition-ის დაცვა: აქტიური მოთხოვნის კონტროლერი + უახლესი მოთხოვნის ID
let currentAbortController = null;
let latestRequestId = 0;
let latestChartRequestId = 0;

const isCanceled = (err) =>
  axios.isCancel(err) || err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError';

export const useAnalyticsStore = create((set) => ({
  kpiData: null,
  performanceChartData: [],
  performanceScore: null,
  heatmapData: null,
  calendarMonthData: null,
  advancedStats: null,
  loading: false,          // KPI/chart/score/heatmap-ისთვის
  advancedLoading: false,  // მხოლოდ Statistics გვერდისთვის (ცალკე, რომ ერთმანეთს არ ებლოკონ)
  error: null,

  fetchKpiCardsData: async (accountId = "") => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/analytics/kpi-cards', { params: { account: accountId } });
      set({ kpiData: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'KPI მონაცემები ვერ მოიძებნა', loading: false });
    }
  },

  fetchPerformanceChartData: async (accountId = "", range = "") => {
    const requestId = ++latestChartRequestId;
    set({ loading: true, error: null });
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await axiosInstance.get('/analytics/performance-chart', {
        params: { account: accountId, range, tz }
      });
      if (requestId !== latestChartRequestId) return; // უფრო ახალი მოთხოვნა დაიწყო
      set({ performanceChartData: res.data, loading: false });
    } catch (err) {
      if (requestId !== latestChartRequestId) return;
      set({ error: err.response?.data?.message || 'გრაფიკის მონაცემები ვერ მოიძებნა', loading: false });
    }
  },

  fetchPerformanceScoreData: async (accountId = "") => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/analytics/performance-score', { params: { account: accountId } });
      set({ performanceScore: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Score-ის წამოღება ვერ მოხერხდა', loading: false });
    }
  },

  // Heatmap: tz-ს ვუგზავნით, რომ დღეები ბრაუზერის დროის ზონით დაჯგუფდეს (ბადესთან ერთნაირად)
  fetchTradingActivityHeatmap: async (accountId = "") => {
    set({ loading: true, error: null });
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await axiosInstance.get('/analytics/heatmap', { params: { account: accountId, tz } });
      set({ heatmapData: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Heatmap-ის წამოღება ვერ მოხერხდა', loading: false });
    }
  },

  // Race-safe სტატისტიკა
  fetchAdvancedStatistics: async (filters = {}) => {
    // წინა აქტიური მოთხოვნის გაუქმება
    if (currentAbortController) currentAbortController.abort();

    const controller = new AbortController();
    currentAbortController = controller;
    const requestId = ++latestRequestId;

    set({ advancedLoading: true, error: null });

    try {
      const params = {
        account: filters.account || "",
        strategy: filters.strategy || "All Strategies",
        timeframe: filters.timeframe || "30 days"
      };

      const res = await axiosInstance.get('/analytics/advanced-stats', {
        params,
        signal: controller.signal
      });

      // მეორე დაცვა: თუ ამასობაში უფრო ახალი მოთხოვნა დაიწყო, ეს პასუხი იგნორდება
      if (requestId !== latestRequestId) return;

      set({ advancedStats: res.data, advancedLoading: false });
    } catch (err) {
      if (isCanceled(err)) return;          // ჩვენივე გაუქმება: სტეიტს არ ვეხებით
      if (requestId !== latestRequestId) return;

      set({
        error: err.response?.data?.message || 'სტატისტიკის წამოღება ვერ მოხერხდა',
        advancedLoading: false
      });
    } finally {
      // ვასუფთავებთ მხოლოდ საკუთარ კონტროლერს, სხვისას არ ვეხებით
      if (currentAbortController === controller) currentAbortController = null;
    }
  },

  // ფილტრის შეცვლისას ძველი მონაცემის გასუფთავება
  resetAdvancedStats: () => set({ advancedStats: null, error: null }),

  // აქტიური მოთხოვნის გაუქმება (მაგ. გვერდიდან გასვლისას)
  cancelAdvancedStatistics: () => {
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
  },

  clearAnalyticsCache: () => {
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
    latestRequestId++;
    set({
      kpiData: null,
      performanceChartData: [],
      performanceScore: null,
      heatmapData: null,
      calendarMonthData: null,
      advancedStats: null,
      error: null,
      loading: false,
      advancedLoading: false
    });
  }
}));