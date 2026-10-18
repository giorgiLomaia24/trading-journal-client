import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import { useAccountStore } from './useAccountStore';

// ბექტესტ ანგარიშზე ტრეიდის შეცვლა ანკორს (ვირტუალურ "დღეს") ცვლის, ამიტომ ანგარიშებს ვაახლებთ.
// ცოცხალ ანგარიშებზე ეს არაფერს აკეთებს და ზედმეტ მოთხოვნას არ აგზავნის
const refreshBacktestAnchors = () => {
  const { accounts, fetchAccounts } = useAccountStore.getState();
  if (accounts.some((a) => a.accountType === 'Backtest')) fetchAccounts();
};

// ფიქსირებული ნაგულისხმევი ზომა. ადრე ბოლო პასუხის pagination.limit გამოიყენებოდა,
// ამიტომ Dashboard-ის limit: 3 Journal-ზეც გადადიოდა
const DEFAULT_LIMIT = 10;

// სწრაფი ფილტრების გადართვისას ძველი დაგვიანებული პასუხი ახალს არ უნდა გადაეწეროს
let latestFetchId = 0;

export const useTradeStore = create((set, get) => ({
  trades: [],
  currentTrade: null,
  dailyTradesData: {
    dateText: "",
    summary: { wins: 0, losses: 0, totalPnL: "0.00", winRate: "0.0%", isPositive: true },
    trades: []
  },
  monthlyCalendarTrades: {},
  pagination: { totalTrades: 0, totalPages: 1, currentPage: 1, limit: DEFAULT_LIMIT },
  journalMiniStats: { totalTrades: 0, winRate: "0.0%", avgPnL: "$0.00", avgRiskReward: "—", totalPnL: "$0.00", isPnLPositive: true, isAvgPositive: true },
  // ბოლო მოთხოვნის პარამეტრები. შექმნის/ჩასწორების/წაშლის შემდეგ სია ზუსტად იმავე გვერდზე და ფილტრებით ახლდება
  lastQuery: { page: 1, filters: {} },
  loading: false,
  error: null,

  // 1. თრეიდების წამოღება ფილტრებით და პაგინაციით (GET ALL)
  fetchTrades: async (page = 1, filters = {}) => {
    const requestId = ++latestFetchId;
    set({ loading: true, error: null, lastQuery: { page, filters } });
    try {
      const params = { page, limit: DEFAULT_LIMIT, ...filters };
      const res = await axiosInstance.get('/trades', { params });

      if (requestId !== latestFetchId) return; // უფრო ახალი მოთხოვნა დაიწყო

      set({
        trades: res.data.trades || [],
        pagination: res.data.pagination || get().pagination,
        journalMiniStats: res.data.journalMiniStats || get().journalMiniStats,
        loading: false
      });
    } catch (err) {
      if (requestId !== latestFetchId) return;
      set({ error: err.response?.data?.message || 'წამოღება ვერ მოხერხდა', loading: false });
    }
  },

  // ბოლო მოთხოვნის გამეორება (იგივე გვერდი, იგივე ფილტრები)
  refetchTrades: () => {
    const { page, filters } = get().lastQuery;
    return get().fetchTrades(page, filters);
  },

  // 2. ახალი თრეიდის დაჟურნალება (POST)
  logTrade: async (tradeData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/trades', tradeData);
      if (res.status === 200 || res.status === 201) {
        await get().refetchTrades();
        refreshBacktestAnchors();
        return true;
      }
      set({ loading: false });
      return false;
    } catch (err) {
      set({ error: err.response?.data?.message || 'შენახვა ვერ მოხერხდა', loading: false });
      return false;
    }
  },

  // 3. კონკრეტული თრეიდის დეტალები (GET SINGLE)
  getTradeById: async (id) => {
    set({ loading: true, error: null, currentTrade: null });
    try {
      const res = await axiosInstance.get(`/trades/${id}`);
      set({ currentTrade: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'თრეიდი ვერ მოიძებნა', loading: false });
      return null;
    }
  },

  // 4. თრეიდის განახლება (PUT)
  updateTrade: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/trades/${id}`, updatedData);
      set({ currentTrade: res.data });
      await get().refetchTrades();
      refreshBacktestAnchors();
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'განახლება ვერ მოხერხდა', loading: false });
      return false;
    }
  },

  // 5. თრეიდის წაშლა (DELETE)
  deleteTrade: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/trades/${id}`);
      // სწრაფი UI-სთვის ჯერ ლოკალურად ვფილტრავთ, მერე სერვერიდან ვაახლებთ (პაგინაციის ციფრებისთვის)
      set((state) => ({ trades: state.trades.filter((t) => t._id !== id) }));
      await get().refetchTrades();
      refreshBacktestAnchors();
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'წაშლა ვერ მოხერხდა', loading: false });
      return false;
    }
  },

  // 6. კონკრეტული დღის თრეიდები კალენდრისთვის (GET BY DATE)
  fetchTradesByDate: async (date, accountId = "") => {
    set({ loading: true, error: null });
    try {
      const params = { date };
      if (accountId) params.account = accountId;

      const res = await axiosInstance.get('/trades/by-date', { params });
      set({ dailyTradesData: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'დღიური მონაცემების წამოღება ვერ მოხერხდა', loading: false });
    }
  },

  fetchMonthlyCalendarTrades: async (year, month, accountId = "") => {
    set({ loading: true, error: null });
    try {
      const start = new Date(year, month, 1).toISOString();
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

      const params = { startDate: start, endDate: end, limit: 100 };
      if (accountId) params.account = accountId;

      const res = await axiosInstance.get('/trades', { params });
      const monthlyTradesList = res.data.trades || [];

      const grouped = {};
      monthlyTradesList.forEach((trade) => {
        if (trade.entryDate) {
          const dateKey = trade.entryDate.split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push({
            ...trade,
            id: trade._id,
            time: new Date(trade.entryDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          });
        }
      });

      set({ monthlyCalendarTrades: grouped, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'კალენდრის ჩატვირთვა ვერ მოხერხდა', loading: false });
    }
  }
}));