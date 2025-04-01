// API configuration
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Get client IP (improved implementation)
export const getIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    const data = await response.json();
    return data.ip || '0.0.0.0';
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '0.0.0.0'; // Fallback IP
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('Making login request to:', `${API_BASE}/admin/login`); // Debug log
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText); // Debug log
        throw new Error(errorText || 'Login failed');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('API request failed:', error); // Debug log
      throw error;
    }
  },

  logout: async (token: string) => {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  }
};

// Coupons API
export const couponsAPI = {
  getAll: async (token: string, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/admin/coupons?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch coupons');
    return await response.json();
  },

  create: async (code: string, token: string) => {
    const response = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  bulkCreate: async (codes: string[], token: string) => {
    const response = await fetch(`${API_BASE}/admin/coupons/bulk`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  updateStatus: async (id: string, isActive: boolean, token: string) => {
    const response = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(await response.text());
    return true;
  }
};

// Claims API
export const claimsAPI = {
  claim: async () => {
    const ip = await getIP();
    const response = await fetch(`${API_BASE}/claim`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Client-IP': ip 
      }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  getHistory: async (token: string, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE}/admin/claims?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  },

  getStats: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/claims/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  }
};

// Admin Settings API
export const settingsAPI = {
  update: async (settings: object, token: string) => {
    const response = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  get: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/settings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  }
};