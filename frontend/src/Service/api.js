import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const api = axios.create({ baseURL: apiBaseUrl });

function createProductFormData(data) {
  if (data instanceof FormData) {
    return data;
  }

  const formData = new FormData();
  ["productId", "productName", "productDescription", "category", "price", "stock"].forEach((field) => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
      formData.append(field, data[field]);
    }
  });

  Array.from(data.productImages || []).forEach((image) => {
    formData.append("productImages", image);
  });

  return formData;
}

export async function addProductAxiosFunction(data) {
  const response = await api.post("/api/products", createProductFormData(data));
  return response.data;
}

export async function getProductsAxiosFunction() {
  const response = await api.get("/api/products");
  return response.data;
}

export async function getProductAxiosFunction(id) {
  const response = await api.get(`/api/products/${encodeURIComponent(id)}`);
  return response.data;
}

export async function updateProductAxiosFunction(id, data) {
  const response = await api.put(`/api/products/${encodeURIComponent(id)}`, createProductFormData(data));
  return response.data;
}

export async function deleteProductAxiosFunction(id) {
  const response = await api.delete(`/api/products/${encodeURIComponent(id)}`);
  return response.data;
}

export async function registerUserAxiosFunction(data) {
  const response = await api.post("/api/users/register", data);
  return response.data;
}

export async function loginUserAxiosFunction(data) {
  const response = await api.post("/api/users/login", data);
  return response.data;
}

export async function createOrderAxiosFunction(data) {
  const response = await api.post("/api/orders", data);
  return response.data;
}

export async function getOrdersAxiosFunction() {
  const response = await api.get("/api/orders");
  return response.data;
}

export async function deleteOrderAxiosFunction(orderNumber) {
  const response = await api.delete(`/api/orders/${encodeURIComponent(orderNumber)}`);
  return response.data;
}

export async function saveCustomerAccountAxiosFunction(data) {
  const response = await api.put("/api/customer/account", data);
  return response.data;
}

export async function createComplaintAxiosFunction(data) {
  const response = await api.post("/api/complaints", data);
  return response.data;
}

export async function createCustomerComplaintAxiosFunction(data) {
  const response = await api.post("/api/customer/complaints", data);
  return response.data;
}

export async function getComplaintsAxiosFunction() {
  const response = await api.get("/api/complaints");
  return response.data;
}

export async function getComplaintStatusAxiosFunction(complaintId) {
  const response = await api.get(`/api/customer/complaints/${encodeURIComponent(complaintId)}`);
  return response.data;
}

export async function updateComplaintAxiosFunction(complaintId, data) {
  const response = await api.patch(`/api/complaints/${encodeURIComponent(complaintId)}`, data);
  return response.data;
}

export async function createContactMessageAxiosFunction(data) {
  const response = await api.post("/api/contact", data);
  return response.data;
}

export async function createInvestmentAxiosFunction(data) {
  const response = await api.post("/api/shareholder/investments", data);
  return response.data;
}

export async function getInvestmentsAxiosFunction() {
  const response = await api.get("/api/shareholder/investments");
  return response.data;
}

export async function updateInvestmentAxiosFunction(investmentId, data) {
  const response = await api.patch(`/api/shareholder/investments/${encodeURIComponent(investmentId)}`, data);
  return response.data;
}

export async function deleteInvestmentAxiosFunction(investmentId) {
  const response = await api.delete(`/api/shareholder/investments/${encodeURIComponent(investmentId)}`);
  return response.data;
}

export async function getDividendsAxiosFunction() {
  const response = await api.get("/api/shareholder/dividends");
  return response.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return "Cannot reach the backend. Start it on port 5000 and verify your MongoDB connection.";
  }
  return fallbackMessage;
}

export function getProductImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  return new URL(imagePath, `${apiBaseUrl}/`).toString();
}
