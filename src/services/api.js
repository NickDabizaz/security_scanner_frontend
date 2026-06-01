const API_BASE_URL = 'http://localhost:5050/api';

/**
 * Custom API request client with Bearer Authorization interceptors
 */
export const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('grfyn_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // Auto handle authorization expirations
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('grfyn_token');
      localStorage.removeItem('grfyn_user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      // Extract clean message from HTML if possible
      const cleanText = textResponse.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      throw new Error(cleanText.substring(0, 150) || `Server returned HTML/text response with status ${response.status}`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with the request.');
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const authService = {
  register: (username, email, password) => {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
  login: (username, password) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  getCurrentUser: () => {
    return makeRequest('/auth/me', { method: 'GET' });
  },
};

export const scanService = {
  getRuleCatalog: () => {
    return makeRequest('/scans/rules', { method: 'GET' });
  },
  createLocalScan: (file, authorizationConfirmed, selectedRules = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('authorizationConfirmed', String(authorizationConfirmed));
    if (Array.isArray(selectedRules) && selectedRules.length > 0) {
      formData.append('selectedRules', JSON.stringify(selectedRules));
    }

    // For file uploads, we delete the Content-Type header so the browser sets it automatically with the boundary parameters
    const token = localStorage.getItem('grfyn_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/scans/local`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    });
  },
  createUrlScan: (url, authorizationConfirmed) => {
    return makeRequest('/scans/url', {
      method: 'POST',
      body: JSON.stringify({ url, authorizationConfirmed }),
    });
  },
  createGithubScan: (repoUrl, branch, authorizationConfirmed, selectedRules = null) => {
    return makeRequest('/scans/github', {
      method: 'POST',
      body: JSON.stringify({ repoUrl, branch, authorizationConfirmed, selectedRules }),
    });
  },
  getHistory: () => {
    return makeRequest('/scans', { method: 'GET' });
  },
  getDetail: (id) => {
    return makeRequest(`/scans/${id}`, { method: 'GET' });
  },
  deleteScan: (id) => {
    return makeRequest(`/scans/${id}`, { method: 'DELETE' });
  },
  cancelScan: (id) => {
    return makeRequest(`/scans/${id}/cancel`, { method: 'POST' });
  },
  rescan: (id) => {
    return makeRequest(`/scans/${id}/rescan`, { method: 'POST' });
  },
};
