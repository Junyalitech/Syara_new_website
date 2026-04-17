import { useEffect, useState } from "react";
import "../Checkout/checkout.css";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentMethod } from "../../features/payment/paymentSlice";
// import { saveCard } from "../../features/payment/paymentSlice"; // better to create separate slice

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: any) => void;
    initialData?: any; // ✅ ADD THIS
}

export const AddPaymentMethodModal = ({ isOpen,
    onClose,
    onSave,
    initialData }: Props) => {
    const onlyNumbers = (value) => value.replace(/\D/g, "");

    const formatCardNumber = (value) => {
        return onlyNumbers(value).slice(0, 16);
    };

    const formatExpiry = (value) => {
        const cleaned = onlyNumbers(value).slice(0, 4);

        if (cleaned.length <= 2) return cleaned;
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    };

    const isValidExpiry = (expiry) => {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

        const [month, year] = expiry.split("/").map(Number);
        return month >= 1 && month <= 12;
    };

    const [errors, setErrors] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
    });


    const dispatch = useDispatch();
    const { adding } = useSelector((state: any) => state.payment);

    const userId = localStorage.getItem("syaraid");

    const [form, setForm] = useState({
        cardHolder: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        cardType: "Visa",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                cardHolder: initialData.holder || "",
                cardNumber: initialData.last4 ? "**** **** **** " + initialData.last4 : "",
                expiry: initialData.expiry || "",
                cvv: "",
                cardType: initialData.type || "Visa",
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (!isOpen) {
            setForm({
                cardHolder: "",
                cardNumber: "",
                expiry: "",
                cvv: "",
                cardType: "Visa",
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        let { name, value } = e.target;

        // 🔥 Apply field-specific validation
        if (name === "cardNumber") {
            value = formatCardNumber(value);
        }

        if (name === "cvv") {
            value = onlyNumbers(value).slice(0, 3);
        }

        if (name === "expiry") {
            value = formatExpiry(value);
        }

        if (name === "cardHolder") {
            // ❌ block numbers
            value = value.replace(/[0-9]/g, "");
        }

        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {
            cardHolder: "",
            cardNumber: "",
            expiry: "",
            cvv: "",
        };

        if (!form.cardHolder.trim()) {
            newErrors.cardHolder = "Card holder name required";
        }

        if (form.cardNumber.length !== 16) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }

        if (!isValidExpiry(form.expiry)) {
            newErrors.expiry = "Invalid expiry date";
        }

        if (form.cvv.length !== 3) {
            newErrors.cvv = "CVV must be 3 digits";
        }

        setErrors(newErrors);
        console.log("Validation Errors:", newErrors); // Debug log
        return Object.values(newErrors).every((val) => val === "");
    };



    console.log(form)
    return (
        <div className="ck-modal-overlay">
            <div className="ck-modal large">

                {/* Header */}
                <div className="ck-modal-header">
                    <h3>
                        {initialData ? "Edit Payment Method" : "Add Payment Method"}
                    </h3>
                    <button style={{ cursor: "pointer" }} onClick={onClose}>✖</button>
                </div>

                {/* Form */}
                <div className="ck-form-grid">

                    <input
                        name="cardHolder"
                        placeholder="Card Holder Name *"
                        onChange={(e) => handleChange(e)}
                        value={form.cardHolder}
                    />
                    {errors.cardHolder && <p className="error">{errors.cardHolder}</p>}


                    <input
                        name="cardNumber"
                        placeholder="Card Number *"
                        maxLength={16}
                        value={form.cardNumber}
                        onChange={(e) => handleChange(e)}
                    />
                    {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

                    <input
                        name="expiry"

                        value={form.expiry}
                        placeholder="Expiry (MM/YY) *"
                        onChange={(e) => handleChange(e)}
                    />
                    {errors.expiry && <p className="error">{errors.expiry}</p>}

                    <input
                        name="cvv"
                        placeholder="CVV *"
                        maxLength={3}
                        type="password"

                        value={form.cvv}
                        onChange={(e) => handleChange(e)}
                    />
                    {errors.cvv && <p className="error">{errors.cvv}</p>}


                    {/* Card Type */}
                    <select name="cardType" onChange={(e) => handleChange(e)}>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="RuPay">RuPay</option>
                    </select>

                </div>

                {/* Footer */}
                <button
                    style={{ marginTop: 12 }}
                    className="ck-confirm-btn"
                    disabled={adding}
                    onClick={() => {

                        if (!validateForm()) return;

                        onSave(form);
                        onClose();

                    }}
                >
                    {adding
                        ? "Saving..."
                        : initialData
                            ? "Update Card"
                            : "Save Card"}
                </button>
            </div>
        </div>
    );
};