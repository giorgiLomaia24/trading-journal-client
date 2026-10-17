import axios from 'axios';

const axiosInstance = axios.create({
  // შეცვალე შენი ბექენდის რეალური პორტით და მისამართით
  baseURL: 'https://trading-journal-pmzr-q14d6t60s-giorgis-projects-242655bb.vercel.app/api', 
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
