import api from "./api.js";

export async function getRecipients() {
  const response = await api.get("/recipients");
  return response.data;
}

export async function getTransactions(filters = {}) {
  const response = await api.get("/transactions", { params: filters });
  return response.data.getTransactions || [];
}

export async function createRecipient(recipientData) {
  const response = await api.post("/recipients", recipientData);
  return response.data;
}

export async function updateRecipient(id, recipientData) {
  const response = await api.put(`/recipients/${id}`, recipientData);
  return response.data;
}

export async function deleteRecipient(id) {
  const response = await api.delete(`/recipients/${id}`);
  return response.data;
}

export async function createPayment(paymentData) {
  // Backend: POST /transactions/payments (sa s na kraju)
  const response = await api.post("/transactions/payments", paymentData);
  return response.data;
}

export async function createTransfer(transferData) {
  // Backend: POST /transactions/transfers (sa s na kraju)
  const response = await api.post("/transactions/transfers", transferData);
  return response.data;
}
