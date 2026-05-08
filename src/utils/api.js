// API configuration for different environments
const API_CONFIG = {
  development: 'http://localhost:5000',
  production: import.meta.env.VITE_API_URL || 'https://learnoviax-backend.onrender.com'
};

// Force production URL when not on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = isLocalhost 
  ? API_CONFIG.development
  : (import.meta.env.VITE_API_URL || 'https://learnoviax-backend.onrender.com');

// Helper function for making API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Attach Supabase access token if available (frontend integration)
  try {
    const sessionJson = localStorage.getItem('supabase_session');
    if (sessionJson) {
      const session = JSON.parse(sessionJson);
      if (session?.access_token) {
        defaultOptions.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;