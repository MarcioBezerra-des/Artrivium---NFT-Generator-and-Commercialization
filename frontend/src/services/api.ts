import axios from 'axios';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erro de autenticação
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Serviços de NFT
export const nftService = {
  getAllNfts: async (params = {}) => {
    const response = await api.get('/nfts', { params });
    return response.data;
  },
  
  getNftById: async (id: string) => {
    const response = await api.get(`/nfts/${id}`);
    return response.data;
  },
  
  createNft: async (nftData: any) => {
    const response = await api.post('/nfts', nftData);
    return response.data;
  },
  
  updateNft: async (id: string, nftData: any) => {
    const response = await api.put(`/nfts/${id}`, nftData);
    return response.data;
  },
  
  toggleForSale: async (id: string, forSale: boolean, price?: number) => {
    const response = await api.put(`/nfts/${id}/toggle-sale`, { forSale, price });
    return response.data;
  },
  
  purchaseNft: async (id: string, sellerId: string) => {
    const response = await api.post(`/nfts/${id}/purchase`, { sellerId });
    return response.data;
  }
};

// Serviços de usuário
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  }
};

export default api;