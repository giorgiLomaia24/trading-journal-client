// import { create } from 'zustand';
// import axiosInstance from '../api/axiosInstance';

// export const useAccountStore = create((set, get) => ({
//   accounts: [],
//   // თავიდან ვცდილობთ localStorage-დან წავიკითხოთ ბოლოს არჩეული ექაუნთი
//   activeAccount: JSON.parse(localStorage.getItem('activeAccount')) || null,
//   loading: false,
//   error: null,

//   // აქტიური ანგარიშის შეცვლა + localStorage-ში შენახვა
//   setActiveAccount: (account) => {
//     localStorage.setItem('activeAccount', JSON.stringify(account));
//     set({ activeAccount: account });
//   },

//   // მომხმარებლის ყველა ანგარიშის წამოღება ბაზიდან
//   fetchAccounts: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await axiosInstance.get('/accounts');
//       const fetchedAccounts = res.data;
      
//       // ვამოწმებთ, localStorage-ში შენახული ექაუნთი ისევ არსებობს თუ არა წამოღებულ სიაში
//       const currentActive = get().activeAccount;
//       const exists = fetchedAccounts.find(acc => acc._id === currentActive?._id);

//       let nextActive = currentActive;

//       // თუ localStorage ცარიელია ან ის ექაუნთი აღარ არსებობს, ავტომატურად პირველს ვააქტიურებთ
//       if (!exists && fetchedAccounts.length > 0) {
//         nextActive = fetchedAccounts[0];
//         localStorage.setItem('activeAccount', JSON.stringify(nextActive));
//       } else if (fetchedAccounts.length === 0) {
//         nextActive = null;
//         localStorage.removeItem('activeAccount');
//       }

//       set({ 
//         accounts: fetchedAccounts, 
//         activeAccount: nextActive, 
//         loading: false 
//       });
//     } catch (err) {
//       set({ error: err.response?.data?.message || err.message, loading: false });
//     }
//   },

//   createAccount: async (accountData) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await axiosInstance.post('/accounts', accountData);
//       const newAccount = res.data;
      
//       set((state) => {
//         const updatedAccounts = [...state.accounts, newAccount];
//         // თუ პირველივე ანგარიშია, ავტომატურად ის ხდება აქტიური
//         const currentActive = state.activeAccount ? state.activeAccount : newAccount;
//         if (!state.activeAccount) {
//           localStorage.setItem('activeAccount', JSON.stringify(newAccount));
//         }
//         return { 
//           accounts: updatedAccounts, 
//           activeAccount: currentActive,
//           loading: false 
//         };
//       });
//       return true;
//     } catch (err) {
//       set({ error: err.response?.data?.message || err.message, loading: false });
//       return false;
//     }
//   },

//   updateAccount: async (id, data) => {
//   try {
//     const res = await axiosInstance.put(`/accounts/${id}`, data);
//     set((state) => ({
//       accounts: state.accounts.map((a) => (a._id === id ? res.data : a)),
//       // თუ გადარქმეული ანგარიში აქტიურია, მისი სახელიც განახლდეს ყველა გვერდზე
//       activeAccount: state.activeAccount?._id === id ? res.data : state.activeAccount
//     }));
//     return { success: true };
//   } catch (err) {
//     return { success: false, message: err.response?.data?.message || "ვერ მოხერხდა ანგარიშის განახლება" };
//   }
// },

// deleteAccount: async (id) => {
//   try {
//     await axiosInstance.delete(`/accounts/${id}`);
//     const remaining = get().accounts.filter((a) => a._id !== id);
//     const wasActive = get().activeAccount?._id === id;
//     set({ accounts: remaining });

//     // თუ აქტიური ანგარიში წაიშალა, გადავერთოთ შემდეგზე (ან გავასუფთავოთ)
//     if (wasActive) {
//       if (remaining.length > 0) get().setActiveAccount(remaining[0]);
//       else set({ activeAccount: null });
//     }
//     return { success: true };
//   } catch (err) {
//     return { success: false, message: err.response?.data?.message || "ვერ მოხერხდა ანგარიშის წაშლა" };
//   }
// },
// }));

import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useAccountStore = create((set, get) => ({
  accounts: [],
  // თავიდან ვცდილობთ localStorage-დან წავიკითხოთ ბოლოს არჩეული ექაუნთი
  activeAccount: JSON.parse(localStorage.getItem('activeAccount')) || null,
  loading: false,
  error: null,

  // აქტიური ანგარიშის შეცვლა + localStorage-ში შენახვა
  setActiveAccount: (account) => {
    localStorage.setItem('activeAccount', JSON.stringify(account));
    set({ activeAccount: account });
  },

  // მომხმარებლის ყველა ანგარიშის წამოღება ბაზიდან
  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/accounts');
      const fetchedAccounts = res.data;

      // აქტიური ანგარიშის სვეში ვიღებთ ახალ ვერსიას (და არა localStorage-ში შენახულ ძველს),
      // რომ ბექტესტ ანგარიშის anchorDate ყოველთვის აქტუალური იყოს
      const currentActive = get().activeAccount;
      const freshActive = fetchedAccounts.find((acc) => acc._id === currentActive?._id);

      // თუ localStorage ცარიელია ან ის ექაუნთი აღარ არსებობს, ავტომატურად პირველს ვააქტიურებთ
      let nextActive = freshActive || null;
      if (!nextActive && fetchedAccounts.length > 0) nextActive = fetchedAccounts[0];

      if (nextActive) localStorage.setItem('activeAccount', JSON.stringify(nextActive));
      else localStorage.removeItem('activeAccount');

      set({
        accounts: fetchedAccounts,
        activeAccount: nextActive,
        loading: false
      });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  createAccount: async (accountData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/accounts', accountData);
      const newAccount = res.data;

      set((state) => {
        const updatedAccounts = [...state.accounts, newAccount];
        // თუ პირველივე ანგარიშია, ავტომატურად ის ხდება აქტიური
        const currentActive = state.activeAccount ? state.activeAccount : newAccount;
        if (!state.activeAccount) {
          localStorage.setItem('activeAccount', JSON.stringify(newAccount));
        }
        return {
          accounts: updatedAccounts,
          activeAccount: currentActive,
          loading: false
        };
      });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },

  updateAccount: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/accounts/${id}`, data);
      set((state) => ({
        accounts: state.accounts.map((a) => (a._id === id ? res.data : a)),
        // თუ გადარქმეული ანგარიში აქტიურია, მისი სახელიც განახლდეს ყველა გვერდზე
        activeAccount: state.activeAccount?._id === id ? res.data : state.activeAccount
      }));
      if (get().activeAccount?._id === id) {
        localStorage.setItem('activeAccount', JSON.stringify(res.data));
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "ვერ მოხერხდა ანგარიშის განახლება" };
    }
  },

  deleteAccount: async (id) => {
    try {
      await axiosInstance.delete(`/accounts/${id}`);
      const remaining = get().accounts.filter((a) => a._id !== id);
      const wasActive = get().activeAccount?._id === id;
      set({ accounts: remaining });

      // თუ აქტიური ანგარიში წაიშალა, გადავერთოთ შემდეგზე (ან გავასუფთავოთ)
      if (wasActive) {
        if (remaining.length > 0) get().setActiveAccount(remaining[0]);
        else {
          localStorage.removeItem('activeAccount');
          set({ activeAccount: null });
        }
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "ვერ მოხერხდა ანგარიშის წაშლა" };
    }
  },
}));
