export const getAccountDetails = async () => {
  // simulacija API poziva
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        companyName: "Tech Solutions DOO",
        pib: "109876543",
        address: "Beograd, Srbija",
        balance: 1250000,
        ownerName: "Luka Trajkovic",
        ownerEmail: "luka@mail.com",
        transactions: [
          {
            date: "2026-03-10",
            description: "Uplata klijenta",
            amount: 500000
          },
          {
            date: "2026-03-11",
            description: "Plata zaposlenima",
            amount: -200000
          },
          {
            date: "2026-03-12",
            description: "Kupovina opreme",
            amount: -150000
          },
          {
            date: "2026-03-13",
            description: "Uplata klijenta",
            amount: 300000
          }
        ]
      });
    }, 800); // fake loading delay
  });
};