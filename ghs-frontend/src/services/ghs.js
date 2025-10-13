import api from './api';

// Mock mode: when auth is disabled, avoid backend calls and serve in-memory data
const DISABLE_AUTH = import.meta?.env?.VITE_DISABLE_AUTH === 'true';
const __ms = () => new Date().toISOString();

// Minimal datasets (only used when DISABLE_AUTH)
let __mockServices = [
  { id: 1, name: 'Informatique' },
  { id: 2, name: 'Ressources Humaines' },
  { id: 3, name: 'Finance' },
];
let __mockEmployees = [
  { id: 1, employeeID: 1, first_name: 'Alice', last_name: 'Dupont', firstName: 'Alice', lastName: 'Dupont', position: 'Développeuse', service_id: 1 },
  { id: 2, employeeID: 2, first_name: 'Bob', last_name: 'Martin', firstName: 'Bob', lastName: 'Martin', position: 'RH', service_id: 2 },
  { id: 3, employeeID: 3, first_name: 'Chloé', last_name: 'Durand', firstName: 'Chloé', lastName: 'Durand', position: 'Comptable', service_id: 3 },
];
let __mockAccounts = [
  { accountID: 11, employeeID: 1, username: 'alice', profile: 'Coordinator', isActive: true, createdAt: __ms(), lastLogin: __ms() },
  { accountID: 12, employeeID: 2, username: 'bob', profile: 'Supervisor', isActive: true, createdAt: __ms(), lastLogin: __ms() },
];
let __mockRequests = [
  { id: 101, employee_id: 1, employeeID: 1, date: __ms(), requestDate: __ms().slice(0,10), startAt: '18:00', endAt: '20:00', hours: 2, reason: 'Clôture sprint', status: 'Pending' },
  { id: 102, employee_id: 2, employeeID: 2, date: __ms(), requestDate: __ms().slice(0,10), startAt: '19:00', endAt: '21:30', hours: 2.5, reason: 'Recrutement urgent', status: 'Approved' },
];

// Services
export const serviceService = {
  async getAll() {
    if (DISABLE_AUTH) return [...__mockServices];
    const response = await api.get('/services');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/services', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
  // Aliases expected by hooks
  async getServices(skip, limit) {
    // Pagination not supported by API spec here; ignoring skip/limit
    return this.getAll();
  },
  async getService(id) {
    return this.getById(id);
  },
  async createService(data) {
    return this.create(data);
  },
  async updateService(id, data) {
    return this.update(id, data);
  },
  async deleteService(id) {
    return this.delete(id);
  },
};

// Employés
export const employeeService = {
  async getAll() {
    if (DISABLE_AUTH) return [...__mockEmployees];
    const response = await api.get('/employees');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/employees', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
  // Aliases expected by hooks
  async getEmployees(skip, limit) {
    // Pagination not supported here; ignoring skip/limit
    return this.getAll();
  },
  async getEmployee(id) {
    return this.getById(id);
  },
  async createEmployee(data) {
    return this.create(data);
  },
  async updateEmployee(id, data) {
    return this.update(id, data);
  },
  async deleteEmployee(id) {
    return this.delete(id);
  },
};

// Comptes
export const accountService = {
  async getAll() {
    if (DISABLE_AUTH) return [...__mockAccounts];
    const response = await api.get('/accounts');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  async create(data) {
    if (DISABLE_AUTH) {
      const next = Math.max(0, ...__mockAccounts.map(a => a.accountID)) + 1;
      const item = { accountID: next, isActive: true, createdAt: __ms(), ...data };
      __mockAccounts.push(item);
      return item;
    }
    const response = await api.post('/accounts', data);
    return response.data;
  },
  // Aliases expected by hooks
  async getAccounts(skip, limit) {
    // Pagination not supported here; ignoring skip/limit
    return this.getAll();
  },
  async getAccount(id) {
    return this.getById(id);
  },
  async createAccount(data) {
    return this.create(data);
  },
};

// Demandes
export const requestService = {
  async getAll() {
    if (DISABLE_AUTH) return [...__mockRequests];
    const response = await api.get('/requests');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  async create(data) {
    if (DISABLE_AUTH) {
      const next = Math.max(0, ...__mockRequests.map(r => r.id)) + 1;
      const item = { id: next, status: 'Pending', date: __ms(), hours: data?.hours || 2, employee_id: data?.employeeID, ...data };
      __mockRequests.push(item);
      return item;
    }
    const response = await api.post('/requests', data);
    return response.data;
  },

  async update(id, data) {
    if (DISABLE_AUTH) {
      const idx = __mockRequests.findIndex(r => r.id === Number(id));
      if (idx > -1) { __mockRequests[idx] = { ...__mockRequests[idx], ...data }; return __mockRequests[idx]; }
      return null;
    }
    const response = await api.put(`/requests/${id}`, data);
    return response.data;
  },

  async delete(id) {
    if (DISABLE_AUTH) {
      __mockRequests = __mockRequests.filter(r => r.id !== Number(id));
      return { success: true };
    }
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },
  // Extended endpoints used by hooks
  async getRequests(skip, limit) {
    // Pagination not implemented; return all
    return this.getAll();
  },
  async getMyRequests() {
    const response = await api.get('/requests/me');
    return response.data;
  },
  async getPendingRequests() {
    const response = await api.get('/requests/pending');
    return response.data;
  },
  async getRequest(id) {
    return this.getById(id);
  },
  async createRequest(data) {
    return this.create(data);
  },
  async updateRequest(id, data) {
    return this.update(id, data);
  },
  async deleteRequest(id) {
    return this.delete(id);
  },
  async approveRequest(id, level) {
    const response = await api.post(`/requests/${id}/approve`, { level });
    return response.data;
  },
  async rejectRequest({ id, reason }) {
    const response = await api.post(`/requests/${id}/reject`, { reason });
    return response.data;
  },
};

// Délégations
export const delegationService = {
  async getAll() {
    const response = await api.get('/delegations');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/delegations', data);
    return response.data;
  },
};

// Workflows
export const workflowService = {
  async getAll() {
    const response = await api.get('/workflows');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/workflows', data);
    return response.data;
  },
};