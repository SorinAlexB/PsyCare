// API helper functions for backend communication
// These will connect to your Python backend via nginx

const API_BASE_URL = '/api'; // Nginx will proxy this to your Python backend

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ConsultationRequest {
  query: string;
}

export interface ConsultationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  pdfUrl?: string;
  response?: string;
}

// Auth API calls
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: { id: string; email: string; name: string } }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (credentials: RegisterCredentials): Promise<{ token: string; user: { id: string; email: string; name: string } }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    localStorage.removeItem('authToken');
  },

  getProfile: async (): Promise<{ id: string; email: string; name: string }> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  },
};

// Consultation API calls
export const consultationApi = {
  submit: async (request: ConsultationRequest): Promise<ConsultationResponse> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to submit consultation');
    return response.json();
  },

  getStatus: async (id: string): Promise<ConsultationResponse> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get consultation status');
    return response.json();
  },

  getHistory: async (): Promise<ConsultationResponse[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get consultation history');
    return response.json();
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/consultations/${id}/pdf`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to download PDF');
    return response.blob();
  },
};
