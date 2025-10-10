// src/config/api.ts

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? '/api' 
  : 'https://Roy256.pythonanywhere.com/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login/`,
  LOGOUT: `${API_BASE_URL}/auth/logout/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/token/refresh/`,
  
  // Books
  BOOKS: `${API_BASE_URL}/books/`,
  BOOKS_AVAILABLE: `${API_BASE_URL}/books/available/`,
  BOOK_DETAIL: (id: number) => `${API_BASE_URL}/books/${id}/`,
  
  // Members
  MEMBERS: `${API_BASE_URL}/members/`,
  MEMBER_DETAIL: (id: number) => `${API_BASE_URL}/members/${id}/`,
  MEMBER_ME: `${API_BASE_URL}/members/me/`,
  MEMBER_MY_LOANS: `${API_BASE_URL}/members/my_loans/`,
  
  // Librarians
  LIBRARIANS: `${API_BASE_URL}/librarians/`,
  LIBRARIAN_DETAIL: (id: number) => `${API_BASE_URL}/librarians/${id}/`,
  
  // Loans
  LOANS: `${API_BASE_URL}/loans/`,
  LOANS_ACTIVE: `${API_BASE_URL}/loans/active/`,
  LOANS_OVERDUE: `${API_BASE_URL}/loans/overdue/`,
  LOAN_DETAIL: (id: number) => `${API_BASE_URL}/loans/${id}/`,
  LOAN_BORROW: `${API_BASE_URL}/loans/borrow/`,
  LOAN_RETURN: (id: number) => `${API_BASE_URL}/loans/${id}/return_book/`,
  
  // Authors
  AUTHORS: `${API_BASE_URL}/authors/`,
  AUTHOR_DETAIL: (id: number) => `${API_BASE_URL}/authors/${id}/`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function for API calls with error handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};