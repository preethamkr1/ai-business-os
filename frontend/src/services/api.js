const API_BASE = 'http://localhost:8000'; // Assuming standard FastAPI local port

const getHeaders = () => {
  const token = sessionStorage.getItem('token');
  const tenant_id = sessionStorage.getItem('tenant_id');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (tenant_id) headers['X-Tenant-ID'] = tenant_id;
  return headers;
};

export const api = {
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  postFormData: async (endpoint, formData) => {
    const token = sessionStorage.getItem('token');
    const tenant_id = sessionStorage.getItem('tenant_id');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (tenant_id) headers['X-Tenant-ID'] = tenant_id;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};
