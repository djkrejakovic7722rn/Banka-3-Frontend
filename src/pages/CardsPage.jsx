import { useEffect, useState } from "react";
import { getUserCards, getUserAccounts } from "../services/CardService";
import CardsList from "../components/cards/CardsList";
import CreateCardForm from "../components/cards/CreateCardForm";
import Sidebar from "../components/Sidebar.jsx";
import "./CardsPage.css";


function CardsPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("list");
  const [message, setMessage] = useState("");

  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [cardsData, accountsData] = await Promise.all([
        getUserCards(),
        getUserAccounts()
      ]);

      setCards(cardsData);
      setAccounts(accountsData);
    } catch (error) {
      setMessage("Greška pri učitavanju: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardRequest = async (cardData) => {
    try {
      await requestCard(cardData);
      setMessage("Zahtev poslat. Proverite email za potvrdu.");
      setActiveTab("list");
      navigate("/cards");
      await loadData();
    } catch (error) {
      setMessage("Greška: " + error.message);
    }
  };


  const handleCardBlocked = (cardId) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, status: "Blokirana" } : card
    ));

    setMessage("Kartica blokirana");
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <div className="loading">Učitavanje...</div>;
  }

  return (
    <div className="cards-page">
      <Sidebar />
      <div className="cards-container">
        <h1>
          {activeTab === "list" ? "Moje kartice" : "Zahtev za karticu"}
        </h1>

        {message && (
          <div className="message success">{message}</div>
        )}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
            onClick={() => navigate("/cards")}
          >
            Sve kartice ({cards.length})
          </button>

          <button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Zatraži karticu
          </button>
        </div>

        {activeTab === "list" && (
          <CardsList
            cards={cards}
            accounts={accounts}
            onCardBlocked={handleCardBlocked}
          />
        )}

        {activeTab === "create" && (
          <CreateCardForm
            accounts={accounts}
            onCardCreated={handleCardCreated}
          />
        )}
      </div>
    </div>
  );
}

export default CardsPage;