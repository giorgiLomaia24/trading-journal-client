import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

// localStorage-ში დაზიანებული JSON აპლიკაციას არ უნდა გაუფუჭებდეს
const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const errorMessage = (err, fallback) => err.response?.data?.message || fallback;

// ბლობიდან შეცდომის ტექსტის ამოღება (responseType: 'blob'-ის დროს JSON შეცდომაც ბლობად მოდის)
const blobErrorMessage = async (err, fallback) => {
  try {
    if (err.response?.data instanceof Blob) {
      const text = await err.response.data.text();
      return JSON.parse(text).message || fallback;
    }
  } catch {
    /* იგნორირება */
  }
  return errorMessage(err, fallback);
};

export const useAuthStore = create((set, get) => ({
  user: readStoredUser(),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // ---------- ავტორიზაცია ----------
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/login', credentials);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      set({ user: res.data.user, token: res.data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, 'ავტორიზაცია ვერ მოხერხდა'), loading: false });
      return false;
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post('/auth/register', userData);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: errorMessage(err, 'რეგისტრაცია ვერ მოხერხდა'), loading: false });
      return false;
    }
  },

  // გამოსვლა. სრული გადატვირთვა ასუფთავებს ყველა სთორის მეხსიერებას (ანგარიშები, ტრეიდები, სტატისტიკა),
  // ამიტომ შემდეგ მომხმარებელს წინას მონაცემები არ დარჩება
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
    window.location.replace('/login');
  },

  clearError: () => set({ error: null }),

  // მომხმარებლის ობიექტის ნაწილობრივი განახლება (სახელი, ავატარი) სთორშიც და localStorage-შიც
  patchUser: (partial) => {
    const next = { ...(get().user || {}), ...partial };
    localStorage.setItem('user', JSON.stringify(next));
    set({ user: next });
  },

  // ---------- პაროლის აღდგენა (მეილით) ----------
  forgotPassword: async (email) => {
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'მოთხოვნა ვერ გაიგზავნა. სცადეთ თავიდან.') };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', { token, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'პაროლის შეცვლა ვერ მოხერხდა') };
    }
  },

  // ---------- პარამეტრები (Settings) ----------
  updateProfileName: async (name) => {
    try {
      const res = await axiosInstance.put('/auth/profile/name', { name });
      get().patchUser({ name: res.data.user.name });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'სახელის განახლება ვერ მოხერხდა') };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const res = await axiosInstance.put('/auth/profile/password', { currentPassword, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'პაროლის შეცვლა ვერ მოხერხდა') };
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await axiosInstance.post('/upload/profile-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      get().patchUser({ avatar: res.data.avatarUrl });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'ფოტოს ატვირთვა ვერ მოხერხდა') };
    }
  },

  // ყველა მონაცემის JSON ფაილად ჩამოტვირთვა
  exportMyData: async () => {
    try {
      const res = await axiosInstance.get('/auth/export', { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `yonko-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      return { success: false, message: await blobErrorMessage(err, 'ექსპორტი ვერ მოხერხდა') };
    }
  },

  // ანგარიშისა და ყველა მონაცემის სამუდამო წაშლა. წარმატების შემდეგ მომხმარებელი გამოდის სისტემიდან
  deleteMyAccount: async (password) => {
    try {
      await axiosInstance.delete('/auth/account', { data: { password } });
      get().logout();
      return { success: true };
    } catch (err) {
      return { success: false, message: errorMessage(err, 'ანგარიშის წაშლა ვერ მოხერხდა') };
    }
  }
}));