import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});




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
  // ✅ POST (not GET)
  const res = await api.post("/api/auth/login", data);
  return res.data;
};






/* =====================
   FORMS
===================== */

export const createForm = async (formData: any) => {
  const res = await api.post("/api/form/form", formData);
  return res.data;
};

export const getFormsByUser = async (userId: string) => {
  const res = await api.get(`/api/form/forms/user/${userId}`);
  return res.data;
};



/* =====================
   RESPONSES
===================== */

export const submitResponse = async (responseData: any) => {
  const res = await api.post("/api/response/response", responseData);
  return res.data;
};
