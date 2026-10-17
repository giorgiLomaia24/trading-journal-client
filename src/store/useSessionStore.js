import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useSessionStore = create((set) => ({
  sessions: [],
  loading: false,
  error: null,

  // 1. მომხმარებლის სესიების წამოღება (GET)
  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/sessions');
      set({ sessions: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // 2. ახალი სესიის შექმნა (POST). აბრუნებს { success, session } ან { success: false, message }
  createSession: async (sessionName) => {
    try {
      const res = await axiosInstance.post('/sessions', { sessionName });
      set((state) => ({ sessions: [...state.sessions, res.data] }));
      return { success: true, session: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'ვერ მოხერხდა სესიის შექმნა'
      };
    }
  },

  // გამოსვლისას ქეშის გასუფთავება
  clearSessions: () => set({ sessions: [], error: null, loading: false })
}));