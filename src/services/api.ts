import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
export const SOCKET_URL = API_BASE_URL.replace('/api', '');

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
        console.log('Attempting to get temp token');
        const tempTokenResponse = await api.post('/temp-token');
        console.log('Temp token response:', tempTokenResponse);

        const tempToken = tempTokenResponse.data.token;

        console.log('Attempting to create chat');
        const response = await api.post('/chats', { duration }, {
            headers: {
                'x-auth-token': tempToken
            }
        });
        console.log('Chat creation response:', response);

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
