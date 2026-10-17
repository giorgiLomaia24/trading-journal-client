import axios from 'axios';

const axiosInstance = axios.create({
  // შეცვალე შენი ბექენდის რეალური პორტით და მისამართით
  baseURL: 'https://trading-journal-umber-nine.vercel.ap', 
});

// ეს ინტერსეპტორი ყოველ მოთხოვნაში ჩასვამს LocalStorage-დან აღებულ ტოკენს
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
