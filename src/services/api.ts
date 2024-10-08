import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005/api';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chatToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const createChat = async (duration: string) => {
  try {
    // Get a temporary token first
    const tempTokenResponse = await api.post('/temp-token');
    const tempToken = tempTokenResponse.data.token;

    // Use the temporary token to create a chat
    const response = await api.post('/chats', { duration }, {
      headers: {
        'x-auth-token': tempToken
      }
    });
    
    localStorage.setItem('chatToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const getChat = async (id: string) => {
  try {
    console.log(`Fetching chat with id: ${id}`);
    const response = await api.get(`/chats/${id}`);
    console.log('Chat fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting chat:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
    throw error;
  }
};

export default api;
