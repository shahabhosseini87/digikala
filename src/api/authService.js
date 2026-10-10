// // src/api/authService.js
// const API_BASE = 'http://localhost:3000';

// // تابع لاگین کردن کاربر و ذخیره توکن
// export async function loginUser(email, password) {
//   const response = await fetch(`${API_BASE}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!response.ok) throw new Error('اطلاعات ورود اشتباه است');

//   const result = await response.json();
//   const token = result.token || result.data.token;
  
//   // ذخیره توکن در حافظه مرورگر
//   localStorage.setItem('authToken', token);
//   return true;
// }

// // تابع بررسی اینکه آیا کاربر لاگین کرده است یا خیر
// export function isAuthenticated() {
//   const token = localStorage.getItem('authToken');
//   return Boolean(token); // اگر توکن بود true برمی‌گرداند، وگرنه false
// }