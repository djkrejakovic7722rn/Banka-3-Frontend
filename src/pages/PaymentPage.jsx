import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccounts } from "../services/AccountService";
import { transferFunds } from "../services/TransactionService";
import { getRecipients, createRecipient } from "../services/PaymentService"; // Dodat createRecipient 
import TotpModal from "../components/TotpModal";
import Sidebar from "../components/Sidebar";
import "./PaymentPage.css";

const EMPTY_FORM = {
    sender_account: "",
    recipient_account: "",
    recipient_name: "",
    amount: "",
    payment_code: "",
    reference_number: "",
    purpose: "",
};

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false); // Za dugme "Sačuvaj primaoca"
    const [successMsg, setSuccessMsg] = useState("");
    const [showTotp, setShowTotp] = useState(false);

    const [accounts, setAccounts] = useState([]);
    const [recipients, setRecipients] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const accsResponse = await getAccounts();
                const recsResponse = await getRecipients();
                setAccounts(Array.isArray(accsResponse) ? accsResponse : []);
                setRecipients(Array.isArray(recsResponse) ? recsResponse : []);

                // Stavka 3: Provera da li smo došli sa RecipientsPage sa podacima 
                if (location.state?.recipient) {
                    const r = location.state.recipient;
                    setForm(prev => ({
                        ...prev,
                        recipient_account: r.account_number,
                        recipient_name: r.name
                    }));
                }
            } catch (e) {
                console.error("Greška pri učitavanju:", e);
            }
        }
        fetchData();
    }, [location.state]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Stavka 2: Automatsko popunjavanje pri izboru iz padajućeg menija
    function handleRecipientSelect(e) {
        const accountNumber = e.target.value;
        if (!accountNumber) return;

        const selected = recipients.find(r => r.account_number === accountNumber);
        if (selected) {
            setForm(prev => ({
                ...prev,
                recipient_account: selected.account_number,
                recipient_name: selected.name
            }));
        }
    }

    // Stavka 1: Čuvanje primaoca direktno sa forme 
    async function handleSaveRecipient() {
        if (!form.recipient_name || !form.recipient_account) {
            alert("Popunite naziv i račun primaoca pre čuvanja.");
            return;
        }

        setSaveLoading(true);
        try {
            await createRecipient({
                name: form.recipient_name,
                account_number: form.recipient_account
            });
            // Osveži listu primalaca u padajućem meniju
            const updatedRecs = await getRecipients();
            setRecipients(Array.isArray(updatedRecs) ? updatedRecs : []);
            alert("Primalac uspešno sačuvan!");
        } catch (err) {
            alert("Greška pri čuvanju primaoca.");
        } finally {
            setSaveLoading(false);
        }
    }

    // Ostatak handleSubmit i handleTotpConfirm ostaje isti [cite: 1726, 1727]
    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setShowTotp(true);
    }

    function validate() {
        const errs = {};
        if (!form.sender_account) errs.sender_account = "Izaberite vaš račun.";
        if (!form.recipient_account) errs.recipient_account = "Unesite račun primaoca.";
        if (!form.recipient_name) errs.recipient_name = "Unesite naziv primaoca.";
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = "Unesite ispravan iznos.";
        if (!form.payment_code) errs.payment_code = "Unesite šifru plaćanja.";
        if (!form.purpose) errs.purpose = "Unesite svrhu.";
        return errs;
    }

    async function handleTotpConfirm(totpCode) {
        setSubmitting(true);
        try {
            await transferFunds({ ...form, amount: Number(form.amount) }, totpCode);
            setShowTotp(false);
            setSuccessMsg("Plaćanje je uspešno izvršeno!");
            setForm(EMPTY_FORM);
        } catch (err) {
            alert(err.response?.data?.message || "Greška pri plaćanju.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="pay-shell">
            <Sidebar />
            <div className="pay-content">
                <div className="pay-header">
                    <button className="pay-back-btn" onClick={() => navigate(-1)}>&larr;</button>
                    <div>
                        <p className="pay-subtitle">Novo plaćanje</p>
                        <h1 className="pay-title">Prenos sredstava</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="pay-section">
                        <label className="pay-section-label">Pošiljalac (Vaš račun)</label>
                        <select
                            className={`pay-input ${errors.sender_account ? "pay-input--error" : ""}`}
                            name="sender_account"
                            value={form.sender_account}
                            onChange={handleChange}
                        >
                            <option value="">Izaberite račun sa kog šaljete</option>
                            {accounts.map(acc => (
                                <option key={acc.account_number} value={acc.account_number}>
                                    {acc.account_number} - {acc.balance} RSD
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pay-section">
                        <label className="pay-section-label">Primalac</label>
                        
                        {/* Stavka 2: Padajući meni za brzi izbor */}
                        <select className="pay-input" onChange={handleRecipientSelect} style={{marginBottom: "10px"}}>
                            <option value="">-- Izaberi iz imenika (opciono) --</option>
                            {recipients.map(rec => (
                                <option key={rec.id} value={rec.account_number}>{rec.name}</option>
                            ))}
                        </select>

                        <div className="pay-field">
                            <input
                                className={`pay-input ${errors.recipient_name ? "pay-input--error" : ""}`}
                                name="recipient_name"
                                value={form.recipient_name}
                                onChange={handleChange}
                                placeholder="Naziv primaoca"
                            />
                        </div>
                        <div className="pay-field">
                            <input
                                className={`pay-input ${errors.recipient_account ? "pay-input--error" : ""}`}
                                name="recipient_account"
                                value={form.recipient_account}
                                onChange={handleChange}
                                placeholder="Račun primaoca"
                            />
                        </div>

                        {/* Stavka 1: Dugme za čuvanje */}
                        <button 
                            type="button" 
                            className="rp-secondary-btn" 
                            onClick={handleSaveRecipient}
                            disabled={saveLoading}
                            style={{width: "100%", marginTop: "5px"}}
                        >
                            {saveLoading ? "Čuvanje..." : "Sačuvaj primaoca u imenik"}
                        </button>
                    </div>

                    {/* Ostatak forme: Iznos, Sifra, Svrha... [cite: 1740, 1742, 1744] */}
                    <div className="pay-section">
                        <input className="pay-input" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Iznos (RSD)"/>
                        <div className="pay-field-row">
                            <input className="pay-input" name="payment_code" value={form.payment_code} onChange={handleChange} placeholder="Šifra"/>
                            <input className="pay-input" name="purpose" value={form.purpose} onChange={handleChange} placeholder="Svrha"/>
                        </div>
                    </div>

                    <div className="pay-actions">
                        <button type="button" className="pay-btn-back" onClick={() => navigate(-1)}>Otkaži</button>
                        <button type="submit" className="pay-btn-submit" disabled={submitting}>Potvrdi</button>
                    </div>
                </form>
                {successMsg && <p className="pay-success">{successMsg}</p>}
            </div>

            {showTotp && <TotpModal onConfirm={handleTotpConfirm} onCancel={() => setShowTotp(false)} loading={submitting} />}
        </div>
    );
}