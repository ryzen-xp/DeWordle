import axios from 'axios';
/* import { getSession } from 'next-auth/react'; */

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
let accessToken;
let refreshToken;
export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
};

// Request interceptor to attach the access token
API.interceptors.request.use(
  (config) => {
    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response, // Pass through valid responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post('/auth/refresh-token', {
          refreshToken, // Include the refresh token in the payload
        });
        // Request a new access token using the refresh token
        accessToken = data.body.access_token;

        // Update tokens
        setTokens(accessToken, refreshToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Handle failed refresh (e.g., redirect to login)
        console.error('Failed to refresh token', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);
export default API;
