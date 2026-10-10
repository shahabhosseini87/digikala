// // src/api/productService.js
// const API_BASE = 'http://localhost:3000';

// // تابع کمکی برای گرفتن هدر مجهز به توکن
// function getAuthHeaders() {
//   const token = localStorage.getItem('authToken');
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { 'Authorization': `Bearer ${token}` })
//   };
// }

// // 1. خواندن کارت‌ها (Read)
// export async function fetchCards(signal) {
//   const response = await fetch(`${API_BASE}/products`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//     signal,
//   });
//   if (!response.ok) throw new Error('خطا در دریافت کارت‌ها');
//   const result = await response.json();
//   return result.data || result;
// }

// // 2. حذف محصول (Delete)
// export async function deleteProduct(productId) {
//   const response = await fetch(`${API_BASE}/products/${productId}`, {
//     method: 'DELETE',
//     headers: getAuthHeaders(),
//   });
//   if (!response.ok) throw new Error('خطا در حذف محصول');
//   return true;
// }

// // 3. ویرایش محصول (Update)
// export async function updateProduct(productId, updatedData) {
//   const response = await fetch(`${API_BASE}/products/${productId}`, {
//     method: 'PUT',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(updatedData),
//   });
//   if (!response.ok) throw new Error('خطا در ویرایش محصول');
//   return await response.json();
// }