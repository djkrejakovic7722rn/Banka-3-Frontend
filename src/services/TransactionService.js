import api from "./api.js";

/**
 * Transfer funds to another client's account.
 * @param {Object} data
 * @param {string} data.sender_account
 * @param {string} data.recipient_account
 * @param {string} data.recipient_name
 * @param {number} data.amount
 * @param {string} data.payment_code
 * @param {string} data.reference_number
 * @param {string} data.purpose
 */
export async function transferFunds(data) {
    // Gateway: POST /api/transactions/payments ili /transfers
    // Na osnovu tvog gateway koda, trenutno su Not Implemented, 
    // ali evo kako treba da izgleda poziv:
    return api.post("/transactions/payments", data);
}
