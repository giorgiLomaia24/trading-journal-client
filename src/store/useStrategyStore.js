import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useStrategyStore = create((set) => ({
  strategies: [],
  loading: false,
  error: null,

  // 1. ბაზიდან მომხმარებლის ყველა სტრატეგიის წამოღება (GET)
  fetchStrategies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/strategies'); // შენი როუტი: router.get('/')
      set({ strategies: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // 2. ახალი სტრატეგიის შექმნა წესებთან ერთად (POST)
  createStrategy: async (strategyData) => {
    set({ loading: true, error: null });
    try {
      // strategyData უნდა შეიცავდეს: { strategyName, description, color, rules: [{ ruleId, text }] }
      const res = await axiosInstance.post('/strategies', strategyData); // router.post('/')
      set((state) => ({ 
        strategies: [...state.strategies, res.data], 
        loading: false 
      }));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },

  // ჩაამატე useStrategyStore.js-ის შიგნით (სხვა ფუნქციების გვერდით)
updateStrategy: async (id, updatedData) => {
  set({ loading: true });
  try {
    const res = await axiosInstance.put(`/strategies/${id}`, updatedData);
    
    // განახლების მერე მომენტალურად ვაახლებთ ლოკალურ მასივს სთორში
    set((state) => ({
      strategies: state.strategies.map((s) => (s._id === id ? res.data : s)),
      loading: false
    }));
    return true;
  } catch (err) {
    set({ loading: false });
    return false;
  }
},


  // 3. სტრატეგიის წაშლა (DELETE)
  deleteStrategy: async (id) => {
    try {
      await axiosInstance.delete(`/strategies/${id}`); // router.delete('/:id')
      set((state) => ({ 
        strategies: state.strategies.filter((strat) => strat._id !== id) 
      }));
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    }
  }
}));
