import api from "./api.js";

// Normalizacija za transakcije (Backend šalje unix sekunde, JS treba milisekunde)
const normalizeTransaction = (t) => ({
  id: t.id,
  amount: t.end_amount,
  desc: t.reason || (t.type === 'payment' ? 'Plaćanje' : 'Prenos'),
  date: t.timestamp * 1000, 
  status: t.status,
  type: t.type
});

export async function getAccounts() {
  
    // Ovo ostavljamo da bismo znali kad proradi backend
    const response = await api.get("/accounts");
    return response.data;
}

export async function getAccountById(accountNumber) {
  // accountNumber ovde treba da bude "333000112345678910"
  const response = await api.get(`/accounts/${accountNumber}`);
  return response.data;
}

export async function getAccountTransactions(accountNumber) {
  try {
    // Pošto si sad Petar, moraš poslati broj računa da bi backend znao 
    // koje transakcije da filtrira, inače će ti vratiti 403 ili 404
    const response = await api.get("/transactions", { 
      params: { account_number: accountNumber } 
    });
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export async function createAccount(data) {
  // Gateway: POST /api/accounts
  const response = await api.post("/accounts", data);
  return response.data;
}