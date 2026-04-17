import { useEffect, useState } from "react";
import "./checkout.css";
import { AddAddressModal } from "./AddAddressModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../../features/auth/address";

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (address: Address) => void;
}

const mockAddresses: Address[] = [
    {
        id: "1",
        name: "Home",
        phone: "854-3845-1989",
        address: "Dhaka, Banassree, Block B, Road 3",
    },
    {
        id: "2",
        name: "Office",
        phone: "987-6543-210",
        address: "California, USA",
    },
];

export const AddressModal = ({ isOpen, onClose, onSelect }: Props) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const dispatch = useDispatch();
    const { list: addresses, loading } = useSelector((state: any) => state.address);
    const [showAddForm, setShowAddForm] = useState(false);


    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    useEffect(() => {
        if (addresses.length > 0 && selectedIndex === null) {
            setSelectedIndex(0);
        }
    }, [addresses]);

    
    if (!isOpen) return null;

    return (
        <>
            <div className="ck-modal-overlay">
                <div className="ck-modal">

                    {/* Header */}
                    <div className="ck-modal-header">
                        <h3>Select Address</h3>
                        <button style={{ cursor: 'pointer' }} onClick={onClose}>✖</button>
                    </div>

                    {/* Add Address Button */}
                    <button className="ck-add-address-btn" onClick={() => setShowAddForm(true)}>
                        ➕ Add New Address
                    </button>

                    {/* Address List */}
                    <div className="ck-address-list">
                        {addresses.map((addr, index) => (
                            <div
                                key={index}
                                className={`ck-address-card ${selectedIndex === index ? "active" : ""}`}
                                onClick={() => setSelectedIndex(index)}
                            >
                                <input
                                    type="radio"
                                    checked={selectedIndex === index}
                                    readOnly
                                />
                                <div>
                                    <div className="ck-address-title">{addr.fullName}</div>
                                    <div>{addr.phone}</div>
                                    <div className="ck-address-text">
                                        {addr.addressLine} {addr?.landmark}
                                    </div>
                                    <div className="ck-address-text">
                                        {addr.city} {addr?.state} {addr?.pincode}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <button
                        className="ck-confirm-btn"
                        disabled={selectedIndex === null}
                        onClick={() => {
                            if (selectedIndex !== null) {
                                const selected = addresses[selectedIndex];
                                onSelect(selected);
                            }
                            onClose();
                        }}
                    >
                        Deliver Here
                    </button>
                </div>
            </div>

            <AddAddressModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSave={(newAddress) => {
                    console.log("New Address:", newAddress);
                    // 👉 later push into state / API
                }}
            />

        </>

    );
};