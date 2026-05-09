import { useState } from "react";
import "./checkout.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, updateAddress } from "../../features/auth/address";
import toast from "react-hot-toast";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: any) => void;
}

export const AddAddressModal = ({ isOpen, onClose, onSave }: Props) => {
  const [pincodeStatus, setPincodeStatus] = useState({
    verified: false,
    loading: false,
    message: "",
  });

  const onlyNumbers = (val) => val.replace(/\D/g, "");

  const onlyText = (val) => val.replace(/[^a-zA-Z\s]/g, "");

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const isValidPincode = (pin) => /^\d{6}$/.test(pin);
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: "",
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.address);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: "",
    landmark: "",
    addressType: "Home",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = onlyNumbers(value).slice(0, 10);
    }

    if (name === "pincode") {
      value = onlyNumbers(value).slice(0, 6);

      // 🔥 reset verification on change
      setPincodeStatus({
        verified: false,
        loading: false,
        message: "",
      });
    }

    if (name === "fullName") {
      value = onlyText(value);
    }

    if (name === "city" || name === "state") {
      value = onlyText(value);
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      addressLine: "",
    };

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!isValidPhone(form.phone)) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }

    if (!isValidPincode(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => val === "");
  };

  const verifyPincodeAPI = async () => {
    if (!isValidPincode(form.pincode)) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Enter valid 6-digit pincode",
      }));
      return;
    }

    try {

      setPincodeStatus({ verified: false, loading: true, message: "" });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-pincode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pincode: form.pincode }),
      });

      const data = await res.json();

      // if (data.valid) {
      //   setPincodeStatus({
      //     verified: true,
      //     loading: false,
      //     message: "✅ Delivery available",
      //   });

      //   toast.success("Pincode verified successfully");
      // } else {
      //   setPincodeStatus({
      //     verified: false,
      //     loading: false,
      //     message: "❌ Not serviceable",
      //   });

      //   toast.error(data.message || "Pincode not serviceable");
      // }

      if (!data.valid) {
        setPincodeStatus({
          verified: false,
          loading: false,
          message: "❌ Not serviceable",
        });

        toast.error(data.message || "Pincode not serviceable");
        return;
      }

      // ✅ FETCH PINCODE DETAILS
      const postalRes = await fetch(
        `https://api.postalpincode.in/pincode/${form.pincode}`
      );

      const postalData = await postalRes.json();

      console.log("Postal API Response:", postalData);

      if (
        postalData &&
        postalData[0]?.Status === "Success" &&
        postalData[0]?.PostOffice?.length > 0
      ) {
        const office = postalData[0].PostOffice[0];

        const district = office.District || "";
        const state = office.State || "";
        const country = office.Country || "India";

        setForm((prev) => ({
          ...prev,
          city: district,
          state: `${state}, ${country}`,
        }));
      }

      setPincodeStatus({
        verified: true,
        loading: false,
        message: "✅ Delivery available",
      });

      toast.success("Pincode verified successfully");

    } catch (err) {
      console.error(err);
      setPincodeStatus({
        verified: false,
        loading: false,
        message: "❌ Error verifying pincode",
      });

      toast.error("Error verifying pincode");
    }
  };

  const handleAddAddress = () => {
    if (!validateForm()) return;

    dispatch(updateAddress({ address: form }))
      .unwrap()
      .then(() => {
        dispatch(fetchAddresses());

        // ✅ SEND NEW ADDRESS TO PARENT
        onSave({
          fullName: form.fullName,
          phone: form.phone,
          addressLine: form.addressLine,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        });
        // ✅ reset only after success
        setForm({
          fullName: "",
          phone: "",
          pincode: "",
          city: "",
          state: "",
          addressLine: "",
          landmark: "",
          addressType: "Home",
        });

        onClose();
      })
      .catch((err) => {
        toast.error("❌ Something went wrong. Please try after some time.")
        console.error("Error:", err);
      });
  };

  const close = () => {
    setForm({
      fullName: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      addressLine: "",
      landmark: "",
      addressType: "Home",
    })

    setErrors(
      {
        fullName: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        addressLine: "",
      }
    )

    setPincodeStatus(
      {
        verified: false,
        loading: false,
        message: "",
      }
    )

    onClose();
  }

  return (
    <div className="ck-modal-overlay">
      <div className="ck-modal large">

        {/* Header */}
        <div className="ck-modal-header">
          <h3>Add New Address</h3>
          <button style={{ cursor: 'pointer' }} onClick={close}>✖</button>
        </div>

        {/* Form */}
        <div className="ck-form-grid">

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              name="pincode"
              maxLength={6}
              placeholder="Pincode *"
              value={form.pincode}
              onChange={handleChange}
              disabled={pincodeStatus.verified}   // 🔥 LOCK AFTER VERIFY
              style={{
                background: pincodeStatus.verified ? "#f5f5f5" : "#fff",
                cursor: pincodeStatus.verified ? "not-allowed" : "text",
              }}
            />

            <button
              type="button"
              onClick={verifyPincodeAPI}
              disabled={
                pincodeStatus.loading ||
                form.pincode.length !== 6 ||
                pincodeStatus.verified
              }
              style={{
                padding: "8px 12px",
                background:
                  pincodeStatus.verified
                    ? "#9e9e9e"
                    : form.pincode.length !== 6
                      ? "#ccc"
                      : "#4caf50",
                cursor:
                  pincodeStatus.verified || form.pincode.length !== 6
                    ? "not-allowed"
                    : "pointer",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                opacity: pincodeStatus.loading ? 0.7 : 1,
              }}
            >
              {pincodeStatus.loading
                ? "Checking..."
                : pincodeStatus.verified
                  ? "Verified"
                  : "Verify"}
            </button>
          </div>

          {/* Error */}
          {errors.pincode && <p className="error">{errors.pincode}</p>}

          {/* Status Message */}
          {pincodeStatus.message && (
            <p
              style={{
                color: pincodeStatus.verified ? "green" : "red",
                fontSize: "13px",
              }}
            >
              {pincodeStatus.message}
            </p>
          )}

          <input
            name="fullName"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          <input
            name="phone"
            placeholder="Mobile Number *"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}





          <input
            name="city"
            placeholder="District *"
            value={form.city}
            onChange={handleChange}
            readOnly={pincodeStatus.verified}
            style={{
              background: pincodeStatus.verified ? "#f5f5f5" : "#fff",
              cursor: pincodeStatus.verified ? "not-allowed" : "text",
            }}
          />
          {errors.city && <p className="error">{errors.city}</p>}


          <input
            name="state"
            placeholder="State *"
            value={form.state}
            onChange={handleChange}
            readOnly={pincodeStatus.verified}
            style={{
              background: pincodeStatus.verified ? "#f5f5f5" : "#fff",
              cursor: pincodeStatus.verified ? "not-allowed" : "text",
            }}
          />
          {errors.state && <p className="error">{errors.state}</p>}

          <textarea
            name="addressLine"
            value={form.addressLine}
            placeholder="Full Address (House no, Area, Street, City) *"
            onChange={handleChange}
          />
          {errors.addressLine && <p className="error">{errors.addressLine}</p>}

          <input
            name="landmark"
            value={form.landmark}
            placeholder="Landmark (Optional)"
            onChange={handleChange}
          />


          {/* Address Type */}
          {/* <div className="ck-address-type">
            <label>
              <input
                type="radio"
                name="addressType"
                value="Home"
                checked={form.addressType === "Home"}
                onChange={handleChange}
              />
              Home
            </label>

            <label>
              <input
                type="radio"
                name="addressType"
                value="Work"
                checked={form.addressType === "Work"}
                onChange={handleChange}
              />
              Work
            </label>
          </div> */}
        </div>

        {/* Footer */}


        <button
          className="ck-confirm-btn"
          style={{
            marginTop: 12,
            background: loading || !pincodeStatus.verified ? "#ccc" : "#4caf50",
            cursor: loading || !pincodeStatus.verified ? "not-allowed" : "pointer",
            opacity: loading || !pincodeStatus.verified ? 0.7 : 1,
          }}
          disabled={loading || !pincodeStatus.verified}
          onClick={() => {
            handleAddAddress();
          }}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
};