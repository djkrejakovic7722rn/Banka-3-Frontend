export const MAX_ACCOUNT_NUMBER_LENGTH = 20;

export function stringifyAccountNumber(value) {
  if (value == null) return "";
  return String(value);
}

export function normalizeAccountNumberInput(value) {
  return stringifyAccountNumber(value)
    .replace(/\D/g, "")
    .slice(0, MAX_ACCOUNT_NUMBER_LENGTH);
}

export function isValidAccountNumber(value) {
<<<<<<< HEAD
  const normalized = normalizeAccountNumberInput(value);
  return normalized.length > 0 && normalized.length <= MAX_ACCOUNT_NUMBER_LENGTH;
=======
    const normalized = normalizeAccountNumberInput(value);
    return normalized.length === 18;
>>>>>>> 8d840c6 (fix: payment validation + totp handling)
}
