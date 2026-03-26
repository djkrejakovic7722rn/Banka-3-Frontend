// src/services/LoanService.js
import api from "./api.js";
// FIX: Dodat import koji je falio
import { getCurrentUserEmail } from "./AuthService"; 

/**
 * KLIJENT: Dohvatanje sopstvenih kredita
 */
export async function getLoans(params = {}) {
  const email = getCurrentUserEmail();
  
  try {
    const response = await api.get("/loans", { 
      params: { 
        ...params, 
        client_email: email // Šaljemo email jer Bank service to traži u req
      } 
    });
    
    // Ako stigne null ili bilo šta što nije niz, vrati prazan niz
    return Array.isArray(response.data) ? response.data : [];
    
  } catch (error) {
    // Ako backend baci 500, vraćamo prazan niz da ne puca front
    console.error("Backend Loans API Error 500 (Ignored):", error.message);
    return []; 
  }
}

/**
 * KLIJENT: Podnošenje zahteva za kredit
 */
export async function createLoanRequest(data) {
  const email = getCurrentUserEmail();
  
  const payload = {
    client_email: email,
    account_number: data.account_number, 
    loan_type: (data.loan_type || "GOTOVINSKI").toUpperCase(), // Mora biti GOTOVINSKI
    amount: parseInt(data.amount),
    repayment_period: parseInt(data.period),
    currency: data.currency || "RSD",
    purpose: data.purpose || "Kredit",
    salary: parseInt(data.salary || 50000), 
    employment_status: "full_time",
    employment_period: 24, // DODAJ OVO (npr. meseci)
    phone_number: data.phone_number || "0601234567", // DODAJ OVO
    interest_rate_type: "fixed" // DODAJ OVO (fixed ili variable)
  };

  const response = await api.post("/loan-requests", payload);
  return response.data;
}
/**
 * ADMIN: Dohvatanje svih zahteva za kredite (pending)
 */
export async function getLoanRequests(params = {}) {
  try {
    const response = await api.get("/loan-requests", { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching loan requests:", error);
    return [];
  }
}

/**
 * ADMIN: Odobravanje kredita
 */
export async function approveLoanRequest(requestId) {
  const response = await api.patch(`/loan-requests/${requestId}/approve`);
  return response.data;
}

/**
 * ADMIN: Odbijanje kredita
 */
export async function rejectLoanRequest(requestId) {
  const response = await api.patch(`/loan-requests/${requestId}/reject`);
  return response.data;
}

/**
 * Dohvatanje jednog kredita po broju
 */
export async function getLoanByNumber(loanNumber) {
  const email = getCurrentUserEmail();
  try {
    const response = await api.get(`/loans/${loanNumber}`, {
        params: { client_email: email }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching loan by number:", error.message);
    return null; // Vrati null umesto da baciš error
  }
}