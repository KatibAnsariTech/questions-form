import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
  }
  return config;
});

// Transform MongoDB _id to id
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = transformResponse(response.data);
  }
  return response;
});

// Helper to transform _id to id
const transformResponse = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(transformResponse);
  }
  if (data && typeof data === 'object' && data._id) {
    const { _id, ...rest } = data;
    return { id: _id, ...rest, ...transformResponse(rest) };
  }
  if (data && typeof data === 'object') {
    const transformed: any = {};
    for (const key in data) {
      transformed[key] = transformResponse(data[key]);
    }
    return transformed;
  }
  return data;
};




/* =====================
   AUTH
===================== */

export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};




/* =====================
   FORMS
===================== */

export const createForm = async (formData: any) => {
  // Remove id if exists (backend generates _id)
  const { id, ...data } = formData;
  const res = await api.post("/api/form/form", data);
  return res.data;
};

export const getFormsByUser = async (userId: string) => {
  const res = await api.get(`/api/form/forms/user/${userId}`);
  return res.data;
};

export const getFormById = async (formId: string) => {
  const res = await api.get(`/api/form/${formId}`);
  return res.data;
};

export const updateForm = async (formId: string, formData: any) => {
  // Remove id from payload (backend uses _id)
  const { id, createdAt, updatedAt, __v, ...data } = formData;
  const res = await api.put(`/api/form/${formId}`, data);
  return res.data;
};

export const deleteForm = async (formId: string) => {
  const res = await api.delete(`/api/form/${formId}`);
  return res.data;
};



/* =====================
   RESPONSES
===================== */

export const submitResponse = async (responseData: any) => {
  const res = await api.post("/api/response/response", responseData);
  return res.data;
};

export const getResponsesByForm = async (formId: string) => {
  const res = await api.get(`/api/response/form/${formId}`);
  return res.data;
};
