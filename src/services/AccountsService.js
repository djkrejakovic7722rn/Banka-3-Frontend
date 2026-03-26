import api from "./api.js";

// Mock data jer GET /accounts ne postoji na backend-u
const mockAccounts = [
    {
        account_number: "14159265358979323846",
        account_name: "Arthur Dent",
        owner_id: 1,
        balance: 137,
        currency: "EUR",
        account_type: "checking",
        status: "active",
        daily_limit: 2718,
        monthly_limit: 100000
    }
];

export async function getAccounts() {
  // GET /accounts ne postoji, vraćam mock
  return mockAccounts;
}

export async function getAccountByNumber(accountNumber) {
  // GET /accounts/{id} ne postoji, pretražujem mock
  return mockAccounts.find(a => a.account_number === accountNumber) || null;
}
