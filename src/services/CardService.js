// src/services/CardService.js
import api from "./api.js";

// 1. Dobijanje svih kartica ulogovanog korisnika
export async function getUserCards() {
  const response = await api.get("/cards");
  // Mapiramo podatke jer tvoj kod u CardItem.jsx koristi ove nazive
  return (response.data || []).map(card => ({
    id: card.card_id,
    cardNumber: card.card_number,
    cardType: card.card_type,
    cardName: card.card_brand,
    status: card.status === "active" ? "Aktivna" : "Blokirana",
    expiryDate: card.expiration_date,
    cvv: card.cvv,
    accountNumber: card.account_number,
    limit: card.limit || 0
  }));
}

// 2. Dobijanje računa korisnika (OVO JE FALILO)
// CreateCardForm koristi ovo da popuni dropdown listu računa
export async function getUserAccounts() {
  const response = await api.get("/accounts");
  return (response.data || []).map(acc => ({
    id: acc.id,
    accountNumber: acc.number,
    accountName: acc.name,
    currency: acc.currency,
    balance: acc.balance,
    type: acc.owner_type, // 'personal' ili 'business'
    cardCount: 0 // Backend obično ne šalje ovo, ostavljamo nulu ili dopuni ako imaš polje
  }));
}

// 3. Prvi korak: Slanje zahteva za novu karticu
export async function requestCard(cardData) {
  // Šaljemo podatke kako ih backend očekuje: account_number, card_type, card_brand
  const response = await api.post("/cards/request", {
    account_number: cardData.accountNumber,
    card_type: cardData.cardType || "Debit",
    card_brand: "Visa" // Možeš staviti fiksno ili proslediti iz forme
  });
  return response.data;
}

// 4. Drugi korak: Potvrda koda/tokena (OVO JE TAKOĐE FALILO)
export async function verifyCardRequest(data) {
  // Prema tvom gateway-u, potvrda ide preko GET /api/cards/confirm?token=...
  const response = await api.get("/cards/confirm", {
    params: { token: data.verificationCode }
  });
  return {
    ...response.data,
    message: "Kartica je uspešno kreirana!"
  };
}

// 5. Blokiranje kartice
export async function blockCard(cardNumber) {
  // Backend obično traži ID, ali pošto u tabeli imamo broj, koristimo ID ako ga imamo
  // Proveri da li tvoj gateway koristi ID ili broj kartice u URL-u
  return api.patch(`/cards/${cardNumber}/block`);
}

// Pomoćna funkcija za formatiranje broja kartice na ekranu
export function formatCardNumber(num) {
  if (!num) return "**** **** **** ****";
  return num.replace(/\d{4}(?=.)/g, '$& ');
}