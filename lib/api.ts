const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) => 
      fetcher('/api/auth/login', { 
        method: 'POST', 
        body: JSON.stringify({ email, password }) 
      }),
    register: (data: any) => 
      fetcher('/api/auth/register', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    me: () => fetcher('/api/auth/me'),
    logout: () => fetcher('/api/auth/logout', { method: 'POST' })
  },
  appointments: {
    create: (data: any) => 
      fetcher('/api/appointments', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    getAll: () => fetcher('/api/appointments'),
    getDoctors: () => fetcher('/api/doctors'),
    approve: (id: string) => 
      fetcher(`/api/appointments/approve/${id}`, { method: 'PUT' }),
    reject: (id: string) => 
      fetcher(`/api/appointments/reject/${id}`, { method: 'PUT' })
  },
  notifications: {
    get: (role: string) => fetcher(`/api/notifications?role=${role}`),
    sync: () => fetcher('/api/sync')
  }
};

